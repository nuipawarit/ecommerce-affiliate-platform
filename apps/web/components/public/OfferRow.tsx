"use client";

import { Badge } from "@/components/ui/badge";
import { MarketplaceButton } from "./MarketplaceButton";
import { MarketplaceBadge } from "./MarketplaceBadge";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Offer {
  id: string;
  marketplace: "LAZADA" | "SHOPEE";
  storeName: string;
  price: number;
}

interface Link {
  id: string;
  shortCode: string;
  offerId: string;
}

interface OfferRowProps {
  offer: Offer;
  link?: Link;
  isLowest: boolean;
  lowestPrice: number;
  size?: "large" | "compact";
}

export function OfferRow({
  offer,
  link,
  isLowest,
  lowestPrice,
  size = "compact",
}: OfferRowProps) {
  const isLarge = size === "large";
  const priceDiff = offer.price - lowestPrice;

  return (
    <article
      className={cn(
        "relative rounded-lg border-2 transition-all duration-300",
        isLowest
          ? "border-emerald-500 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
      )}
      aria-label={`${offer.marketplace} offer at ${offer.price} baht${isLowest ? " - Best price" : ""}`}
    >
      {/* Best Price Badge - Absolute positioned */}
      {isLowest && (
        <div className="absolute -top-3 left-4 z-10">
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg font-bold px-3 py-1">
            <Star className="w-3 h-3 fill-current mr-1" />
            Best Price
          </Badge>
        </div>
      )}

      <div className={cn("p-4 space-y-2", isLarge && "p-5 space-y-3")}>
        {/* Row 1: Marketplace Badge + Store Name */}
        <div className="flex items-center gap-2">
          <MarketplaceBadge marketplace={offer.marketplace} variant="compact" />
          <span
            className={cn(
              "text-sm text-slate-600 dark:text-slate-400 truncate flex-1",
              isLarge && "text-base"
            )}
          >
            {offer.storeName}
          </span>
        </div>

        {/* Row 2: Price + Button (MERGED - Single Line) */}
        <div className="flex items-center justify-between gap-3">
          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "font-bold transition-colors",
                isLarge ? "text-2xl" : "text-xl",
                isLowest
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-slate-900 dark:text-white"
              )}
              aria-label={`Price ${offer.price} baht`}
            >
              ฿{offer.price.toLocaleString()}
            </span>

            {/* Price Difference (for non-best prices) */}
            {!isLowest && priceDiff > 0 && (
              <span
                className={cn(
                  "text-red-600 dark:text-red-400 font-semibold",
                  isLarge ? "text-sm" : "text-xs"
                )}
                aria-label={`${priceDiff} baht more expensive`}
              >
                +฿{priceDiff.toLocaleString()}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <MarketplaceButton
            marketplace={offer.marketplace}
            shortCode={link?.shortCode}
            price={offer.price}
            storeName={offer.storeName}
            isLowest={isLowest}
            size={isLarge ? "default" : "sm"}
          />
        </div>
      </div>
    </article>
  );
}
