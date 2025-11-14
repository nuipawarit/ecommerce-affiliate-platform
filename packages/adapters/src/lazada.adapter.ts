import type { IMarketplaceAdapter, MarketplaceProduct } from './types';
import { createInvalidUrlError } from './errors';
import {
  isValidLazadaUrl,
  extractLazadaProductId,
  generateMockProduct,
  searchMockProducts
} from './utils';

export class LazadaAdapter implements IMarketplaceAdapter {
  async fetchProduct(url: string): Promise<MarketplaceProduct> {
    if (!isValidLazadaUrl(url)) {
      throw createInvalidUrlError('Lazada', url);
    }

    try {
      const productId = extractLazadaProductId(url);
      const product = generateMockProduct('lazada', productId, url);

      return product;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot extract')) {
        throw createInvalidUrlError('Lazada', url);
      }
      throw error;
    }
  }

  async searchProducts(keyword: string): Promise<MarketplaceProduct[]> {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    const results = searchMockProducts('lazada', keyword);
    return results;
  }
}
