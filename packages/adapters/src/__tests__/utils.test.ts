import { describe, it, expect } from 'bun:test';
import {
  isValidLazadaUrl,
  isValidShopeeUrl,
  extractLazadaProductId,
  extractShopeeProductId,
  generateMockProduct,
  searchMockProducts
} from '../utils';

describe('URL Validation Utilities', () => {
  describe('isValidLazadaUrl', () => {
    it('should validate correct Lazada URLs', () => {
      const validUrls = [
        'https://www.lazada.co.th/products/test-i123456.html',
        'https://lazada.co.th/products/test-i123456.html',
        'http://www.lazada.com/products/test-i123456.html',
        'https://www.lazada.co.th/products/matcha-powder-premium-grade-i987654.html'
      ];

      validUrls.forEach(url => {
        expect(isValidLazadaUrl(url)).toBe(true);
      });
    });

    it('should reject invalid Lazada URLs', () => {
      const invalidUrls = [
        'https://shopee.co.th/product/123/456',
        'https://google.com',
        'not-a-url',
        '',
        'https://lazada.co.th/',
        'https://lazada.co.th/products/no-product-id.html'
      ];

      invalidUrls.forEach(url => {
        expect(isValidLazadaUrl(url)).toBe(false);
      });
    });
  });

  describe('isValidShopeeUrl', () => {
    it('should validate correct Shopee SEO URLs', () => {
      const validUrls = [
        'https://shopee.co.th/Product-Name-i.123.456',
        'https://shopee.co.th/Matcha-Powder-i.5696604.15949131744',
        'https://shopee.co.th/Test-Product-i.1.2'
      ];

      validUrls.forEach(url => {
        expect(isValidShopeeUrl(url)).toBe(true);
      });
    });

    it('should validate correct Shopee simple URLs', () => {
      const validUrls = [
        'https://shopee.co.th/product/123/456',
        'https://shopee.co.th/product/5696604/15949131744'
      ];

      validUrls.forEach(url => {
        expect(isValidShopeeUrl(url)).toBe(true);
      });
    });

    it('should reject invalid Shopee URLs', () => {
      const invalidUrls = [
        'https://lazada.co.th/products/test-i123456.html',
        'https://google.com',
        'not-a-url',
        '',
        'https://shopee.co.th/',
        'https://shopee.co.th/product/'
      ];

      invalidUrls.forEach(url => {
        expect(isValidShopeeUrl(url)).toBe(false);
      });
    });
  });
});

describe('Product ID Extraction', () => {
  describe('extractLazadaProductId', () => {
    it('should extract product ID from valid URL', () => {
      const testCases = [
        { url: 'https://www.lazada.co.th/products/test-i123456.html', expected: '123456' },
        { url: 'https://lazada.com/products/product-i789012.html', expected: '789012' },
        { url: 'https://www.lazada.co.th/products/matcha-i111.html', expected: '111' }
      ];

      testCases.forEach(({ url, expected }) => {
        expect(extractLazadaProductId(url)).toBe(expected);
      });
    });

    it('should throw error for invalid URL', () => {
      const invalidUrls = [
        'https://invalid.com',
        'https://lazada.co.th/products/no-id.html',
        ''
      ];

      invalidUrls.forEach(url => {
        expect(() => extractLazadaProductId(url)).toThrow();
      });
    });
  });

  describe('extractShopeeProductId', () => {
    it('should extract IDs from SEO URL', () => {
      const url = 'https://shopee.co.th/Product-Name-i.123456.789012';
      const result = extractShopeeProductId(url);

      expect(result.shopId).toBe('123456');
      expect(result.itemId).toBe('789012');
    });

    it('should extract IDs from simple URL', () => {
      const url = 'https://shopee.co.th/product/123456/789012';
      const result = extractShopeeProductId(url);

      expect(result.shopId).toBe('123456');
      expect(result.itemId).toBe('789012');
    });

    it('should throw error for invalid URL', () => {
      const invalidUrls = [
        'https://invalid.com',
        'https://shopee.co.th/',
        ''
      ];

      invalidUrls.forEach(url => {
        expect(() => extractShopeeProductId(url)).toThrow();
      });
    });
  });
});

