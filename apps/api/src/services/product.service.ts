import { prisma } from '@repo/database';
import { LazadaAdapter, ShopeeAdapter } from '@repo/adapters';
import type { IMarketplaceAdapter } from '@repo/adapters';
import { Marketplace, type Offer } from '@prisma/client';
import { NotFoundError } from '../middleware/error-handler';

export class ProductService {
  private getAdapter(marketplace: string): IMarketplaceAdapter {
    switch (marketplace.toLowerCase()) {
      case 'lazada':
        return new LazadaAdapter();
      case 'shopee':
        return new ShopeeAdapter();
      default:
        throw new Error(`Unknown marketplace: ${marketplace}`);
    }
  }

  private mapMarketplaceToEnum(marketplace: 'lazada' | 'shopee'): Marketplace {
    return marketplace.toUpperCase() as Marketplace;
  }

  private detectMarketplace(url: string): 'lazada' | 'shopee' {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('lazada')) return 'lazada';
    if (lowerUrl.includes('shopee')) return 'shopee';
    throw new Error('Cannot detect marketplace from URL. URL must contain "lazada" or "shopee"');
  }

  async create(input: { url?: string; sku?: string; marketplace: 'lazada' | 'shopee' }) {
    const { url, sku, marketplace } = input;

    if (!url && !sku) {
      throw new Error('Either URL or SKU must be provided');
    }

    const adapter = this.getAdapter(marketplace);
    const productData = url
      ? await adapter.fetchProduct(url)
      : await adapter.fetchProductBySku(sku!);

    const existingProduct = await prisma.product.findFirst({
      where: {
        title: productData.title
      },
      include: {
        offers: {
          where: {
            marketplace: this.mapMarketplaceToEnum(marketplace),
            url: productData.url
          }
        }
      }
    });

    if (existingProduct && existingProduct.offers.length > 0) {
      return existingProduct;
    }

    if (existingProduct) {
      const updatedProduct = await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          imageUrl: productData.imageUrl,
          offers: {
            create: {
              marketplace: this.mapMarketplaceToEnum(productData.marketplace),
              storeName: productData.storeName,
              price: productData.price,
              url: productData.url,
              sku: productData.sku,
              isActive: true,
              lastCheckedAt: new Date()
            }
          }
        },
        include: {
          offers: true
        }
      });
      return updatedProduct;
    }

    const product = await prisma.product.create({
      data: {
        title: productData.title,
        imageUrl: productData.imageUrl,
        offers: {
          create: {
            marketplace: this.mapMarketplaceToEnum(productData.marketplace),
            storeName: productData.storeName,
            price: productData.price,
            url: productData.url,
            sku: productData.sku,
            isActive: true,
            lastCheckedAt: new Date()
          }
        }
      },
      include: {
        offers: true
      }
    });

    return product;
  }

  async createFromUrl(url: string, marketplace: 'lazada' | 'shopee') {
    return this.create({ url, marketplace });
  }

  async searchProducts(input: { url?: string; sku?: string }) {
    const { url, sku } = input;

    if (!url && !sku) {
      throw new Error('Either URL or SKU must be provided');
    }

    if (url) {
      const marketplace = this.detectMarketplace(url);
      const adapter = this.getAdapter(marketplace);
      try {
        const product = await adapter.fetchProduct(url);
        return [product];
      } catch (error) {
        return [];
      }
    }

    if (sku) {
      const lazadaAdapter = new LazadaAdapter();
      const shopeeAdapter = new ShopeeAdapter();

      const [lazadaResults, shopeeResults] = await Promise.all([
        lazadaAdapter.searchProducts(sku).catch(() => []),
        shopeeAdapter.searchProducts(sku).catch(() => [])
      ]);

      return [...lazadaResults, ...shopeeResults];
    }

    return [];
  }

  async getAllProducts(filters?: { page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        include: {
          offers: {
            orderBy: { price: 'asc' }
          },
          _count: {
            select: { links: true, campaignProducts: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count()
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        offers: {
          orderBy: { price: 'asc' }
        },
        _count: {
          select: { links: true, campaignProducts: true }
        }
      }
    });

    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    return product;
  }

  async getProductOffers(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, title: true }
    });

    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    const offers = await prisma.offer.findMany({
      where: { productId: id },
      orderBy: { price: 'asc' }
    });

    return {
      product,
      offers
    };
  }

  async refreshProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        offers: true
      }
    });

    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    const updatePromises = product.offers.map(async (offer: Offer) => {
      const marketplace = offer.marketplace.toLowerCase() as 'lazada' | 'shopee';
      const adapter = this.getAdapter(marketplace);

      try {
        const freshData = await adapter.fetchProduct(offer.url);

        if (freshData.price !== offer.price) {
          await prisma.offer.update({
            where: { id: offer.id },
            data: {
              price: freshData.price,
              storeName: freshData.storeName,
              lastCheckedAt: new Date()
            }
          });
        } else {
          await prisma.offer.update({
            where: { id: offer.id },
            data: {
              lastCheckedAt: new Date()
            }
          });
        }
      } catch (error) {
        console.error(`Failed to refresh offer ${offer.id}:`, error);
      }
    });

    await Promise.all(updatePromises);

    const refreshedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        offers: {
          orderBy: { price: 'asc' }
        }
      }
    });

    return refreshedProduct;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    if (s1 === s2) return 1;

    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 1;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0]![j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i]![j] = matrix[i - 1]![j - 1]!;
        } else {
          matrix[i]![j] = Math.min(
            matrix[i - 1]![j - 1]! + 1,
            matrix[i]![j - 1]! + 1,
            matrix[i - 1]![j]! + 1
          );
        }
      }
    }

    return matrix[str2.length]![str1.length]!;
  }

  async findSimilarProducts(title: string, threshold: number = 0.8) {
    const allProducts = await prisma.product.findMany({
      include: {
        offers: {
          orderBy: { price: 'asc' }
        }
      }
    });

    const similarProducts = allProducts
      .map(product => ({
        product,
        similarity: this.calculateSimilarity(title, product.title)
      }))
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);

    return similarProducts.map(item => item.product);
  }

  async addOfferToProduct(productId: string, input: { url: string; marketplace: 'lazada' | 'shopee' }) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { offers: true }
    });

    if (!product) {
      throw new NotFoundError(`Product with id ${productId} not found`);
    }

    const adapter = this.getAdapter(input.marketplace);
    const productData = await adapter.fetchProduct(input.url);

    const existingOffer = product.offers.find(
      offer => offer.marketplace === this.mapMarketplaceToEnum(input.marketplace) && offer.url === input.url
    );

    if (existingOffer) {
      return product;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        offers: {
          create: {
            marketplace: this.mapMarketplaceToEnum(productData.marketplace),
            storeName: productData.storeName,
            price: productData.price,
            url: productData.url,
            sku: productData.sku,
            isActive: true,
            lastCheckedAt: new Date()
          }
        }
      },
      include: {
        offers: {
          orderBy: { price: 'asc' }
        }
      }
    });

    return updatedProduct;
  }
}
