"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OfferRow } from "./OfferRow";
import { ChevronDown, ChevronUp, TrendingDown } from "lucide-react";

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

interface OfferListProps {
  offers: Offer[];
  links: Link[];
  size?: "large" | "compact";
}

export function OfferList({ offers, links, size = "compact" }: OfferListProps) {
  const [showAll, setShowAll] = useState(false);

  const sortedOffers = [...offers].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedOffers[0]?.price || 0;

  const defaultLimit = size === "large" ? 4 : 3;
  const visibleOffers = showAll
    ? sortedOffers
    : sortedOffers.slice(0, defaultLimit);
  const hasMore = sortedOffers.length > defaultLimit;
  const hiddenCount = sortedOffers.length - defaultLimit;

  return (
    <div className="space-y-4">
      {/* Offer Count Header */}
      <div className="flex items-center gap-2 justify-between">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {sortedOffers.length} {sortedOffers.length === 1 ? "Offer" : "Offers"}{" "}
          Available
        </span>
        {sortedOffers.length > 1 && (
          <Badge
            variant="secondary"
            className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400"
          >
            <TrendingDown className="w-3 h-3 mr-1" />
            Compare Prices
          </Badge>
        )}
      </div>

      {/* Offer Rows */}
      <div className="space-y-3">
        {visibleOffers.map((offer) => {
          const link = links.find((l) => l.offerId === offer.id);
          const isLowest = offer.price === lowestPrice;

          return (
            <OfferRow
              key={offer.id}
              offer={offer}
              link={link}
              isLowest={isLowest}
              lowestPrice={lowestPrice}
              size={size}
            />
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full border-dashed hover:border-solid hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
          aria-label={
            showAll
              ? "Show less offers"
              : `Show ${hiddenCount} more ${hiddenCount === 1 ? "offer" : "offers"}`
          }
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Show {hiddenCount} More {hiddenCount === 1 ? "Offer" : "Offers"}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
