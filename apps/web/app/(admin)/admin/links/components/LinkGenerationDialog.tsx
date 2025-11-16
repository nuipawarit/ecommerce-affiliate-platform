"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ProductSelector } from "./ProductSelector";
import { ProductSummaryCard } from "./ProductSummaryCard";
import { OfferSelector } from "./OfferSelector";
import { apiPost } from "@/lib/api-client";
import { buildAffiliateLink } from "@/lib/link-utils";
import {
  Copy,
  Check,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";
import type {
  LinkWithRelations,
  ProductWithOffers,
  Offer,
} from "@repo/shared";

interface LinkGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
  products: ProductWithOffers[];
  onLinkGenerated?: (link: LinkWithRelations) => void;
}

export function LinkGenerationDialog({
  open,
  onOpenChange,
  campaignId,
  campaignName,
  products,
  onLinkGenerated,
}: LinkGenerationDialogProps) {
  const [productId, setProductId] = useState<string | null>(null);
  const [offerId, setOfferId] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithOffers | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const [generatedLink, setGeneratedLink] = useState<LinkWithRelations | null>(
    null
  );
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setProductId(null);
        setOfferId(null);
        setSelectedProduct(null);
        setSelectedOffer(null);
        setGeneratedLink(null);
        setError("");
        setCopied(false);
      }, 200);
    }
  }, [open]);

  const handleGenerate = async () => {
    if (!campaignId || !productId || !offerId) {
      setError("Please select both product and marketplace offer");
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
      onLinkGenerated?.(data);
    } catch (err) {
      console.error("Failed to generate link:", err);
      setError(err instanceof Error ? err.message : "Failed to generate link");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedLink) return;

    const shortUrl = buildAffiliateLink(generatedLink.shortCode);
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleGenerateAnother = () => {
    setProductId(null);
    setOfferId(null);
    setSelectedProduct(null);
    setSelectedOffer(null);
    setGeneratedLink(null);
    setError("");
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const isFormValid = campaignId && productId && offerId;

  if (generatedLink) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <DialogTitle className="text-green-600">
                Link Generated Successfully!
              </DialogTitle>
            </div>
            <DialogDescription>
              Your affiliate link is ready to share
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Short URL</Label>
              <div className="flex gap-2">
                <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded border">
                  {buildAffiliateLink(generatedLink.shortCode)}
                </code>
                <Button onClick={handleCopy} size="sm" variant="outline">
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product:</span>
                <span className="font-medium">{generatedLink.product?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Campaign:</span>
                <span className="font-medium">{campaignName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clicks:</span>
                <span className="font-medium">{generatedLink._count?.clicks || 0}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleGenerateAnother}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Generate Another
            </Button>
            <Button onClick={handleClose}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Affiliate Link</DialogTitle>
          <DialogDescription>
            Create a trackable short link for {campaignName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="product">
              Step 1: Select Product *
            </Label>
            <ProductSelector
              products={products}
              selectedProductId={productId}
              onProductChange={setProductId}
            />
            {!productId && (
              <p className="text-xs text-muted-foreground">
                Choose a product from this campaign
              </p>
            )}
          </div>

          {selectedProduct && (
            <>
              <Separator />
              <ProductSummaryCard product={selectedProduct} />
            </>
          )}

          {selectedProduct && selectedProduct.offers && selectedProduct.offers.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>
                  Step 2: Select Marketplace Offer *
                </Label>
                <OfferSelector
                  offers={selectedProduct.offers}
                  selectedOfferId={offerId}
                  onOfferChange={setOfferId}
                />
                {!offerId && (
                  <p className="text-xs text-muted-foreground">
                    Choose which marketplace to promote
                  </p>
                )}
              </div>
            </>
          )}

          {selectedProduct && (!selectedProduct.offers || selectedProduct.offers.length === 0) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This product has no marketplace offers. Please add offers from Lazada or Shopee first.
              </AlertDescription>
            </Alert>
          )}

          {selectedOffer && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Link Preview</Label>
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Product:</span>
                    <span className="font-medium truncate ml-2">{selectedProduct?.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Marketplace:</span>
                    <span className="font-medium">{selectedOffer.marketplace}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">฿{selectedOffer.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="text-xs truncate ml-2 max-w-xs">{selectedOffer.url}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={generating}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid || generating}
          >
            {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
