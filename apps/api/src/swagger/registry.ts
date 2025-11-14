import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  createProductSchema,
  productIdSchema,
} from "../validations/product.validation";
import {
  createCampaignSchema,
  updateCampaignSchema,
  campaignIdSchema,
  campaignSlugSchema,
} from "../validations/campaign.validation";
import {
  createLinkSchema,
  shortCodeSchema,
} from "../validations/link.validation";
import {
  dashboardQuerySchema,
  topProductsQuerySchema,
  campaignIdParamSchema,
} from "../validations/analytics.validation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const paginationSchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .openapi({
        description: "Page number for pagination",
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
  .openapi("PaginationParams");

const successResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    data: z.any(),
  })
  .openapi("SuccessResponse");

const errorResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: false }),
    error: z.object({
      message: z.string().openapi({ example: "Error message" }),
      code: z.string().optional().openapi({ example: "ERROR_CODE" }),
    }),
  })
  .openapi("ErrorResponse");

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

registry.registerPath({
  method: "post",
  path: "/api/products",
  summary: "Create a new product",
  description: "Add a product from Lazada or Shopee marketplace URL",
  tags: ["Products"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createProductSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Product created successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/products",
  summary: "List all products",
  description: "Get a paginated list of products with their offers",
  tags: ["Products"],
  request: {
    query: paginationSchema,
  },
  responses: {
    200: {
      description: "Products retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/products/{id}",
  summary: "Get product by ID",
  description: "Retrieve a specific product with all its offers",
  tags: ["Products"],
  request: {
    params: productIdSchema,
  },
  responses: {
    200: {
      description: "Product retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    404: {
      description: "Product not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/products/{id}/offers",
  summary: "Get product offers",
  description:
    "Retrieve all marketplace offers for a product with price comparison",
  tags: ["Products"],
  request: {
    params: productIdSchema,
  },
  responses: {
    200: {
      description: "Offers retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    404: {
      description: "Product not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/products/{id}/refresh",
  summary: "Refresh product prices",
  description: "Manually trigger price refresh from marketplace APIs",
  tags: ["Products"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: productIdSchema,
  },
  responses: {
    200: {
      description: "Product refreshed successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: "Product not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/campaigns",
  summary: "Create a new campaign",
  description: "Create a marketing campaign with products and UTM parameters",
  tags: ["Campaigns"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createCampaignSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Campaign created successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

const campaignPaginationSchema = paginationSchema.extend({
  status: z
    .enum(["active", "scheduled", "completed", "draft"])
    .optional()
    .openapi({
      description: "Filter campaigns by status",
      example: "active",
    }),
});

registry.registerPath({
  method: "get",
  path: "/api/campaigns",
  summary: "List all campaigns",
  description: "Get a paginated list of campaigns with optional status filter",
  tags: ["Campaigns"],
  request: {
    query: campaignPaginationSchema,
  },
  responses: {
    200: {
      description: "Campaigns retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/campaigns/{id}",
  summary: "Get campaign by ID",
  description: "Retrieve a specific campaign with all products and links",
  tags: ["Campaigns"],
  request: {
    params: campaignIdSchema,
  },
  responses: {
    200: {
      description: "Campaign retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    404: {
      description: "Campaign not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/campaigns/slug/{slug}",
  summary: "Get campaign by slug",
  description: "Retrieve a campaign using its URL-friendly slug",
  tags: ["Campaigns"],
  request: {
    params: campaignSlugSchema,
  },
  responses: {
    200: {
      description: "Campaign retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    404: {
      description: "Campaign not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/campaigns/{id}",
  summary: "Update campaign",
  description: "Update campaign details, products, or UTM parameters",
  tags: ["Campaigns"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: campaignIdSchema,
    body: {
      content: {
        "application/json": {
          schema: updateCampaignSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Campaign updated successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: "Campaign not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/campaigns/{id}",
  summary: "Delete campaign",
  description: "Archive a campaign by setting its status to ARCHIVED (soft delete)",
  tags: ["Campaigns"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: campaignIdSchema,
  },
  responses: {
    200: {
      description: "Campaign archived successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: "Campaign not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/links",
  summary: "Create affiliate link",
  description:
    "Generate a new affiliate link with short code for a product offer in a campaign",
  tags: ["Links"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createLinkSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Link created successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/links",
  summary: "List all affiliate links",
  description: "Get all affiliate links with their campaigns and products",
  tags: ["Links"],
  responses: {
    200: {
      description: "Links retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/analytics/dashboard",
  summary: "Get comprehensive dashboard",
  description:
    "Retrieve comprehensive dashboard with overview stats, top campaigns, and top products. Combines overview and product analytics in a single response.",
  tags: ["Analytics"],
  request: {
    query: dashboardQuerySchema,
  },
  responses: {
    200: {
      description: "Dashboard data retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/analytics/overview",
  summary: "Get analytics overview",
  description:
    "Retrieve overall analytics with optional filtering by campaign and date range",
  tags: ["Analytics"],
  request: {
    query: dashboardQuerySchema,
  },
  responses: {
    200: {
      description: "Analytics retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/analytics/products/top",
  summary: "Get top performing products",
  description: "Retrieve products with the most clicks",
  tags: ["Analytics"],
  request: {
    query: topProductsQuerySchema,
  },
  responses: {
    200: {
      description: "Top products retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/analytics/campaigns/{id}",
  summary: "Get campaign analytics",
  description: "Retrieve detailed analytics for a specific campaign",
  tags: ["Analytics"],
  request: {
    params: campaignIdParamSchema,
  },
  responses: {
    200: {
      description: "Campaign analytics retrieved successfully",
      content: {
        "application/json": {
          schema: successResponseSchema,
        },
      },
    },
    404: {
      description: "Campaign not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/go/{shortCode}",
  summary: "Redirect short link",
  description: "Redirect to target URL and track click analytics",
  tags: ["Redirect"],
  request: {
    params: shortCodeSchema,
  },
  responses: {
    302: {
      description: "Redirect to target URL",
    },
    404: {
      description: "Short code not found",
      content: {
        "application/json": {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Affiliate Platform API",
    version: "1.0.0",
    description:
      "REST API for affiliate link management, campaign tracking, and analytics. Supports Lazada and Shopee marketplace integration.",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Development server",
    },
    {
      url: "https://api.production.com",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Products",
      description: "Product management and marketplace integration",
    },
    {
      name: "Campaigns",
      description: "Marketing campaign management with UTM tracking",
    },
    {
      name: "Links",
      description: "Affiliate link generation and management",
    },
    {
      name: "Analytics",
      description: "Click tracking and performance analytics",
    },
    {
      name: "Redirect",
      description: "Short link redirection with tracking",
    },
  ],
});
