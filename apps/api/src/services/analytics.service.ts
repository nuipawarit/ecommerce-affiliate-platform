import { prisma } from "@repo/database";
import { getRedisClient } from "../utils/redis-client";
import type { DashboardQueryParams } from "../validations/analytics.validation";

export class AnalyticsService {
  private getDateFilter(dateRange: string) {
    const now = Date.now();
    switch (dateRange) {
      case "last7days":
        return { gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
      case "last30days":
        return { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
      case "all":
      default:
        return undefined;
    }
  }

  async getOverview(filters?: DashboardQueryParams) {
    const cacheKey = `analytics:overview:${filters?.campaignId || "all"}:${filters?.dateRange || "all"}`;

    try {
      const redis = getRedisClient();
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis get error:", error);
    }

    const dateFilter = this.getDateFilter(filters?.dateRange || "all");
    const where: any = {};

    if (dateFilter) {
      where.timestamp = dateFilter;
    }

    if (filters?.campaignId) {
      where.link = {
        campaignId: filters.campaignId,
      };
    }

    const [totalClicks, clicksWithOffers, topCampaigns] = await Promise.all([
      prisma.click.count({ where }),

      prisma.click.findMany({
        where,
        include: {
          link: {
            include: {
              offer: {
                select: {
                  marketplace: true,
                },
              },
            },
          },
        },
      }),

      prisma.click.groupBy({
        by: ["linkId"],
        _count: true,
        where,
        orderBy: {
          _count: {
            linkId: "desc",
          },
        },
        take: 5,
      }),
    ]);

    const clicksByMarketplace = clicksWithOffers
      .filter((click) => click.link !== null)
      .reduce(
        (acc, click) => {
          if (click.link === null) return acc;
          const marketplace = click.link.offer.marketplace.toLowerCase();
          acc[marketplace] = (acc[marketplace] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    const topCampaignsLinkIds = topCampaigns
      .map((c) => c.linkId)
      .filter((id): id is string => id !== null);

    const campaignIds = await prisma.link.findMany({
      where: {
        id: { in: topCampaignsLinkIds },
      },
      select: {
        campaignId: true,
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      distinct: ["campaignId"],
    });

    const campaignClickMap = new Map<string, number>();
    for (const click of clicksWithOffers) {
      if (click.link === null) continue;
      const campaignId = click.link.campaignId;
      campaignClickMap.set(
        campaignId,
        (campaignClickMap.get(campaignId) || 0) + 1
      );
    }

    const topCampaignsData = Array.from(campaignClickMap.entries())
      .map(([campaignId, clicks]) => {
        const link = campaignIds.find((c) => c.campaignId === campaignId);
        return link
          ? {
              id: link.campaign.id,
              name: link.campaign.name,
              clicks,
            }
          : null;
      })
      .filter((c): c is { id: string; name: string; clicks: number } => c !== null)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    const result = {
      totalClicks,
      clicksByMarketplace,
      topCampaigns: topCampaignsData,
    };

    try {
      const redis = getRedisClient();
      await redis.setex(cacheKey, 300, JSON.stringify(result));
    } catch (error) {
      console.error("Redis setex error:", error);
    }

    return result;
  }

  async getTopProducts(limit: number = 10) {
    const cacheKey = `analytics:top-products:${limit}`;

    try {
      const redis = getRedisClient();
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis get error:", error);
    }

    const clicksByLink = await prisma.click.groupBy({
      by: ["linkId"],
      _count: true,
      orderBy: {
        _count: {
          linkId: "desc",
        },
      },
      take: limit,
    });

    const linkIds = clicksByLink
      .map((c) => c.linkId)
      .filter((id): id is string => id !== null);

    const links = await prisma.link.findMany({
      where: {
        id: { in: linkIds },
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
      },
    });

    const linkMap = new Map(links.map((link) => [link.id, link]));

    const result = clicksByLink
      .map((click) => {
        if (click.linkId === null) return null;
        const link = linkMap.get(click.linkId);
        if (!link) return null;

        return {
          product: link.product,
          clicks: click._count,
        };
      })
      .filter((item) => item !== null);

    try {
      const redis = getRedisClient();
      await redis.setex(cacheKey, 300, JSON.stringify(result));
    } catch (error) {
      console.error("Redis setex error:", error);
    }

    return result;
  }

  async getCampaignStats(campaignId: string) {
    const cacheKey = `analytics:campaign:${campaignId}`;

    try {
      const redis = getRedisClient();
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Redis get error:", error);
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!campaign) {
      throw new Error(`Campaign with id ${campaignId} not found`);
    }

    const links = await prisma.link.findMany({
      where: { campaignId },
      select: { id: true },
    });

    const linkIds = links.map((link) => link.id);

    const [totalClicks, clicksByProduct, clicksLast7Days] = await Promise.all([
      prisma.click.count({
        where: {
          linkId: { in: linkIds },
        },
      }),

      prisma.click.groupBy({
        by: ["linkId"],
        _count: true,
        where: {
          linkId: { in: linkIds },
        },
        orderBy: {
          _count: {
            linkId: "desc",
          },
        },
      }),

      prisma.click.findMany({
        where: {
          linkId: { in: linkIds },
          timestamp: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          timestamp: true,
        },
      }),
    ]);

    const productLinkIds = clicksByProduct
      .map((c) => c.linkId)
      .filter((id): id is string => id !== null);

    const linksWithProducts = await prisma.link.findMany({
      where: {
        id: { in: productLinkIds },
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
      },
    });

    const linkProductMap = new Map(
      linksWithProducts.map((link) => [link.id, link.product])
    );

    const clicksByProductData = clicksByProduct
      .map((click) => {
        if (click.linkId === null) return null;
        const product = linkProductMap.get(click.linkId);
        if (!product) return null;

        return {
          product,
          clicks: click._count,
        };
      })
      .filter((item): item is { product: { id: string; title: string; imageUrl: string }; clicks: number } => item !== null);

    const dailyClicksMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      if (dateStr) {
        dailyClicksMap.set(dateStr, 0);
      }
    }

    for (const click of clicksLast7Days) {
      const dateStr = click.timestamp.toISOString().split("T")[0];
      if (dateStr && dailyClicksMap.has(dateStr)) {
        const current = dailyClicksMap.get(dateStr);
        if (current !== undefined) {
          dailyClicksMap.set(dateStr, current + 1);
        }
      }
    }

    const dailyTrend = Array.from(dailyClicksMap.entries()).map(
      ([date, clicks]) => ({
        date,
        clicks,
      })
    );

    const result = {
      campaign,
      totalClicks,
      clicksByProduct: clicksByProductData,
      dailyTrend,
    };

    try {
      const redis = getRedisClient();
      await redis.setex(cacheKey, 300, JSON.stringify(result));
    } catch (error) {
      console.error("Redis setex error:", error);
    }

    return result;
  }
}
