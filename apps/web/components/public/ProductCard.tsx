"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { OfferList } from "./OfferList";

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

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    imageUrl: string;
    offers: Offer[];
  };
  links: Link[];
  size?: "large" | "compact";
}

export function ProductCard({
  product,
  links,
  size = "compact",
}: ProductCardProps) {
  const isLarge = size === "large";

  return (
    <Card
      className="group overflow-hidden border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      role="article"
      aria-label={`${product.title} product card`}
    >
      {/* Product Image - No overlay badge */}
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain"
            sizes={
              isLarge
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            priority={isLarge}
          />
        </div>
      </div>

      <CardContent className={`${isLarge ? "px-6" : "px-4"} space-y-4`}>
        {/* Product Title */}
        <h3
          className={`font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors min-h-[45px] ${
            isLarge ? "text-xl" : "text-lg"
          }`}
        >
          {product.title}
        </h3>

        {/* Offers List - No PriceComparisonBar */}
        <OfferList offers={product.offers} links={links} size={size} />
      </CardContent>
    </Card>
  );
}
