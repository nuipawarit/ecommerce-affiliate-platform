import { describe, it, expect, beforeEach } from 'bun:test';
import { ShopeeAdapter } from '../shopee.adapter';
import { MarketplaceError } from '../errors';

describe('ShopeeAdapter', () => {
  let adapter: ShopeeAdapter;

  beforeEach(() => {
    adapter = new ShopeeAdapter();
  });

  describe('fetchProduct', () => {
    it('should extract product from SEO-friendly URL', async () => {
      const url = 'https://shopee.co.th/Matcha-Powder-Premium-i.123456.789012';
      const product = await adapter.fetchProduct(url);

      expect(product).toBeDefined();
      expect(product.marketplace).toBe('shopee');
      expect(product.title).toBeString();
      expect(product.imageUrl).toBeString();
      expect(product.storeName).toContain('Shopee');
      expect(product.price).toBeNumber();
      expect(product.price).toBeGreaterThan(0);
      expect(product.url).toBe(url);
    });

    it('should extract product from simple URL format', async () => {
      const url = 'https://shopee.co.th/product/123456/789012';
      const product = await adapter.fetchProduct(url);

      expect(product).toBeDefined();
      expect(product.marketplace).toBe('shopee');
    });

    it('should extract product from URL with dashes', async () => {
      const url = 'https://shopee.co.th/Coffee-Beans-Arabica-Premium-i.456789.123456';
      const product = await adapter.fetchProduct(url);

      expect(product).toBeDefined();
      expect(product.marketplace).toBe('shopee');
    });

    it('should throw MarketplaceError for invalid URL', async () => {
      const invalidUrls = [
        'https://invalid-url.com',
        'https://lazada.co.th/products/test-i123456.html',
        'not-a-url',
        '',
        'https://shopee.co.th/'
      ];

      for (const url of invalidUrls) {
        try {
          await adapter.fetchProduct(url);
          expect(true).toBe(false);
        } catch (error) {
          expect(error).toBeInstanceOf(MarketplaceError);
          if (error instanceof MarketplaceError) {
            expect(error.marketplace).toBe('Shopee');
          }
        }
      }
    });

    it('should return consistent MarketplaceProduct structure', async () => {
      const url = 'https://shopee.co.th/product/123456/789012';
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
      const url1 = 'https://shopee.co.th/product/100001/200001';
      const url2 = 'https://shopee.co.th/product/100002/200002';

      const product1 = await adapter.fetchProduct(url1);
      const product2 = await adapter.fetchProduct(url2);

      expect(product1.title).not.toBe(product2.title);
    });

    it('should handle both URL formats consistently', async () => {
      const seoUrl = 'https://shopee.co.th/Product-Name-i.123456.789012';
      const simpleUrl = 'https://shopee.co.th/product/123456/789012';

      const product1 = await adapter.fetchProduct(seoUrl);
      const product2 = await adapter.fetchProduct(simpleUrl);

      expect(product1.marketplace).toBe(product2.marketplace);
      expect(product1.title).toBe(product2.title);
    });

    it('should generate realistic price variance', async () => {
      const url = 'https://shopee.co.th/product/123456/789012';

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
        expect(product.marketplace).toBe('shopee');
        expect(product.title.toLowerCase()).toContain('matcha');
        expect(product.price).toBeNumber();
        expect(product.price).toBeGreaterThan(0);
      });
    });

    it('should return products for coffee keyword', async () => {
      const results = await adapter.searchProducts('coffee');

      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.marketplace).toBe('shopee');
      });
    });

    it('should return products for electronics keyword', async () => {
      const results = await adapter.searchProducts('samsung');

      expect(results.length).toBeGreaterThan(0);
      results.forEach(product => {
        expect(product.marketplace).toBe('shopee');
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

    it('should generate valid Shopee URLs in search results', async () => {
      const results = await adapter.searchProducts('coffee');

      results.forEach(product => {
        expect(product.url).toContain('shopee.co.th');
        expect(product.url).toMatch(/shopee\.co\.th\/.*?-i\.\d+\.\d+/);
      });
    });

    it('should limit results to 5 products maximum', async () => {
      const results = await adapter.searchProducts('phone');

      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('should be case insensitive', async () => {
      const results1 = await adapter.searchProducts('COFFEE');
      const results2 = await adapter.searchProducts('coffee');

      expect(results1.length).toBe(results2.length);
    });
  });
});
