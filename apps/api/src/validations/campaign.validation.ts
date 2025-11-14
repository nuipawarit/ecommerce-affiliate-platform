import { z } from "zod";
import { CampaignStatus } from "@prisma/client";

export const createCampaignSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters"),
  description: z.string().optional(),
  productIds: z
    .array(z.cuid("Invalid product ID"))
    .min(1, "At least one product is required"),
  utmCampaign: z.string().min(1, "UTM campaign is required"),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  startAt: z.iso.datetime().optional(),
  endAt: z.iso.datetime().optional(),
});

export const updateCampaignSchema = z.object({
  name: z
    .string()
    .min(3, "Campaign name must be at least 3 characters")
    .optional(),
  description: z.string().optional(),
  productIds: z.array(z.cuid("Invalid product ID")).optional(),
  utmCampaign: z.string().min(1, "UTM campaign is required").optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  status: z.enum(CampaignStatus).optional(),
  startAt: z.iso.datetime().optional(),
  endAt: z.iso.datetime().optional(),
});

export const campaignIdSchema = z.object({
  id: z.string().cuid("Invalid campaign ID format"),
});

export const campaignSlugSchema = z.object({
  slug: z.string().min(1, "Campaign slug is required"),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CampaignIdParams = z.infer<typeof campaignIdSchema>;
export type CampaignSlugParams = z.infer<typeof campaignSlugSchema>;
