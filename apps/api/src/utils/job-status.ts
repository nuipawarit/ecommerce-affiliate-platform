import { getRedisClient } from "./redis-client";

export interface JobStatus {
  lastRun: string | null;
  lastDuration: number | null;
  stats: {
    productsProcessed: number;
    offersUpdated: number;
    errors: number;
  };
}

const JOB_KEY_PREFIX = "job:price-refresh";

export async function updateJobStatus(
  duration: number,
  processed: number,
  updated: number,
  errors: number
) {
  try {
    const redis = getRedisClient();
    const now = new Date().toISOString();

    await Promise.all([
      redis.set(`${JOB_KEY_PREFIX}:lastRun`, now),
      redis.set(`${JOB_KEY_PREFIX}:lastDuration`, duration.toString()),
      redis.set(`${JOB_KEY_PREFIX}:processed`, processed.toString()),
      redis.set(`${JOB_KEY_PREFIX}:updated`, updated.toString()),
      redis.set(`${JOB_KEY_PREFIX}:errors`, errors.toString()),
    ]);
  } catch (error) {
    console.error("Failed to update job status:", error);
  }
}

export async function getJobStatus(): Promise<JobStatus> {
  try {
    const redis = getRedisClient();

    const [lastRun, lastDuration, processed, updated, errors] =
      await Promise.all([
        redis.get(`${JOB_KEY_PREFIX}:lastRun`),
        redis.get(`${JOB_KEY_PREFIX}:lastDuration`),
        redis.get(`${JOB_KEY_PREFIX}:processed`),
        redis.get(`${JOB_KEY_PREFIX}:updated`),
        redis.get(`${JOB_KEY_PREFIX}:errors`),
      ]);

    return {
      lastRun: lastRun || null,
      lastDuration: lastDuration ? parseInt(lastDuration, 10) : null,
      stats: {
        productsProcessed: processed ? parseInt(processed, 10) : 0,
        offersUpdated: updated ? parseInt(updated, 10) : 0,
        errors: errors ? parseInt(errors, 10) : 0,
      },
    };
  } catch (error) {
    console.error("Failed to get job status:", error);
    return {
      lastRun: null,
      lastDuration: null,
      stats: {
        productsProcessed: 0,
        offersUpdated: 0,
        errors: 0,
      },
    };
  }
}
