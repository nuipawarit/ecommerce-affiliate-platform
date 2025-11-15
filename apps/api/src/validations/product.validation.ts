import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createProductSchema = z
  .object({
    url: z.url("Invalid URL format").optional().openapi({
      description:
        "Product URL from Lazada or Shopee marketplace (required if SKU not provided)",
      example: "https://www.lazada.co.th/products/matcha-powder-i123456.html",
    }),
    sku: z.string().min(1, "SKU cannot be empty").optional().openapi({
      description: "Product SKU code (required if URL not provided)",
      example: "LAZ123456",
    }),
    marketplace: z
      .enum(["lazada", "shopee"], {
        message: 'Marketplace must be either "lazada" or "shopee"',
      })
      .openapi({
        description: "Marketplace platform name",
        example: "lazada",
      }),
  })
  .refine((data) => data.url || data.sku, {
    message: "Either URL or SKU must be provided",
    path: ["url"],
  })
  .openapi("CreateProductRequest");

export const searchProductSchema = z
  .object({
    url: z.string().url("Invalid URL format").optional().openapi({
      description: "Product URL from Lazada or Shopee marketplace",
      example: "https://www.lazada.co.th/products/matcha-powder-i123456.html",
    }),
    sku: z.string().min(1, "SKU cannot be empty").optional().openapi({
      description: "Product SKU code for search",
      example: "ABC123",
    }),
  })
  .refine((data) => data.url || data.sku, {
    message: "Either URL or SKU must be provided",
    path: ["url"],
  })
  .openapi("SearchProductRequest");

export const productIdSchema = z
  .object({
    id: z.cuid("Invalid product ID format").openapi({
      description: "Product unique identifier (CUID)",
      example: "clx1234567890abcdefghijk",
    }),
  })
  .openapi("ProductIdParams");

export const addOfferSchema = z
  .object({
    url: z.string().url("Invalid URL format").openapi({
      description: "Offer URL from marketplace",
      example: "https://shopee.co.th/product.123456.789",
    }),
    marketplace: z
      .enum(["lazada", "shopee"], {
        message: 'Marketplace must be either "lazada" or "shopee"',
      })
      .openapi({
        description: "Marketplace platform name",
        example: "shopee",
      }),
  })
  .openapi("AddOfferRequest");

export const checkSimilarSchema = z
  .object({
    title: z.string().min(1, "Title is required").openapi({
      description: "Product title to search for similar products",
      example: "Matcha Green Tea Powder",
    }),
    threshold: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .openapi({
        description: "Similarity threshold (0-1). Default: 0.8",
        example: 0.8,
      }),
  })
  .openapi("CheckSimilarRequest");

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type SearchProductInput = z.infer<typeof searchProductSchema>;
export type ProductIdParams = z.infer<typeof productIdSchema>;
export type AddOfferInput = z.infer<typeof addOfferSchema>;
export type CheckSimilarInput = z.infer<typeof checkSimilarSchema>;
