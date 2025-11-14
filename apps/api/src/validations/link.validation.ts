import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createLinkSchema = z
  .object({
    productId: z.cuid("Invalid product ID").openapi({
      description: "Product unique identifier",
      example: "clx1234567890abcdefghijk",
    }),
    campaignId: z.cuid("Invalid campaign ID").openapi({
      description: "Campaign unique identifier",
      example: "clx0987654321zyxwvutsrqp",
    }),
    offerId: z.cuid("Invalid offer ID").openapi({
      description: "Offer unique identifier (specific marketplace listing)",
      example: "clx5555555555mnopqrstuvw",
    }),
  })
  .openapi("CreateLinkRequest");

export const linkIdSchema = z
  .object({
    id: z.cuid("Invalid link ID format").openapi({
      description: "Affiliate link unique identifier (CUID)",
      example: "clx1234567890abcdefghijk",
    }),
  })
  .openapi("LinkIdParams");

export const shortCodeSchema = z
  .object({
    shortCode: z
      .string()
      .length(8, "Short code must be exactly 8 characters")
      .regex(/^[A-Za-z0-9_-]+$/, "Short code must be alphanumeric")
      .openapi({
        description: "8-character alphanumeric short code for affiliate link",
        example: "a1B2c3D4",
      }),
  })
  .openapi("ShortCodeParams");

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type LinkIdParams = z.infer<typeof linkIdSchema>;
export type ShortCodeParams = z.infer<typeof shortCodeSchema>;
