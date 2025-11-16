"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { getLinkDomain, buildAffiliateLink } from "@/lib/link-utils";

interface LinkPreviewCardProps {
  campaignName?: string;
  productTitle?: string;
  marketplace?: string;
  price?: number;
  shortCode?: string;
  targetUrl?: string;
}

export function LinkPreviewCard({
  campaignName,
  productTitle,
  marketplace,
  price,
  shortCode,
  targetUrl,
}: LinkPreviewCardProps) {
  const domain = getLinkDomain();
  const shortUrl = shortCode ? buildAffiliateLink(shortCode) : "";

  const hasPreview = campaignName || productTitle || marketplace;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Link Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPreview ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Short URL
                </span>
                {shortCode && (
                  <Badge variant="secondary" className="font-mono text-xs">
                    Generated
                  </Badge>
                )}
              </div>
              <div className="rounded-md bg-background/60 border p-3">
                <code className="text-sm font-mono break-all">
                  {shortUrl || `${domain}/go/{shortCode}`}
                </code>
              </div>
            </div>

            {targetUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Target URL
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="rounded-md bg-background/60 border p-3">
                  <code className="text-xs font-mono break-all text-muted-foreground">
                    {targetUrl}
                  </code>
                </div>
              </div>
            )}

            <div className="pt-2 border-t space-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                Link Details
              </span>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Campaign:</span>
                  <p className="font-medium truncate">
                    {campaignName || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Product:</span>
                  <p className="font-medium truncate">
                    {productTitle || "—"}
                  </p>
                </div>
                {marketplace && (
                  <div>
                    <span className="text-muted-foreground">Marketplace:</span>
                    <p className="font-medium">{marketplace}</p>
                  </div>
                )}
                {price !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <p className="font-medium">฿{price.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <LinkIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Select campaign, product, and offer to preview your link
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
