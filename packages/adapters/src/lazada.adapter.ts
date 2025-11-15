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

  async fetchProductBySku(sku: string): Promise<MarketplaceProduct> {
    if (!sku || sku.trim() === '') {
      throw new Error('SKU is required');
    }

    const mockUrl = `https://www.lazada.co.th/products/product-${sku.toLowerCase()}-i${Date.now()}.html`;
    const product = generateMockProduct('lazada', sku, mockUrl);

    return product;
  }

  async searchProducts(keyword: string): Promise<MarketplaceProduct[]> {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    const results = searchMockProducts('lazada', keyword);
    return results.map(result => ({
      ...result,
      url: result.url || `https://www.lazada.co.th/products/product-${keyword.toLowerCase()}-i${Date.now()}.html`
    }));
  }
}