describe('Mock Product Generation', () => {
  describe('generateMockProduct', () => {
    it('should generate Lazada product with correct marketplace', () => {
      const url = 'https://www.lazada.co.th/products/test-i123456.html';
      const product = generateMockProduct('lazada', '123456', url);

      expect(product.marketplace).toBe('lazada');
      expect(product.url).toBe(url);
      expect(product.storeName).toContain('Lazada');
    });

    it('should generate Shopee product with correct marketplace', () => {
      const url = 'https://shopee.co.th/product/123456/789012';
      const product = generateMockProduct('shopee', '123456789012', url);

      expect(product.marketplace).toBe('shopee');
      expect(product.url).toBe(url);
      expect(product.storeName).toContain('Shopee');
    });

    it('should generate product with all required fields', () => {
      const url = 'https://www.lazada.co.th/products/test-i123456.html';
      const product = generateMockProduct('lazada', '123456', url);

      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('imageUrl');
      expect(product).toHaveProperty('storeName');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('marketplace');
      expect(product).toHaveProperty('url');

      expect(product.title).toBeString();
      expect(product.title.length).toBeGreaterThan(0);
      expect(product.imageUrl).toContain('http');
      expect(product.price).toBeNumber();
      expect(product.price).toBeGreaterThan(0);
    });

    it('should generate realistic price variance', () => {
      const url = 'https://www.lazada.co.th/products/test-i123456.html';

      const products = [
        generateMockProduct('lazada', '123456', url),
        generateMockProduct('lazada', '123456', url),
        generateMockProduct('lazada', '123456', url)
      ];

      const hasPriceVariance = products.some((p, i) =>
        products.some((other, j) => i !== j && p.price !== other.price)
      );
      expect(hasPriceVariance).toBe(true);
    });

    it('should generate different products for different IDs', () => {
      const product1 = generateMockProduct('lazada', '100001', 'url1');
      const product2 = generateMockProduct('lazada', '200002', 'url2');

      expect(product1.title).not.toBe(product2.title);
    });
  });

  describe('searchMockProducts', () => {
    it('should return empty array for empty keyword', () => {
      const results = searchMockProducts('lazada', '');
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace keyword', () => {
      const results = searchMockProducts('lazada', '   ');
      expect(results).toEqual([]);
    });

    it('should return matching products for matcha keyword', () => {
      const results = searchMockProducts('lazada', 'matcha');

      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(5);

      results.forEach(product => {
        expect(product.marketplace).toBe('lazada');
        expect(product.title.toLowerCase()).toContain('matcha');
      });
    });

    it('should return matching products for coffee keyword', () => {
      const results = searchMockProducts('shopee', 'coffee');

      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.marketplace).toBe('shopee');
      });
    });

    it('should be case insensitive', () => {
      const results1 = searchMockProducts('lazada', 'MATCHA');
      const results2 = searchMockProducts('lazada', 'matcha');

      expect(results1.length).toBe(results2.length);
      expect(results1.length).toBeGreaterThan(0);
    });

    it('should match by product category', () => {
      const results = searchMockProducts('lazada', 'electronics');

      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.marketplace).toBe('lazada');
      });
    });

    it('should limit results to 5 products', () => {
      const results = searchMockProducts('lazada', 'food');

      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('should generate valid URLs for results', () => {
      const lazadaResults = searchMockProducts('lazada', 'coffee');
      lazadaResults.forEach(product => {
        expect(product.url).toContain('lazada.co.th');
        expect(product.url).toMatch(/-i\d+/);
      });

      const shopeeResults = searchMockProducts('shopee', 'coffee');
      shopeeResults.forEach(product => {
        expect(product.url).toContain('shopee.co.th');
        expect(product.url).toMatch(/-i\.\d+\.\d+/);
      });
    });

    it('should return different prices in search results', () => {
      const results = searchMockProducts('lazada', 'matcha');

      if (results.length > 1) {
        const allPricesEqual = results.every((p, i) =>
          i === 0 || p.price === results[0]?.price
        );
        expect(allPricesEqual).toBe(false);
      }
    });
  });
});
