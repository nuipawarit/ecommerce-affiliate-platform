"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildAffiliateLink } from "@/lib/link-utils";

interface MarketplaceButtonProps {
  marketplace: "LAZADA" | "SHOPEE";
  shortCode?: string;
  price: number;
  storeName?: string;
  isLowest?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function MarketplaceButton({
  marketplace,
  shortCode,
  price,
  storeName,
  isLowest = false,
  className,
  size = "default",
}: MarketplaceButtonProps) {
  const isLazada = marketplace === "LAZADA";
  const affiliateUrl = shortCode ? buildAffiliateLink(shortCode) : "";

  if (!shortCode) {
    return (
      <Button
        disabled
        variant="outline"
        size={size}
        className={cn("min-h-[40px] opacity-60 cursor-not-allowed", className)}
        aria-label="Product not available"
      >
        Not Available
      </Button>
    );
  }

  const baseStyles = isLazada
    ? "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
    : "bg-orange-600 hover:bg-orange-700 border-orange-600 text-white";

  return (
    <Button
      asChild
      size={size}
      className={cn(
        baseStyles,
        "shadow-sm hover:shadow-md",
        "min-h-[44px] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95",
        className
      )}
      aria-label={`Buy ${marketplace === "LAZADA" ? "on Lazada" : "on Shopee"} for ${price} baht${isLowest ? " - Best price" : ""}`}
    >
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2"
      >
        <span className="font-bold">Buy Now</span>
        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    </Button>
  );
}
