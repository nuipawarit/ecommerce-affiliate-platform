import { z } from "zod";

export const createProductSchema = z.object({
  url: z.url("Invalid URL format"),
  marketplace: z.enum(["lazada", "shopee"], {
    message: 'Marketplace must be either "lazada" or "shopee"',
  }),
});

export const productIdSchema = z.object({
  id: z.string().cuid("Invalid product ID format"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductIdParams = z.infer<typeof productIdSchema>;
