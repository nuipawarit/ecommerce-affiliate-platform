import { describe, it, expect, beforeEach } from 'bun:test';
import { ProductService } from '../product.service';
import { LazadaAdapter, ShopeeAdapter } from '@repo/adapters';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
  });

  describe('getAdapter', () => {
    it('should return LazadaAdapter for lazada marketplace', () => {
      const adapter = (service as any).getAdapter('lazada');
      expect(adapter).toBeInstanceOf(LazadaAdapter);
    });

    it('should return ShopeeAdapter for shopee marketplace', () => {
      const adapter = (service as any).getAdapter('shopee');
      expect(adapter).toBeInstanceOf(ShopeeAdapter);
    });

    it('should throw error for unknown marketplace', () => {
      expect(() => {
        (service as any).getAdapter('unknown');
      }).toThrow('Unknown marketplace: unknown');
    });
  });

  describe('mapMarketplaceToEnum', () => {
    it('should convert lazada to LAZADA', () => {
      const result = (service as any).mapMarketplaceToEnum('lazada');
      expect(result).toBe('LAZADA');
    });

    it('should convert shopee to SHOPEE', () => {
      const result = (service as any).mapMarketplaceToEnum('shopee');
      expect(result).toBe('SHOPEE');
    });
  });
});
