import { describe, it, expect, beforeEach } from 'bun:test';
import { LazadaAdapter } from '../lazada.adapter';
import { MarketplaceError } from '../errors';

describe('LazadaAdapter', () => {
  let adapter: LazadaAdapter;

  beforeEach(() => {
    adapter = new LazadaAdapter();
  });

  describe('fetchProduct', () => {
    it('should extract product from valid Lazada .co.th URL', async () => {
      const url = 'https://www.lazada.co.th/products/matcha-powder-i123456.html';
      const product = await adapter.fetchProduct(url);

      expect(product).toBeDefined();
      expect(product.marketplace).toBe('lazada');
      expect(product.title).toBeString();
      expect(product.imageUrl).toBeString();
      expect(product.storeName).toContain('Lazada');
      expect(product.price).toBeNumber();
      expect(product.price).toBeGreaterThan(0);
      expect(product.url).toBe(url);
    });

    it('should extract product from valid Lazada .com URL', async () => {
      const url = 'https://www.lazada.com/products/coffee-beans-i789012.html';
      const product = await adapter.fetchProduct(url);

      expect(product).toBeDefined();
      expect(product.marketplace).toBe('lazada');
    });

    it('should extract product from URL without www', async () => {
      const url = 'https://lazada.co.th/products/honey-i345678.html';
      const product = await adapter.fetchProduct(url);

      expect(product).toBeDefined();
      expect(product.marketplace).toBe('lazada');
    });

    it('should throw MarketplaceError for invalid URL', async () => {
      const invalidUrls = [
        'https://invalid-url.com',
        'https://shopee.co.th/product/123/456',
        'not-a-url',
        ''
      ];

      for (const url of invalidUrls) {
        try {
          await adapter.fetchProduct(url);
          expect(true).toBe(false);
        } catch (error) {
          expect(error).toBeInstanceOf(MarketplaceError);
          if (error instanceof MarketplaceError) {
            expect(error.marketplace).toBe('Lazada');
          }
        }
      }
    });

    it('should return consistent MarketplaceProduct structure', async () => {
      const url = 'https://www.lazada.co.th/products/test-i123456.html';
      const product = await adapter.fetchProduct(url);

      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('imageUrl');
      expect(product).toHaveProperty('storeName');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('marketplace');
      expect(product).toHaveProperty('url');

      expect(typeof product.title).toBe('string');
      expect(typeof product.imageUrl).toBe('string');
      expect(typeof product.storeName).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(typeof product.marketplace).toBe('string');
      expect(typeof product.url).toBe('string');
    });

    it('should return different products for different IDs', async () => {
      const url1 = 'https://www.lazada.co.th/products/test-i100001.html';
      const url2 = 'https://www.lazada.co.th/products/test-i200002.html';

      const product1 = await adapter.fetchProduct(url1);
      const product2 = await adapter.fetchProduct(url2);

      expect(product1.title).not.toBe(product2.title);
    });

    it('should generate realistic price variance', async () => {
      const url = 'https://www.lazada.co.th/products/test-i123456.html';

      const products = await Promise.all([
        adapter.fetchProduct(url),
        adapter.fetchProduct(url),
        adapter.fetchProduct(url)
      ]);

      const hasPriceVariance = products.some((p, i) =>
        products.some((other, j) => i !== j && p.price !== other.price)
      );
      expect(hasPriceVariance).toBe(true);
    });
  });

  describe('searchProducts', () => {
    it('should return empty array for empty keyword', async () => {
      const results = await adapter.searchProducts('');
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace keyword', async () => {
      const results = await adapter.searchProducts('   ');
      expect(results).toEqual([]);
    });

    it('should return matching products for valid keyword', async () => {
      const results = await adapter.searchProducts('matcha');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(5);

      results.forEach(product => {
        expect(product.marketplace).toBe('lazada');
        expect(product.title.toLowerCase()).toContain('matcha');
        expect(product.price).toBeNumber();
        expect(product.price).toBeGreaterThan(0);
      });
    });

    it('should return products for coffee keyword', async () => {
      const results = await adapter.searchProducts('coffee');

      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.marketplace).toBe('lazada');
      });
    });

    it('should return products for electronics keyword', async () => {
      const results = await adapter.searchProducts('iphone');

      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.marketplace).toBe('lazada');
      });
    });

    it('should return products with consistent structure', async () => {
      const results = await adapter.searchProducts('organic');

      results.forEach(product => {
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('imageUrl');
        expect(product).toHaveProperty('storeName');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('marketplace');
        expect(product).toHaveProperty('url');
      });
    });

    it('should limit results to 5 products maximum', async () => {
      const results = await adapter.searchProducts('shoes');

      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('should be case insensitive', async () => {
      const results1 = await adapter.searchProducts('MATCHA');
      const results2 = await adapter.searchProducts('matcha');

      expect(results1.length).toBe(results2.length);
    });
  });
});
