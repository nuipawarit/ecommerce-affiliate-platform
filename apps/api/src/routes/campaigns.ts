import { Router } from "express";
import { CampaignService } from "../services/campaign.service";
import { asyncHandler } from "../middleware/async-handler";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation";
import { requireAuth } from "../middleware/auth";
import {
  createCampaignSchema,
  updateCampaignSchema,
  campaignIdSchema,
  campaignSlugSchema,
} from "../validations/campaign.validation";
import { successResponse } from "../utils/response";
import { z } from "zod";
import { CampaignStatus } from "@prisma/client";

const router = Router();
const campaignService = new CampaignService();

const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  status: z.enum(CampaignStatus).optional(),
});

router.post(
  "/",
  requireAuth,
  validateBody(createCampaignSchema),
  asyncHandler(async (req, res) => {
    const campaign = await campaignService.createCampaign(req.body);

    res.status(201).json(successResponse(campaign));
  })
);

router.get(
  "/",
  validateQuery(paginationSchema),
  asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query as {
      page?: number;
      limit?: number;
      status?: CampaignStatus;
    };
    const result = await campaignService.getAllCampaigns({
      page,
      limit,
      status,
    });

    res.json(successResponse(result));
  })
);

router.get(
  "/:id",
  validateParams(campaignIdSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campaign = await campaignService.getCampaignById(id!);

    res.json(successResponse(campaign));
  })
);

router.get(
  "/slug/:slug",
  validateParams(campaignSlugSchema),
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const campaign = await campaignService.getCampaignBySlug(slug!);

    res.json(successResponse(campaign));
  })
);

router.put(
  "/:id",
  requireAuth,
  validateParams(campaignIdSchema),
  validateBody(updateCampaignSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campaign = await campaignService.updateCampaign(id!, req.body);

    res.json(successResponse(campaign));
  })
);

router.delete(
  "/:id",
  requireAuth,
  validateParams(campaignIdSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campaign = await campaignService.deleteCampaign(id!);

    res.json(successResponse(campaign));
  })
);

export default router;
