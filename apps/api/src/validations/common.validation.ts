import { z } from "zod";
import { CampaignStatus } from "@repo/shared";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const paginationSchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .openapi({
        description: "Page number for pagination (starts from 1)",
        example: "1",
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .openapi({
        description: "Number of items per page",
        example: "20",
      }),
  })
  .openapi("PaginationQuery");

export const campaignPaginationSchema = paginationSchema.extend({
  status: z
    .enum([
      CampaignStatus.DRAFT,
      CampaignStatus.ACTIVE,
      CampaignStatus.PAUSED,
      CampaignStatus.ENDED,
      CampaignStatus.ARCHIVED,
    ] as const)
    .optional()
    .openapi({
      description: "Filter campaigns by status",
      example: CampaignStatus.ACTIVE,
    }),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type CampaignPaginationQuery = z.infer<
  typeof campaignPaginationSchema
>;
