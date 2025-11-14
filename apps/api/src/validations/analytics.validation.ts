import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const dashboardQuerySchema = z
  .object({
    campaignId: z.cuid("Invalid campaign ID").optional().openapi({
      description: "Filter analytics by specific campaign ID",
      example: "clx1234567890abcdefghijk",
    }),
    dateRange: z
      .enum(["last7days", "last30days", "all"])
      .optional()
      .default("all")
      .openapi({
        description: "Date range for analytics data",
        example: "last30days",
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => val > 0 && val <= 50, {
        message: "Limit must be between 1 and 50",
      })
      .openapi({
        description: "Limit number of top items (campaigns and products)",
        example: "10",
      }),
  })
  .openapi("DashboardQueryParams");

export const topProductsQuerySchema = z
  .object({
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => val > 0 && val <= 50, {
        message: "Limit must be between 1 and 50",
      })
      .openapi({
        description: "Maximum number of top products to return (1-50)",
        example: "10",
      }),
  })
  .openapi("TopProductsQueryParams");

export const campaignIdParamSchema = z
  .object({
    id: z.cuid("Invalid campaign ID format").openapi({
      description: "Campaign unique identifier (CUID)",
      example: "clx1234567890abcdefghijk",
    }),
  })
  .openapi("CampaignAnalyticsParams");

export type DashboardQueryParams = z.infer<typeof dashboardQuerySchema>;
export type TopProductsQueryParams = z.infer<typeof topProductsQuerySchema>;
export type CampaignIdParams = z.infer<typeof campaignIdParamSchema>;
