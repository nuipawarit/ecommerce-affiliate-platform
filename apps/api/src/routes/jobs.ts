import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler";
import { getJobStatus } from "../utils/job-status";
import { successResponse } from "../utils/response";

const router = Router();

router.get(
  "/status",
  asyncHandler(async (_req, res) => {
    const priceRefreshStatus = await getJobStatus();

    res.json(
      successResponse({
        priceRefresh: priceRefreshStatus,
      })
    );
  })
);

export default router;
