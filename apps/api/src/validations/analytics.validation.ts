import { z } from "zod";

export const dashboardQuerySchema = z.object({
  campaignId: z.cuid("Invalid campaign ID").optional(),
  dateRange: z
    .enum(["last7days", "last30days", "all"])
    .optional()
    .default("all"),
});

export const topProductsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 50, {
      message: "Limit must be between 1 and 50",
    }),
});

export const campaignIdParamSchema = z.object({
  id: z.cuid("Invalid campaign ID format"),
});

export type DashboardQueryParams = z.infer<typeof dashboardQuerySchema>;
export type TopProductsQueryParams = z.infer<typeof topProductsQuerySchema>;
export type CampaignIdParams = z.infer<typeof campaignIdParamSchema>;
