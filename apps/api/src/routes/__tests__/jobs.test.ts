import { describe, it, expect, beforeEach } from "bun:test";
import request from "supertest";
import { app } from "../../app";
import { updateJobStatus } from "../../utils/job-status";
import { getRedisClient } from "../../utils/redis-client";

describe("GET /api/jobs/status", () => {
  beforeEach(async () => {
    const redis = getRedisClient();
    await redis.flushdb();
  });

  it("should return job status when no job has run", async () => {
    const response = await request(app).get("/api/jobs/status").expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        priceRefresh: {
          lastRun: null,
          lastDuration: null,
          stats: {
            productsProcessed: 0,
            offersUpdated: 0,
            errors: 0,
          },
        },
      },
    });
  });

  it("should return job status after a successful run", async () => {
    const duration = 5000;
    const processed = 10;
    const updated = 15;
    const errors = 0;

    await updateJobStatus(duration, processed, updated, errors);

    const response = await request(app).get("/api/jobs/status").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.priceRefresh).toMatchObject({
      lastDuration: duration,
      stats: {
        productsProcessed: processed,
        offersUpdated: updated,
        errors: errors,
      },
    });
    expect(response.body.data.priceRefresh.lastRun).toBeDefined();
    expect(typeof response.body.data.priceRefresh.lastRun).toBe("string");
  });

  it("should return job status with errors", async () => {
    const duration = 3000;
    const processed = 8;
    const updated = 10;
    const errors = 2;

    await updateJobStatus(duration, processed, updated, errors);

    const response = await request(app).get("/api/jobs/status").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.priceRefresh.stats).toMatchObject({
      productsProcessed: processed,
      offersUpdated: updated,
      errors: errors,
    });
  });

  it("should update status after multiple runs", async () => {
    await updateJobStatus(1000, 5, 5, 0);

    await updateJobStatus(2000, 10, 12, 1);

    const response = await request(app).get("/api/jobs/status").expect(200);

    expect(response.body.data.priceRefresh.lastDuration).toBe(2000);
    expect(response.body.data.priceRefresh.stats).toMatchObject({
      productsProcessed: 10,
      offersUpdated: 12,
      errors: 1,
    });
  });
});
