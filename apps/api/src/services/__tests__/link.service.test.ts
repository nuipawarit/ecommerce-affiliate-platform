import { describe, it, expect, beforeEach } from "bun:test";
import { LinkService } from "../link.service";

describe("LinkService", () => {
  let service: LinkService;

  beforeEach(() => {
    service = new LinkService();
  });

  it("should create an instance of LinkService", () => {
    expect(service).toBeInstanceOf(LinkService);
  });

  describe("buildTargetUrl", () => {
    it("should append utm_campaign to URL", () => {
      const offerUrl = "https://www.lazada.co.th/products/test-i123456.html";
      const campaign = {
        utmCampaign: "summer_sale",
        utmSource: null,
        utmMedium: null,
        utmContent: null,
        utmTerm: null,
      } as any;

      const result = service.buildTargetUrl(offerUrl, campaign);

      expect(result).toContain("utm_campaign=summer_sale");
    });

    it("should append utm_campaign parameter", () => {
      const offerUrl = "https://www.lazada.co.th/products/test-i123456.html";
      const campaign = {
        utmCampaign: "summer_sale",
      } as any;

      const result = service.buildTargetUrl(offerUrl, campaign);

      expect(result).toContain("utm_campaign=summer_sale");
    });

    it("should handle URLs with existing query parameters", () => {
      const offerUrl =
        "https://www.lazada.co.th/products/test-i123456.html?foo=bar";
      const campaign = {
        utmCampaign: "summer_sale",
        utmSource: null,
        utmMedium: null,
        utmContent: null,
        utmTerm: null,
      } as any;

      const result = service.buildTargetUrl(offerUrl, campaign);

      expect(result).toContain("foo=bar");
      expect(result).toContain("utm_campaign=summer_sale");
    });

    it("should only include utm_campaign parameter", () => {
      const offerUrl = "https://www.lazada.co.th/products/test-i123456.html";
      const campaign = {
        utmCampaign: "summer_sale",
      } as any;

      const result = service.buildTargetUrl(offerUrl, campaign);

      expect(result).toContain("utm_campaign=summer_sale");
      expect(result).not.toContain("utm_source");
      expect(result).not.toContain("utm_medium");
      expect(result).not.toContain("utm_content");
      expect(result).not.toContain("utm_term");
    });
  });

  describe("generateUniqueShortCode", () => {
    it("should generate 8-character short code", async () => {
      const shortCode = await service.generateUniqueShortCode();

      expect(shortCode).toHaveLength(8);
    });

    it("should generate alphanumeric characters", async () => {
      const shortCode = await service.generateUniqueShortCode();

      expect(shortCode).toMatch(/^[A-Za-z0-9_-]+$/);
    });
  });
});
