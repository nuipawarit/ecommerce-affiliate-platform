import { prisma } from "@repo/database";
import { nanoid } from "nanoid";
import { NotFoundError, BadRequestError } from "../middleware/error-handler";
import type { CreateLinkInput } from "../validations/link.validation";
import type { Campaign } from "@prisma/client";

export class LinkService {
  async createLink(input: CreateLinkInput) {
    const [campaign, product, offer] = await Promise.all([
      prisma.campaign.findUnique({ where: { id: input.campaignId } }),
      prisma.product.findUnique({ where: { id: input.productId } }),
      prisma.offer.findUnique({ where: { id: input.offerId } }),
    ]);

    if (!campaign) {
      throw new NotFoundError(`Campaign with id ${input.campaignId} not found`);
    }

    if (!product) {
      throw new NotFoundError(`Product with id ${input.productId} not found`);
    }

    if (!offer) {
      throw new NotFoundError(`Offer with id ${input.offerId} not found`);
    }

    if (campaign.endAt && campaign.endAt < new Date()) {
      throw new BadRequestError(
        `Campaign "${campaign.name}" has ended and cannot be used for new links`
      );
    }

    const shortCode = await this.generateUniqueShortCode();
    const targetUrl = this.buildTargetUrl(offer.url, campaign);

    const link = await prisma.link.create({
      data: {
        shortCode,
        targetUrl,
        productId: input.productId,
        campaignId: input.campaignId,
        offerId: input.offerId,
      },
      include: {
        product: {
          include: {
            offers: {
              orderBy: { price: "asc" },
            },
          },
        },
        campaign: true,
        _count: {
          select: { clicks: true },
        },
      },
    });

    return link;
  }

  async getLinkByShortCode(shortCode: string) {
    const link = await prisma.link.findUnique({
      where: { shortCode },
      include: {
        product: true,
        campaign: true,
      },
    });

    if (!link) {
      throw new NotFoundError(`Link with short code "${shortCode}" not found`);
    }

    return link;
  }

  async getAllLinks() {
    const links = await prisma.link.findMany({
      include: {
        product: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        offer: {
          select: {
            id: true,
            marketplace: true,
            storeName: true,
            price: true,
          },
        },
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return links;
  }

  buildTargetUrl(offerUrl: string, campaign: Campaign): string {
    const url = new URL(offerUrl);

    url.searchParams.set("utm_campaign", campaign.utmCampaign);

    if (campaign.utmSource) {
      url.searchParams.set("utm_source", campaign.utmSource);
    }

    if (campaign.utmMedium) {
      url.searchParams.set("utm_medium", campaign.utmMedium);
    }

    if (campaign.utmContent) {
      url.searchParams.set("utm_content", campaign.utmContent);
    }

    if (campaign.utmTerm) {
      url.searchParams.set("utm_term", campaign.utmTerm);
    }

    return url.toString();
  }

  async generateUniqueShortCode(): Promise<string> {
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const shortCode = nanoid(8);

      const existing = await prisma.link.findUnique({
        where: { shortCode },
      });

      if (!existing) {
        return shortCode;
      }
    }

    throw new Error(
      "Failed to generate unique short code after multiple attempts"
    );
  }
}
