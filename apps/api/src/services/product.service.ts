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

  async createFromUrl(url: string, marketplace: 'lazada' | 'shopee') {
    const adapter = this.getAdapter(marketplace);
    const productData = await adapter.fetchProduct(url);

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
}
