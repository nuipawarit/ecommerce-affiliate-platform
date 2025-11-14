import { Router } from "express";
import { LinkService } from "../services/link.service";
import { asyncHandler } from "../middleware/async-handler";
import { validateBody } from "../middleware/validation";
import { requireAuth } from "../middleware/auth";
import { createLinkSchema } from "../validations/link.validation";
import { successResponse } from "../utils/response";

const router = Router();
const linkService = new LinkService();

router.post(
  "/",
  requireAuth,
  validateBody(createLinkSchema),
  asyncHandler(async (req, res) => {
    const link = await linkService.createLink(req.body);

    res.status(201).json(successResponse(link));
  })
);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const links = await linkService.getAllLinks();

    res.json(successResponse(links));
  })
);

export default router;
