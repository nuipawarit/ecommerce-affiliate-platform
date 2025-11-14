import { Router } from "express";
import { AnalyticsService } from "../services/analytics.service";
import { asyncHandler } from "../middleware/async-handler";
import { validateQuery, validateParams } from "../middleware/validation";
import {
  dashboardQuerySchema,
  topProductsQuerySchema,
  campaignIdParamSchema,
} from "../validations/analytics.validation";
import { successResponse } from "../utils/response";
import type {
  DashboardQueryParams,
  TopProductsQueryParams,
} from "../validations/analytics.validation";

const router = Router();
const analyticsService = new AnalyticsService();

router.get(
  "/overview",
  validateQuery(dashboardQuerySchema),
  asyncHandler(async (req, res) => {
    const filters = req.query as unknown as DashboardQueryParams;
    const overview = await analyticsService.getOverview(filters);

    res.json(successResponse(overview));
  })
);

router.get(
  "/products/top",
  validateQuery(topProductsQuerySchema),
  asyncHandler(async (req, res) => {
    const { limit } = req.query as unknown as TopProductsQueryParams;
    const topProducts = await analyticsService.getTopProducts(limit);

    res.json(successResponse(topProducts));
  })
);

router.get(
  "/campaigns/:id",
  validateParams(campaignIdParamSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campaignStats = await analyticsService.getCampaignStats(id!);

    res.json(successResponse(campaignStats));
  })
);

export default router;
