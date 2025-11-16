import { prisma } from "@repo/database";
import { CampaignStatus } from "@repo/shared";
import { generateUniqueSlug } from "../utils/slug-generator";
import { NotFoundError } from "../middleware/error-handler";
import type {
  CreateCampaignInput,
  UpdateCampaignInput,
} from "../validations/campaign.validation";

export class CampaignService {
  private async addClickCounts<T extends { id: string; _count?: any }>(
    campaigns: T[]
  ): Promise<T[]> {
    return Promise.all(
      campaigns.map(async (campaign) => {
        const clickCount = await prisma.click.count({
          where: {
            link: {
              campaignId: campaign.id,
            },
          },
        });

        return {
          ...campaign,
          _count: {
            ...campaign._count,
            clicks: clickCount,
          },
        };
      })
    );
  }

  async createCampaign(input: CreateCampaignInput) {
    const slug = await generateUniqueSlug(input.name);

    const campaign = await prisma.campaign.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        status: input.status || CampaignStatus.DRAFT,
        utmCampaign: input.utmCampaign,
        startAt: input.startAt ? new Date(input.startAt) : null,
        endAt: input.endAt ? new Date(input.endAt) : null,
        campaignProducts: {
          create: input.productIds.map((productId) => ({
            productId,
          })),
        },
      },
      include: {
        campaignProducts: {
          include: {
            product: {
              include: {
                offers: {
                  orderBy: { price: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { links: true, campaignProducts: true },
        },
      },
    });

    const [campaignWithClicks] = await this.addClickCounts([campaign]);
    return campaignWithClicks;
  }

  async getAllCampaigns(filters?: {
    page?: number;
    limit?: number;
    status?: CampaignStatus;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where =
      filters?.status !== undefined ? { status: filters.status } : {};

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        skip,
        take: limit,
        where,
        include: {
          campaignProducts: {
            include: {
              product: {
                include: {
                  offers: {
                    orderBy: { price: "asc" },
                  },
                },
              },
            },
          },
          _count: {
            select: { links: true, campaignProducts: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.campaign.count({ where }),
    ]);

    const campaignsWithClicks = await this.addClickCounts(campaigns);

    return {
      campaigns: campaignsWithClicks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCampaignById(id: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        campaignProducts: {
          include: {
            product: {
              include: {
                offers: {
                  orderBy: { price: "asc" },
                },
              },
            },
          },
        },
        links: {
          include: {
            product: {
              select: { id: true, title: true, imageUrl: true },
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
        },
        _count: {
          select: { links: true, campaignProducts: true },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundError(`Campaign with id ${id} not found`);
    }

    const [campaignWithClicks] = await this.addClickCounts([campaign]);
    return campaignWithClicks;
  }

  async getCampaignBySlug(slug: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { slug },
      include: {
        campaignProducts: {
          include: {
            product: {
              include: {
                offers: {
                  orderBy: { price: "asc" },
                },
              },
            },
          },
        },
        links: {
          include: {
            product: {
              select: { id: true, title: true, imageUrl: true },
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
        },
        _count: {
          select: { links: true, campaignProducts: true },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundError(`Campaign with slug "${slug}" not found`);
    }

    const [campaignWithClicks] = await this.addClickCounts([campaign]);
    return campaignWithClicks;
  }

  async updateCampaign(id: string, input: UpdateCampaignInput) {
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existingCampaign) {
      throw new NotFoundError(`Campaign with id ${id} not found`);
    }

    const updateData: any = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
      updateData.slug = await generateUniqueSlug(input.name);
    }

    if (input.description !== undefined)
      updateData.description = input.description;
    if (input.utmCampaign !== undefined)
      updateData.utmCampaign = input.utmCampaign;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.startAt !== undefined)
      updateData.startAt = input.startAt ? new Date(input.startAt) : null;
    if (input.endAt !== undefined)
      updateData.endAt = input.endAt ? new Date(input.endAt) : null;

    if (input.productIds !== undefined) {
      await prisma.campaignProduct.deleteMany({
        where: { campaignId: id },
      });

      updateData.campaignProducts = {
        create: input.productIds.map((productId) => ({
          productId,
        })),
      };
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: {
        campaignProducts: {
          include: {
            product: {
              include: {
                offers: {
                  orderBy: { price: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { links: true, campaignProducts: true },
        },
      },
    });

    const [campaignWithClicks] = await this.addClickCounts([campaign]);
    return campaignWithClicks;
  }

  async deleteCampaign(id: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundError(`Campaign with id ${id} not found`);
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: { status: CampaignStatus.ARCHIVED },
    });

    return updatedCampaign;
  }
}
