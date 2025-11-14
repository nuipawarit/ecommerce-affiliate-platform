import { prisma } from "@repo/database";
import { getRedisClient } from "../utils/redis-client";

interface ClickMetadata {
  ipAddress?: string;
  referrer?: string;
  userAgent?: string;
}

export class ClickService {
  async trackClick(linkId: string, metadata: ClickMetadata) {
    const click = await prisma.click.create({
      data: {
        linkId,
        ipAddress: metadata.ipAddress,
        referrer: metadata.referrer,
        userAgent: metadata.userAgent,
      },
    });

    try {
      const redis = getRedisClient();
      await redis.incr(`link:${linkId}:clicks`);
    } catch (error) {
      console.error("Failed to increment Redis counter:", error);
    }

    return click;
  }

  async getClickCount(linkId: string): Promise<number> {
    try {
      const redis = getRedisClient();
      const count = await redis.get(`link:${linkId}:clicks`);
      if (count !== null) {
        return parseInt(count, 10);
      }
    } catch (error) {
      console.error("Failed to get click count from Redis:", error);
    }

    const count = await prisma.click.count({
      where: { linkId },
    });

    try {
      const redis = getRedisClient();
      await redis.set(`link:${linkId}:clicks`, count.toString());
    } catch (error) {
      console.error("Failed to set Redis counter:", error);
    }

    return count;
  }
}
