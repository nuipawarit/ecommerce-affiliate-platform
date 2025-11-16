import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProductWithOffers } from "@repo/shared";
import Image from "next/image";

interface ProductSummaryCardProps {
  product: ProductWithOffers;
}

export function ProductSummaryCard({ product }: ProductSummaryCardProps) {
  const marketplaces = new Set(product.offers?.map((o) => o.marketplace) || []);
  const prices = product.offers?.map((o) => o.price) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <Card className="border-2">
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border shadow-sm">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="font-semibold text-base line-clamp-2">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {Array.from(marketplaces).map((marketplace) => (
                <div
                  key={marketplace}
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm",
                    marketplace === "LAZADA" ? "bg-orange-500" : "bg-red-500"
                  )}
                  title={marketplace}
                >
                  {marketplace === "LAZADA" ? "L" : "S"}
                </div>
              ))}
              <Badge variant="secondary" className="text-xs">
                {product.offers?.length || 0} offers
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Price:</span>
              {minPrice === maxPrice ? (
                <span className="font-semibold text-lg">
                  ฿{minPrice.toLocaleString()}
                </span>
              ) : (
                <span className="font-semibold text-lg">
                  ฿{minPrice.toLocaleString()} - ฿{maxPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
