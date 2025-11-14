import { z } from "zod";

export const createLinkSchema = z.object({
  productId: z.cuid("Invalid product ID"),
  campaignId: z.cuid("Invalid campaign ID"),
  offerId: z.cuid("Invalid offer ID"),
});

export const linkIdSchema = z.object({
  id: z.cuid("Invalid link ID format"),
});

export const shortCodeSchema = z.object({
  shortCode: z
    .string()
    .length(8, "Short code must be exactly 8 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "Short code must be alphanumeric"),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type LinkIdParams = z.infer<typeof linkIdSchema>;
export type ShortCodeParams = z.infer<typeof shortCodeSchema>;
