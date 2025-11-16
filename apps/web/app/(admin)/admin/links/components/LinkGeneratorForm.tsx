"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CampaignSelector } from "./CampaignSelector";
import { ProductSelector } from "./ProductSelector";
import { ProductSummaryCard } from "./ProductSummaryCard";
import { OfferSelector } from "./OfferSelector";
import { LinkPreviewCard } from "./LinkPreviewCard";
import { ProgressIndicator } from "./ProgressIndicator";
import { apiGet, apiPost } from "@/lib/api-client";
import {
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  PackageOpen,
} from "lucide-react";
import type {
  LinkWithRelations,
  ProductWithOffers,
  CampaignDetailResponse,
  CampaignWithRelations,
  Offer,
} from "@repo/shared";

export function LinkGeneratorForm() {
  const router = useRouter();

  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignWithRelations | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [offerId, setOfferId] = useState<string | null>(null);

  const [products, setProducts] = useState<ProductWithOffers[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithOffers | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [generatedLink, setGeneratedLink] = useState<LinkWithRelations | null>(
    null
  );
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignProducts(campaignId);
    } else {
      setProducts([]);
      setProductId(null);
      setSelectedProduct(null);
      setOfferId(null);
      setSelectedOffer(null);
      setCampaign(null);
    }
  }, [campaignId]);

  useEffect(() => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      setSelectedProduct(product || null);
      setOfferId(null);
      setSelectedOffer(null);
    } else {
      setSelectedProduct(null);
      setOfferId(null);
      setSelectedOffer(null);
    }
  }, [productId, products]);

  useEffect(() => {
    if (offerId && selectedProduct) {
      const offer = selectedProduct.offers?.find((o) => o.id === offerId);
      setSelectedOffer(offer || null);
    } else {
      setSelectedOffer(null);
    }
  }, [offerId, selectedProduct]);

  const fetchCampaignProducts = async (campaignId: string) => {
    setLoadingProducts(true);
    try {
      const campaignData = await apiGet<CampaignDetailResponse>(
        `/api/campaigns/${campaignId}`
      );
      setCampaign(campaignData.campaign);
      const productIds =
        campaignData.campaign.campaignProducts?.map(
          (cp) => cp.product as ProductWithOffers
        ) || [];
      setProducts(productIds);
    } catch (error) {
      console.error("Failed to fetch campaign products:", error);
      setError("Failed to load products for this campaign");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleGenerate = async () => {
    if (!campaignId || !productId || !offerId) {
      setError("Please select campaign, product, and offer");
      return;
    }

    setError("");
    setGenerating(true);

    try {
      const data = await apiPost<LinkWithRelations>("/api/links", {
        campaignId,
        productId,
        offerId,
      });

      setGeneratedLink(data);
    } catch (err) {
      console.error("Failed to generate link:", err);
      setError(err instanceof Error ? err.message : "Failed to generate link");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedLink) return;

    const shortUrl = `${window.location.origin}/go/${generatedLink.shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleReset = () => {
    setCampaignId(null);
    setProductId(null);
    setOfferId(null);
    setSelectedProduct(null);
    setSelectedOffer(null);
    setGeneratedLink(null);
    setError("");
  };

  const isFormValid = campaignId && productId && offerId;

  const steps = [
    { label: "Campaign", completed: !!campaignId },
    { label: "Product", completed: !!productId },
    { label: "Offer", completed: !!offerId },
  ];

  const currentStep = !campaignId ? 1 : !productId ? 2 : !offerId ? 3 : 3;

  return (
    <div className="space-y-6">
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={3}
        steps={steps}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedLink && (
        <Card className="border-2 border-green-500 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <CardTitle className="text-green-600">
                Link Generated Successfully!
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Short URL</Label>
              <div className="flex gap-2">
                <code className="flex-1 text-lg font-mono font-bold bg-background px-4 py-3 rounded border">
                  {`${typeof window !== "undefined" ? window.location.origin : ""}/go/${generatedLink.shortCode}`}
                </code>
                <Button onClick={handleCopy} size="lg" variant="outline">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setGeneratedLink(null)}
                variant="outline"
                className="flex-1"
              >
                Generate Another
              </Button>
              <Button
                onClick={() => router.push("/admin/links")}
                className="flex-1"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View All Links
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Campaign Selection</CardTitle>
                {campaignId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCampaignId(null)}
                  >
                    Change
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>
                  Select Campaign <span className="text-red-500">*</span>
                </Label>
                <CampaignSelector
                  selectedCampaignId={campaignId}
                  onCampaignChange={setCampaignId}
                />
                <p className="text-xs text-muted-foreground">
                  Choose an active campaign to generate the link for
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Selection</CardTitle>
                {productId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProductId(null)}
                  >
                    Change
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Select Product <span className="text-red-500">*</span>
                </Label>
                <ProductSelector
                  products={products}
                  selectedProductId={productId}
                  onProductChange={setProductId}
                  disabled={!campaignId}
                  loading={loadingProducts}
                />
                <p className="text-xs text-muted-foreground">
                  Choose a product from the selected campaign
                </p>
              </div>

              {products.length === 0 && campaignId && !loadingProducts && (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <PackageOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-semibold mb-1">
                      No products in this campaign
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add products to this campaign first
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/campaigns/${campaignId}`)
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Go to Campaign
                    </Button>
                  </CardContent>
                </Card>
              )}

              {selectedProduct && (
                <>
                  <Separator />
                  <ProductSummaryCard product={selectedProduct} />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Marketplace Offer</CardTitle>
                {offerId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOfferId(null)}
                  >
                    Change
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>
                  Select Offer <span className="text-red-500">*</span>
                </Label>
                {selectedProduct?.offers &&
                selectedProduct.offers.length > 0 ? (
                  <>
                    <OfferSelector
                      offers={selectedProduct.offers}
                      selectedOfferId={offerId}
                      onOfferChange={setOfferId}
                      disabled={!productId}
                    />
                    <p className="text-xs text-muted-foreground">
                      Choose which marketplace (Lazada or Shopee) to link to
                    </p>
                  </>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        {!productId
                          ? "Select a product first"
                          : "No offers available for this product"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <LinkPreviewCard
            campaignName={campaign?.name}
            productTitle={selectedProduct?.title}
            marketplace={selectedOffer?.marketplace}
            price={selectedOffer?.price}
            shortCode={generatedLink?.shortCode}
            targetUrl={generatedLink?.targetUrl}
          />

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid || generating}
                size="lg"
                className="w-full"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                {generating ? "Generating..." : "Generate Link"}
              </Button>
              {(campaignId || productId || offerId) && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  disabled={generating}
                  className="w-full"
                >
                  Reset Form
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
