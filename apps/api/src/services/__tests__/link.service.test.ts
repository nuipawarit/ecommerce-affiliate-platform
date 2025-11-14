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

    it("should append all UTM parameters when provided", () => {
      const offerUrl = "https://www.lazada.co.th/products/test-i123456.html";
      const campaign = {
        utmCampaign: "summer_sale",
        utmSource: "website",
        utmMedium: "banner",
        utmContent: "hero",
        utmTerm: "matcha",
      } as any;

      const result = service.buildTargetUrl(offerUrl, campaign);

      expect(result).toContain("utm_campaign=summer_sale");
      expect(result).toContain("utm_source=website");
      expect(result).toContain("utm_medium=banner");
      expect(result).toContain("utm_content=hero");
      expect(result).toContain("utm_term=matcha");
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

    it("should only include provided optional UTM parameters", () => {
      const offerUrl = "https://www.lazada.co.th/products/test-i123456.html";
      const campaign = {
        utmCampaign: "summer_sale",
        utmSource: "website",
        utmMedium: null,
        utmContent: null,
        utmTerm: null,
      } as any;

      const result = service.buildTargetUrl(offerUrl, campaign);

      expect(result).toContain("utm_campaign=summer_sale");
      expect(result).toContain("utm_source=website");
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
