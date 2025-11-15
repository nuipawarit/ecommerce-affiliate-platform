import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// Helper function to create success response wrappers
export function createSuccessResponseSchema<T extends z.ZodTypeAny>(
  dataSchema: T,
  name: string
) {
  return z
    .object({
      success: z.literal(true).openapi({ example: true }),
      data: dataSchema,
    })
    .openapi(name);
}

// ============================================================================
// BASE COMPONENT SCHEMAS (Reusable)
// ============================================================================

export const offerSchema = z
  .object({
    id: z.string().cuid().openapi({ example: "clx123456789" }),
    productId: z.string().cuid().openapi({ example: "clx987654321" }),
    marketplace: z.enum(["LAZADA", "SHOPEE"]).openapi({ example: "LAZADA" }),
    storeName: z.string().openapi({ example: "Lazada Official Store" }),
    price: z.number().openapi({ example: 299 }),
    url: z
      .string()
      .url()
      .openapi({ example: "https://www.lazada.co.th/products/i123456.html" }),
    sku: z
      .string()
      .nullable()
      .openapi({ example: "LAZ123456" }),
    isActive: z.boolean().openapi({ example: true }),
    lastCheckedAt: z.string().datetime().openapi({ example: "2025-01-16T10:00:00Z" }),
    createdAt: z.string().datetime().openapi({ example: "2025-01-15T10:00:00Z" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-01-16T10:00:00Z" }),
  })
  .openapi("Offer");

export const paginationSchema = z
  .object({
    page: z.number().int().min(1).openapi({ example: 1 }),
    limit: z.number().int().min(1).max(100).openapi({ example: 20 }),
    total: z.number().int().min(0).openapi({ example: 100 }),
    totalPages: z.number().int().min(0).openapi({ example: 5 }),
  })
  .openapi("Pagination");

export const productCountSchema = z
  .object({
    links: z.number().int().openapi({ example: 5 }),
    campaignProducts: z.number().int().openapi({ example: 2 }),
  })
  .openapi("ProductCount");

export const productWithOffersSchema = z
  .object({
    id: z.string().cuid().openapi({ example: "clx123456789" }),
    title: z.string().openapi({ example: "Matcha Green Tea Powder Premium Grade" }),
    description: z
      .string()
      .nullable()
      .openapi({ example: "High quality matcha powder from Japan" }),
    imageUrl: z
      .string()
      .url()
      .openapi({ example: "https://example.com/images/matcha.jpg" }),
    createdAt: z.string().datetime().openapi({ example: "2025-01-15T10:00:00Z" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-01-16T10:00:00Z" }),
    offers: z.array(offerSchema).openapi({ example: [] }),
    _count: productCountSchema.optional(),
  })
  .openapi("ProductWithOffers");

export const campaignCountSchema = z
  .object({
    links: z.number().int().openapi({ example: 10 }),
    campaignProducts: z.number().int().openapi({ example: 5 }),
  })
  .openapi("CampaignCount");

export const campaignProductSchema = z
  .object({
    product: productWithOffersSchema,
  })
  .openapi("CampaignProduct");

export const campaignWithRelationsSchema = z
  .object({
    id: z.string().cuid().openapi({ example: "clx123456789" }),
    name: z.string().openapi({ example: "Summer Sale 2025" }),
    slug: z.string().openapi({ example: "summer-sale-2025" }),
    description: z
      .string()
      .nullable()
      .openapi({ example: "Best summer deals on matcha products" }),
    status: z
      .enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED", "ARCHIVED"])
      .openapi({ example: "ACTIVE" }),
    utmCampaign: z.string().openapi({ example: "summer_sale_2025" }),
    utmSource: z
      .string()
      .nullable()
      .openapi({ example: "website" }),
    utmMedium: z
      .string()
      .nullable()
      .openapi({ example: "banner" }),
    utmContent: z
      .string()
      .nullable()
      .openapi({ example: "hero" }),
    utmTerm: z.string().nullable().openapi({ example: null }),
    startAt: z
      .string()
      .datetime()
      .nullable()
      .openapi({ example: "2025-06-01T00:00:00Z" }),
    endAt: z
      .string()
      .datetime()
      .nullable()
      .openapi({ example: "2025-08-31T23:59:59Z" }),
    createdAt: z.string().datetime().openapi({ example: "2025-01-15T10:00:00Z" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-01-16T10:00:00Z" }),
    campaignProducts: z.array(campaignProductSchema).optional(),
    _count: campaignCountSchema.optional(),
  })
  .openapi("CampaignWithRelations");

export const linkCountSchema = z
  .object({
    clicks: z.number().int().openapi({ example: 42 }),
  })
  .openapi("LinkCount");

export const linkWithRelationsSchema = z
  .object({
    id: z.string().cuid().openapi({ example: "clx123456789" }),
    shortCode: z.string().openapi({ example: "abc12345" }),
    targetUrl: z
      .string()
      .url()
      .openapi({
        example:
          "https://www.lazada.co.th/products/i123456.html?utm_campaign=summer_sale",
      }),
    productId: z.string().cuid().openapi({ example: "clx987654321" }),
    campaignId: z.string().cuid().openapi({ example: "clx111222333" }),
    offerId: z.string().cuid().openapi({ example: "clx444555666" }),
    createdAt: z.string().datetime().openapi({ example: "2025-01-15T10:00:00Z" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-01-16T10:00:00Z" }),
    product: z
      .object({
        id: z.string().cuid(),
        title: z.string(),
        imageUrl: z.string().url(),
      })
      .optional(),
    campaign: z
      .object({
        id: z.string().cuid(),
        name: z.string(),
        slug: z.string(),
      })
      .optional(),
    offer: z
      .object({
        id: z.string().cuid(),
        marketplace: z.enum(["LAZADA", "SHOPEE"]),
        storeName: z.string(),
        price: z.number(),
      })
      .optional(),
    _count: linkCountSchema.optional(),
  })
  .openapi("LinkWithRelations");

export const marketplaceProductSchema = z
  .object({
    title: z.string().openapi({ example: "Matcha Green Tea Powder" }),
    imageUrl: z
      .string()
      .url()
      .openapi({ example: "https://example.com/matcha.jpg" }),
    storeName: z.string().openapi({ example: "Matcha Store" }),
    price: z.number().openapi({ example: 299 }),
    marketplace: z.enum(["lazada", "shopee"]).openapi({ example: "lazada" }),
    url: z
      .string()
      .url()
      .openapi({ example: "https://www.lazada.co.th/products/i123456.html" }),
    sku: z.string().optional().openapi({ example: "LAZ123456" }),
  })
  .openapi("MarketplaceProduct");

// ============================================================================
// PRODUCT RESPONSE SCHEMAS
// ============================================================================

export const productsListResponseSchema = z
  .object({
    products: z.array(productWithOffersSchema),
    pagination: paginationSchema,
  })
  .openapi("ProductsListResponse");

export const productDetailResponseSchema = z
  .object({
    product: productWithOffersSchema,
  })
  .openapi("ProductDetailResponse");

export const productOffersResponseSchema = z
  .object({
    product: z.object({
      id: z.string().cuid(),
      title: z.string(),
    }),
    offers: z.array(offerSchema),
  })
  .openapi("ProductOffersResponse");

export const searchProductsResponseSchema = z
  .array(marketplaceProductSchema)
  .openapi("SearchProductsResponse");

// ============================================================================
// CAMPAIGN RESPONSE SCHEMAS
// ============================================================================

export const campaignsListResponseSchema = z
  .object({
    campaigns: z.array(campaignWithRelationsSchema),
    pagination: paginationSchema,
  })
  .openapi("CampaignsListResponse");

export const campaignDetailResponseSchema = z
  .object({
    campaign: campaignWithRelationsSchema,
  })
  .openapi("CampaignDetailResponse");

// ============================================================================
// LINK RESPONSE SCHEMAS
// ============================================================================

export const linksListResponseSchema = z
  .object({
    links: z.array(linkWithRelationsSchema),
  })
  .openapi("LinksListResponse");

export const linkDetailResponseSchema = z
  .object({
    link: linkWithRelationsSchema,
  })
  .openapi("LinkDetailResponse");

// ============================================================================
// ANALYTICS RESPONSE SCHEMAS
// ============================================================================

export const clicksByDaySchema = z
  .object({
    date: z.string().openapi({ example: "2025-01-15" }),
    clicks: z.number().int().openapi({ example: 42 }),
  })
  .openapi("ClicksByDay");

export const topCampaignSchema = z
  .object({
    id: z.string().cuid().openapi({ example: "clx123456789" }),
    name: z.string().openapi({ example: "Summer Sale 2025" }),
    clicks: z.number().int().openapi({ example: 150 }),
  })
  .openapi("TopCampaign");

export const topProductSchema = z
  .object({
    id: z.string().cuid().openapi({ example: "clx123456789" }),
    title: z.string().openapi({ example: "Matcha Green Tea Powder" }),
    clicks: z.number().int().openapi({ example: 89 }),
  })
  .openapi("TopProduct");

export const analyticsOverviewSchema = z
  .object({
    totalClicks: z.number().int().openapi({ example: 1250 }),
    totalLinks: z.number().int().openapi({ example: 45 }),
    totalCampaigns: z.number().int().openapi({ example: 8 }),
    totalProducts: z.number().int().openapi({ example: 23 }),
    clicksByMarketplace: z
      .record(z.string(), z.number())
      .openapi({ example: { LAZADA: 650, SHOPEE: 600 } }),
    clicksByDay: z.array(clicksByDaySchema),
    topCampaigns: z.array(topCampaignSchema),
    topProducts: z.array(topProductSchema),
  })
  .openapi("AnalyticsOverview");

export const clicksByProductSchema = z
  .object({
    productId: z.string().cuid().openapi({ example: "clx123456789" }),
    productTitle: z.string().openapi({ example: "Matcha Green Tea Powder" }),
    clicks: z.number().int().openapi({ example: 42 }),
  })
  .openapi("ClicksByProduct");

export const campaignAnalyticsSchema = z
  .object({
    campaignId: z.string().cuid().openapi({ example: "clx123456789" }),
    totalClicks: z.number().int().openapi({ example: 250 }),
    totalLinks: z.number().int().openapi({ example: 12 }),
    clicksByProduct: z.array(clicksByProductSchema),
    clicksByMarketplace: z
      .record(z.string(), z.number())
      .openapi({ example: { LAZADA: 120, SHOPEE: 130 } }),
    clicksOverTime: z.array(clicksByDaySchema),
  })
  .openapi("CampaignAnalytics");

export const dashboardResponseSchema = z
  .object({
    totalClicks: z.number().int().openapi({ example: 1250 }),
    totalProducts: z.number().int().openapi({ example: 23 }),
    totalCampaigns: z.number().int().openapi({ example: 8 }),
    totalLinks: z.number().int().openapi({ example: 45 }),
  })
  .openapi("DashboardResponse");

export const topProductsResponseSchema = z
  .array(topProductSchema)
  .openapi("TopProductsResponse");

// ============================================================================
// JOB RESPONSE SCHEMAS
// ============================================================================

export const jobStatusResponseSchema = z
  .object({
    lastRun: z
      .string()
      .datetime()
      .nullable()
      .openapi({ example: "2025-01-16T10:00:00Z" }),
    nextRun: z
      .string()
      .datetime()
      .nullable()
      .openapi({ example: "2025-01-17T10:00:00Z" }),
    status: z
      .enum(["idle", "running", "completed", "failed"])
      .openapi({ example: "completed" }),
    lastDuration: z
      .number()
      .nullable()
      .openapi({ example: 5432 }),
    productsProcessed: z.number().int().openapi({ example: 23 }),
    errors: z.array(z.string()).openapi({ example: [] }),
  })
  .openapi("JobStatusResponse");
