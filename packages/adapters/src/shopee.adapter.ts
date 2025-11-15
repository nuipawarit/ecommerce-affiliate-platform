import type { IMarketplaceAdapter, MarketplaceProduct } from './types';
import { createInvalidUrlError } from './errors';
import {
  isValidShopeeUrl,
  extractShopeeProductId,
  generateMockProduct,
  searchMockProducts
} from './utils';

export class ShopeeAdapter implements IMarketplaceAdapter {
  async fetchProduct(url: string): Promise<MarketplaceProduct> {
    if (!isValidShopeeUrl(url)) {
      throw createInvalidUrlError('Shopee', url);
    }

    try {
      const { shopId, itemId } = extractShopeeProductId(url);
      const productId = `${shopId}${itemId}`;
      const product = generateMockProduct('shopee', productId, url);

      return product;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot extract')) {
        throw createInvalidUrlError('Shopee', url);
      }
      throw error;
    }
  }

  async fetchProductBySku(sku: string): Promise<MarketplaceProduct> {
    if (!sku || sku.trim() === '') {
      throw new Error('SKU is required');
    }

    const mockShopId = Math.floor(Math.random() * 100000);
    const mockItemId = Math.floor(Math.random() * 1000000);
    const mockUrl = `https://shopee.co.th/product-${sku.toLowerCase()}.${mockShopId}.${mockItemId}`;
    const product = generateMockProduct('shopee', sku, mockUrl);

    return product;
  }

  async searchProducts(keyword: string): Promise<MarketplaceProduct[]> {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    const results = searchMockProducts('shopee', keyword);
    const mockShopId = Math.floor(Math.random() * 100000);
    return results.map(result => ({
      ...result,
      url: result.url || `https://shopee.co.th/product-${keyword.toLowerCase()}.${mockShopId}.${Date.now()}`
    }));
  }
}
