import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingDown, Store, Tag, X } from "lucide-react";

interface Offer {
  id: string;
  marketplace: string;
  price: number;
  sku?: string | null;
}

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  offers?: Offer[];
}

interface CampaignProductCardProps {
  product: Product;
  showRemove?: boolean;
  onRemove?: (productId: string) => void;
}

export function CampaignProductCard({
  product,
  showRemove = false,
  onRemove,
}: CampaignProductCardProps) {
  const offers = product.offers || [];
  const prices = offers.map((o) => o.price);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const hasLazada = offers.some((o) => o.marketplace === "LAZADA");
  const hasShopee = offers.some((o) => o.marketplace === "SHOPEE");

  return (
    <Card className="hover:shadow-lg transition-all border-2 group relative">
      <CardContent className="p-4">
        {showRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              onRemove(product.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <div className="flex gap-4">
          <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="font-semibold text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              {hasLazada && (
                <div
                  className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  title="Lazada"
                >
                  L
                </div>
              )}
              {hasShopee && (
                <div
                  className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  title="Shopee"
                >
                  S
                </div>
              )}
              <Badge variant="secondary" className="text-xs">
                <Store className="w-3 h-3 mr-1" />
                {offers.length} {offers.length === 1 ? "offer" : "offers"}
              </Badge>
            </div>

            {prices.length > 0 && (
              <div className="flex items-baseline gap-2">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold">
                    ฿{lowestPrice.toLocaleString()}
                  </span>
                </div>
                {lowestPrice !== highestPrice && (
                  <span className="text-xs text-muted-foreground">
                    - ฿{highestPrice.toLocaleString()}
                  </span>
                )}
              </div>
            )}

            <Link
              href={`/admin/products/${product.id}`}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              View details
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
