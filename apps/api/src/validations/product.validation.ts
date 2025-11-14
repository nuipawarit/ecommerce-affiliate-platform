import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createProductSchema = z
  .object({
    url: z.url("Invalid URL format").openapi({
      description: "Product URL from Lazada or Shopee marketplace",
      example: "https://www.lazada.co.th/products/matcha-powder-i123456.html",
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
  .openapi("CreateProductRequest");

export const productIdSchema = z
  .object({
    id: z.cuid("Invalid product ID format").openapi({
      description: "Product unique identifier (CUID)",
      example: "clx1234567890abcdefghijk",
    }),
  })
  .openapi("ProductIdParams");

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductIdParams = z.infer<typeof productIdSchema>;
