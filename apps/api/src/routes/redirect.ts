import { Router } from "express";
import { LinkService } from "../services/link.service";
import { ClickService } from "../services/click.service";
import { asyncHandler } from "../middleware/async-handler";
import { validateParams } from "../middleware/validation";
import { shortCodeSchema } from "../validations/link.validation";

const router = Router();
const linkService = new LinkService();
const clickService = new ClickService();

router.get(
  "/:shortCode",
  validateParams(shortCodeSchema),
  asyncHandler(async (req, res) => {
    const { shortCode } = req.params;
    const link = await linkService.getLinkByShortCode(shortCode!);

    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress;
    const referrerHeader = req.headers.referer || req.headers.referrer;
    const referrer = Array.isArray(referrerHeader) ? referrerHeader[0] : referrerHeader;
    const userAgent = req.headers["user-agent"];

    await clickService.trackClick(link.id, {
      ipAddress,
      referrer,
      userAgent,
    });

    res.redirect(302, link.targetUrl);
  })
);

export default router;
