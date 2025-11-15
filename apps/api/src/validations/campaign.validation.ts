import { z } from "zod";
import { CampaignStatus } from "@repo/shared";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createCampaignSchema = z
  .object({
    name: z
      .string()
      .min(3, "Campaign name must be at least 3 characters")
      .openapi({
        description: "Campaign name",
        example: "Summer Sale 2025",
      }),
    description: z.string().optional().openapi({
      description: "Campaign description",
      example: "Best summer deals on matcha products",
    }),
    productIds: z
      .array(z.cuid("Invalid product ID"))
      .min(1, "At least one product is required")
      .openapi({
        description: "Array of product IDs to include in campaign",
        example: ["clx1234567890"],
      }),
    utmCampaign: z.string().min(1, "UTM campaign is required").openapi({
      description: "UTM campaign parameter for tracking",
      example: "summer_sale_2025",
    }),
    utmSource: z.string().optional().openapi({
      description: "UTM source parameter",
      example: "website",
    }),
    utmMedium: z.string().optional().openapi({
      description: "UTM medium parameter",
      example: "banner",
    }),
    utmContent: z.string().optional().openapi({
      description: "UTM content parameter",
      example: "hero",
    }),
    utmTerm: z.string().optional().openapi({
      description: "UTM term parameter",
      example: "matcha",
    }),
    startAt: z.iso.datetime().optional().openapi({
      description: "Campaign start date (ISO 8601)",
      example: "2025-06-01T00:00:00Z",
    }),
    endAt: z.iso.datetime().optional().openapi({
      description: "Campaign end date (ISO 8601)",
      example: "2025-08-31T23:59:59Z",
    }),
  })
  .openapi("CreateCampaignRequest");

export const updateCampaignSchema = z
  .object({
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
    status: z.enum([CampaignStatus.DRAFT, CampaignStatus.ACTIVE, CampaignStatus.PAUSED, CampaignStatus.ENDED] as const).optional(),
    startAt: z.iso.datetime().optional(),
    endAt: z.iso.datetime().optional(),
  })
  .openapi("UpdateCampaignRequest");

export const campaignIdSchema = z
  .object({
    id: z.cuid("Invalid campaign ID format").openapi({
      description: "Campaign unique identifier (CUID)",
      example: "clx1234567890abcdefghijk",
    }),
  })
  .openapi("CampaignIdParams");

export const campaignSlugSchema = z
  .object({
    slug: z.string().min(1, "Campaign slug is required").openapi({
      description: "Campaign URL-friendly slug",
      example: "summer-sale-2025",
    }),
  })
  .openapi("CampaignSlugParams");

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CampaignIdParams = z.infer<typeof campaignIdSchema>;
export type CampaignSlugParams = z.infer<typeof campaignSlugSchema>;
