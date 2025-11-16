"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  ExternalLink,
  MousePointerClick,
  Calendar,
} from "lucide-react";
import { buildAffiliateLink } from "@/lib/link-utils";

interface LinkCardProps {
  link: {
    id: string;
    shortCode: string;
    targetUrl: string;
    createdAt?: string | Date;
    _count?: {
      clicks: number;
    };
    product?: {
      id: string;
      title: string;
      imageUrl: string;
    };
    offer?: {
      id: string;
      marketplace: "LAZADA" | "SHOPEE";
      storeName: string;
      price: number;
    };
  };
}

export function LinkCard({ link }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = buildAffiliateLink(link.shortCode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleOpenLink = () => {
    window.open(fullUrl, "_blank");
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMarketplaceBadge = (marketplace: "LAZADA" | "SHOPEE") => {
    if (marketplace === "LAZADA") {
      return (
        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          L
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
        S
      </div>
    );
  };

  return (
    <Card className="hover:shadow-md transition-all border-2">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {link.product?.imageUrl && (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border shadow-sm shrink-0">
              <Image
                src={link.product.imageUrl}
                alt={link.product.title || "Product"}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {link.product?.title || "Unknown Product"}
                </h3>
                {link.offer && (
                  <p className="text-xs text-muted-foreground truncate">
                    {link.offer.storeName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {link.offer && getMarketplaceBadge(link.offer.marketplace)}
                {link.offer && (
                  <p className="font-bold text-lg text-green-600 whitespace-nowrap">
                    ฿{link.offer.price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-xs font-mono bg-muted px-2 py-1 rounded border">
                {fullUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={copied ? "bg-green-50 border-green-500" : ""}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleOpenLink}>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                <MousePointerClick className="w-3 h-3" />
                {link._count?.clicks || 0}
              </Badge>
              {link.createdAt && (
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  {formatDate(link.createdAt)}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground truncate">
              → {link.targetUrl}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
