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

  async searchProducts(keyword: string): Promise<MarketplaceProduct[]> {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    const results = searchMockProducts('shopee', keyword);
    return results;
  }
}
