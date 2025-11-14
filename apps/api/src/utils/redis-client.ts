import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      }
    });

    redis.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected');
    });

    redis.on('ready', () => {
      console.log('✅ Redis ready');
    });
  }

  return redis;
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

export async function incrementClickCounter(linkId: string, campaignId: string): Promise<void> {
  const client = getRedisClient();

  await Promise.all([
    client.incr(`clicks:${linkId}:count`),
    client.incr(`clicks:campaign:${campaignId}:count`)
  ]);
}

export async function getClickCount(linkId: string): Promise<number> {
  const client = getRedisClient();
  const count = await client.get(`clicks:${linkId}:count`);
  return count ? parseInt(count, 10) : 0;
}

export async function getCampaignClickCount(campaignId: string): Promise<number> {
  const client = getRedisClient();
  const count = await client.get(`clicks:campaign:${campaignId}:count`);
  return count ? parseInt(count, 10) : 0;
}
