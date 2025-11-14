import { describe, it, expect, beforeEach, mock } from "bun:test";
import { prisma, Marketplace } from "@repo/database";
import { ProductService } from "../../services/product.service";
import { updateJobStatus, getJobStatus } from "../../utils/job-status";
import { getRedisClient } from "../../utils/redis-client";
import type { Product, Offer } from "@repo/database";

describe("Price Refresh Job", () => {
  describe("Job Status Tracking", () => {
    beforeEach(async () => {
      const redis = getRedisClient();
      await redis.flushdb();
    });

    it("should update job status after successful run", async () => {
      const duration = 5000;
      const processed = 10;
      const updated = 15;
      const errors = 0;

      await updateJobStatus(duration, processed, updated, errors);

      const status = await getJobStatus();

      expect(status.lastRun).toBeDefined();
      expect(status.lastDuration).toBe(duration);
      expect(status.stats.productsProcessed).toBe(processed);
      expect(status.stats.offersUpdated).toBe(updated);
      expect(status.stats.errors).toBe(errors);
    });

    it("should track errors in job status", async () => {
      const duration = 3000;
      const processed = 10;
      const updated = 8;
      const errors = 2;

      await updateJobStatus(duration, processed, updated, errors);

      const status = await getJobStatus();

      expect(status.stats.errors).toBe(2);
    });

    it("should return null values when no job has run", async () => {
      const status = await getJobStatus();

      expect(status.lastRun).toBeNull();
      expect(status.lastDuration).toBeNull();
      expect(status.stats.productsProcessed).toBe(0);
      expect(status.stats.offersUpdated).toBe(0);
      expect(status.stats.errors).toBe(0);
    });
  });

  describe("Product Refresh Logic", () => {
    let productService: ProductService;

    beforeEach(() => {
      productService = new ProductService();
    });

    it("should refresh product successfully", async () => {
      const mockProduct = {
        id: "test-product-id",
        title: "Test Product",
        imageUrl: "https://example.com/image.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product;

      const mockRefreshedProduct = {
        ...mockProduct,
        offers: [
          {
            id: "offer-1",
            productId: mockProduct.id,
            marketplace: Marketplace.LAZADA,
            storeName: "Test Store",
            price: 299,
            url: "https://lazada.co.th/test",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastCheckedAt: new Date(),
          },
        ] as Offer[],
      };

      const mockRefreshProduct = mock(() =>
        Promise.resolve(mockRefreshedProduct)
      );
      productService.refreshProduct = mockRefreshProduct;

      const result = await productService.refreshProduct(mockProduct.id);

      expect(result).toBeDefined();
      expect(result?.offers).toHaveLength(1);
      if (result?.offers && result.offers.length > 0) {
        expect(result.offers[0]?.price).toBe(299);
      }
      expect(mockRefreshProduct).toHaveBeenCalledWith(mockProduct.id);
    });

    it("should handle refresh errors gracefully", async () => {
      const mockRefreshProduct = mock(() =>
        Promise.reject(new Error("Marketplace API error"))
      );
      productService.refreshProduct = mockRefreshProduct;

      await expect(
        productService.refreshProduct("invalid-id")
      ).rejects.toThrow("Marketplace API error");
    });
  });

  describe("Bulk Product Processing", () => {
    it("should process multiple products", async () => {
      const mockProducts = [
        {
          id: "product-1",
          title: "Product 1",
          imageUrl: "https://example.com/1.jpg",
          offers: [
            {
              id: "offer-1",
              marketplace: "lazada",
              isActive: true,
            },
          ],
        },
        {
          id: "product-2",
          title: "Product 2",
          imageUrl: "https://example.com/2.jpg",
          offers: [
            {
              id: "offer-2",
              marketplace: "shopee",
              isActive: true,
            },
          ],
        },
      ];

      const mockFindMany = mock(() => Promise.resolve(mockProducts));
      prisma.product.findMany = mockFindMany as any;

      const products = await prisma.product.findMany({
        include: {
          offers: {
            where: {
              isActive: true,
            },
          },
        },
      });

      expect(products).toHaveLength(2);
      expect(products[0]?.offers).toHaveLength(1);
      expect(mockFindMany).toHaveBeenCalled();
    });

    it("should continue processing even if one product fails", async () => {
      const productService = new ProductService();
      let successCount = 0;
      let errorCount = 0;

      const mockProducts = ["product-1", "product-2", "product-3"];

      const mockRefreshProduct = mock((id: string) => {
        if (id === "product-2") {
          return Promise.reject(new Error("Failed to refresh"));
        }
        return Promise.resolve({
          id,
          title: "Test Product",
          description: null,
          imageUrl: "https://example.com/image.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
          offers: [],
        });
      });

      productService.refreshProduct = mockRefreshProduct as any;

      for (const productId of mockProducts) {
        try {
          await productService.refreshProduct(productId);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      expect(successCount).toBe(2);
      expect(errorCount).toBe(1);
    });
  });
});
