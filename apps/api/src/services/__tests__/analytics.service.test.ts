import { describe, it, expect, beforeEach } from "bun:test";
import { AnalyticsService } from "../analytics.service";

describe("AnalyticsService", () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
  });

  it("should create an instance of AnalyticsService", () => {
    expect(service).toBeInstanceOf(AnalyticsService);
  });

  describe("getDateFilter", () => {
    it("should return date filter for last7days", () => {
      const result = (service as any).getDateFilter("last7days");

      expect(result).toBeDefined();
      expect(result.gte).toBeInstanceOf(Date);
    });

    it("should return date filter for last30days", () => {
      const result = (service as any).getDateFilter("last30days");

      expect(result).toBeDefined();
      expect(result.gte).toBeInstanceOf(Date);
    });

    it("should return undefined for all", () => {
      const result = (service as any).getDateFilter("all");

      expect(result).toBeUndefined();
    });

    it("should return undefined for unknown date range", () => {
      const result = (service as any).getDateFilter("unknown");

      expect(result).toBeUndefined();
    });
  });
});
