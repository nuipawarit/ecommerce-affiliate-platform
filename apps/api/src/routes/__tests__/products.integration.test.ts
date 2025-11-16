import { describe, it, expect, beforeEach, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { app } from "../../app";
import {
  cleanupDatabase,
  createTestProduct,
  createTestProductWithOffers,
} from "../../__tests__/utils/test-helpers";
import {
  getAuthToken,
  createAuthenticatedRequest,
} from "../../__tests__/utils/auth-helpers";
import { prisma } from "@repo/database";

describe("Products API Integration Tests", () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken(app);
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  describe("POST /api/products/search", () => {
    it("should search products by URL", async () => {
      const response = await request(app)
        .post("/api/products/search")
        .send({
          url: "https://www.lazada.co.th/products/test-i123456.html",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);

      if (response.body.data.length > 0) {
        const product = response.body.data[0];
        expect(product).toHaveProperty("title");
        expect(product).toHaveProperty("marketplace");
        expect(product).toHaveProperty("price");
      }
    });

    it("should search products by SKU", async () => {
      const response = await request(app)
        .post("/api/products/search")
        .send({
          sku: "MT-JP-100",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return 400 if neither URL nor SKU provided", async () => {
      const response = await request(app)
        .post("/api/products/search")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/products", () => {
    it("should create product from Lazada URL", async () => {
      const response = await createAuthenticatedRequest(app, "post", "/api/products", authToken)
        .send({
          url: "https://www.lazada.co.th/products/matcha-powder-i123456.html",
          marketplace: "lazada",
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("title");
      expect(response.body.data.offers).toHaveLength(1);
      expect(response.body.data.offers[0].marketplace).toBe("LAZADA");
    });

    it("should create product from Shopee URL", async () => {
      const response = await createAuthenticatedRequest(app, "post", "/api/products", authToken)
        .send({
          url: "https://shopee.co.th/matcha-powder-i.123456.789012",
          marketplace: "shopee",
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.offers[0].marketplace).toBe("SHOPEE");
    });

    it("should return 401 without authentication", async () => {
      await request(app)
        .post("/api/products")
        .send({
          url: "https://www.lazada.co.th/products/test-i123456.html",
          marketplace: "lazada",
        })
        .expect(401);
    });

    it("should return 400 with invalid marketplace", async () => {
      const response = await createAuthenticatedRequest(app, "post", "/api/products", authToken)
        .send({
          url: "https://www.lazada.co.th/products/test-i123456.html",
          marketplace: "invalid",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/products", () => {
    it("should list all products", async () => {
      await createTestProductWithOffers();
      await createTestProductWithOffers();

      const response = await request(app)
        .get("/api/products")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.products)).toBe(true);
      expect(response.body.data.products.length).toBe(2);

      const product = response.body.data.products[0];
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("title");
      expect(product).toHaveProperty("offers");
    });

    it.skip("should return empty array when no products exist", async () => {
      // SKIP: Test has race condition with parallel execution
      // TODO: Fix by moving to separate test file or implementing proper test isolation
      const response = await request(app)
        .get("/api/products")
        .expect(200);

      expect(response.body.data.products).toHaveLength(0);
      expect(response.body.data.pagination.total).toBe(0);
    });

    it("should support pagination", async () => {
      for (let i = 0; i < 15; i++) {
        await createTestProductWithOffers();
      }

      const response = await request(app)
        .get("/api/products?page=1&limit=10")
        .expect(200);

      expect(response.body.data.products.length).toBeLessThanOrEqual(10);
      expect(response.body.data.pagination).toHaveProperty("total");
      expect(response.body.data.pagination).toHaveProperty("page");
      expect(response.body.data.pagination).toHaveProperty("limit");
      expect(response.body.data.pagination.total).toBe(15);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should get product by ID with offers", async () => {
      const { product } = await createTestProductWithOffers();

      const response = await request(app)
        .get(`/api/products/${product.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(product.id);
      expect(response.body.data.offers).toHaveLength(2);
    });

    it("should return 404 for non-existent product", async () => {
      const response = await request(app)
        .get("/api/products/clq1234567890123456789")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/products/:id/offers", () => {
    it("should get all offers for a product", async () => {
      const { product } = await createTestProductWithOffers();

      const response = await request(app)
        .get(`/api/products/${product.id}/offers`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("product");
      expect(response.body.data).toHaveProperty("offers");
      expect(Array.isArray(response.body.data.offers)).toBe(true);
      expect(response.body.data.offers).toHaveLength(2);

      const offer = response.body.data.offers[0];
      expect(offer).toHaveProperty("marketplace");
      expect(offer).toHaveProperty("price");
      expect(offer).toHaveProperty("storeName");
    });

    it("should return empty array for product with no offers", async () => {
      const product = await createTestProduct();

      const response = await request(app)
        .get(`/api/products/${product.id}/offers`)
        .expect(200);

      expect(response.body.data.offers).toHaveLength(0);
    });
  });

  describe("PUT /api/products/:id/refresh", () => {
    it("should refresh product prices", async () => {
      const { product } = await createTestProductWithOffers();

      const response = await createAuthenticatedRequest(app, "put", `/api/products/${product.id}/refresh`, authToken)
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("offers");
      expect(response.body.data.offers.length).toBeGreaterThan(0);
    });

    it("should return 401 without authentication", async () => {
      const { product } = await createTestProductWithOffers();

      await request(app)
        .put(`/api/products/${product.id}/refresh`)
        .send({})
        .expect(401);
    });

    it("should return 404 for non-existent product", async () => {
      await createAuthenticatedRequest(app, "put", "/api/products/clq1234567890123456789/refresh", authToken)
        .send({})
        .expect(404);
    });
  });

  describe("POST /api/products/check-similar", () => {
    it("should find similar products by title", async () => {
      await createTestProduct({ title: "Matcha Powder Premium Grade" });
      await createTestProduct({ title: "Matcha Powder Green Tea" });
      await createTestProduct({ title: "Coffee Beans" });

      const response = await request(app)
        .post("/api/products/check-similar")
        .send({
          title: "Matcha Powder Premium",
          threshold: 0.6,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return empty array if no similar products found", async () => {
      await createTestProduct({ title: "Coffee Beans" });

      const response = await request(app)
        .post("/api/products/check-similar")
        .send({
          title: "Completely Different Product Name",
          threshold: 0.8,
        })
        .expect(200);

      expect(response.body.data).toHaveLength(0);
    });

    it("should use default threshold if not provided", async () => {
      await createTestProduct({ title: "Test Product" });

      const response = await request(app)
        .post("/api/products/check-similar")
        .send({
          title: "Test Product Similar",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /api/products/:id/offers", () => {
    it("should add offer to existing product", async () => {
      const product = await createTestProduct();

      const response = await createAuthenticatedRequest(app, "post", `/api/products/${product.id}/offers`, authToken)
        .send({
          url: "https://www.lazada.co.th/products/test-i123456.html",
          marketplace: "lazada",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.offers).toHaveLength(1);
      expect(response.body.data.offers[0].marketplace).toBe("LAZADA");
    });

    it("should return 401 without authentication", async () => {
      const product = await createTestProduct();

      await request(app)
        .post(`/api/products/${product.id}/offers`)
        .send({
          url: "https://www.lazada.co.th/products/test-i123456.html",
          marketplace: "lazada",
        })
        .expect(401);
    });

    it("should return 404 for non-existent product", async () => {
      await createAuthenticatedRequest(app, "post", "/api/products/clq1234567890123456789/offers", authToken)
        .send({
          url: "https://www.lazada.co.th/products/test-i123456.html",
          marketplace: "lazada",
        })
        .expect(404);
    });
  });
});
