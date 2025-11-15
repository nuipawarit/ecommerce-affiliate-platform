import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Calendar, TrendingDown, Store, Tag, Clock } from "lucide-react";
import { RefreshButton } from "../components/RefreshButton";
import { apiGet } from "@/lib/api-client";

interface Offer {
  id: string;
  marketplace: string;
  storeName: string;
  price: number;
  url: string;
  sku?: string | null;
  lastCheckedAt: string;
}

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  offers: Offer[];
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const data = await apiGet<Product>(`/api/products/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const lowestPrice = product.offers.length > 0
    ? Math.min(...product.offers.map((o) => o.price))
    : 0;

  const highestPrice = product.offers.length > 0
    ? Math.max(...product.offers.map((o) => o.price))
    : 0;

  const averagePrice = product.offers.length > 0
    ? Math.round(product.offers.reduce((sum, o) => sum + o.price, 0) / product.offers.length)
    : 0;

  const savings = highestPrice - lowestPrice;

  const hasLazada = product.offers.some(o => o.marketplace === 'LAZADA');
  const hasShopee = product.offers.some(o => o.marketplace === 'SHOPEE');

  const getMarketplaceColor = (marketplace: string) => {
    switch (marketplace.toUpperCase()) {
      case 'LAZADA':
        return 'border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/30';
      case 'SHOPEE':
        return 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30';
      default:
        return 'border-muted';
    }
  };

  const getMarketplaceBadge = (marketplace: string) => {
    switch (marketplace.toUpperCase()) {
      case 'LAZADA':
        return 'bg-orange-500 hover:bg-orange-600 border-orange-600';
      case 'SHOPEE':
        return 'bg-red-500 hover:bg-red-600 border-red-600';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-64 h-64 flex-shrink-0 overflow-hidden rounded-xl border-2 shadow-lg bg-white dark:bg-gray-950">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 break-words">
                  {product.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {hasLazada && (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-300">
                      <Store className="w-3 h-3 mr-1" />
                      Lazada
                    </Badge>
                  )}
                  {hasShopee && (
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300">
                      <Store className="w-3 h-3 mr-1" />
                      Shopee
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {product.offers.length} {product.offers.length === 1 ? 'Offer' : 'Offers'}
                  </Badge>
                </div>
              </div>

              <RefreshButton productId={product.id} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Product ID</span>
                </div>
                <p className="font-mono text-xs truncate">{product.id}</p>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Added</span>
                </div>
                <p className="text-xs">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Updated</span>
                </div>
                <p className="text-xs">{new Date(product.updatedAt).toLocaleDateString()}</p>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Savings</span>
                </div>
                <p className="text-xs font-semibold text-green-600">
                  {savings > 0 ? `฿${savings.toLocaleString()}` : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {product.offers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Best Price</p>
                <TrendingDown className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                ฿{lowestPrice.toLocaleString()}
              </p>
              {savings > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Save ฿{savings.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Price Range</p>
                <Tag className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">
                  ฿{lowestPrice.toLocaleString()} - ฿{highestPrice.toLocaleString()}
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-orange-500 h-2 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Average Price</p>
                <Store className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">
                ฿{averagePrice.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                From {product.offers.length} offers
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Marketplaces</p>
                <Store className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {hasLazada && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-950 rounded-md">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Lazada</span>
                  </div>
                )}
                {hasShopee && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-950 rounded-md">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">Shopee</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Price Comparison</h2>
          <p className="text-sm text-muted-foreground">
            Showing {product.offers.length} {product.offers.length === 1 ? 'offer' : 'offers'}
          </p>
        </div>

        {product.offers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground font-medium">No offers available</p>
              <p className="text-sm text-muted-foreground mt-1">Add offers from different marketplaces to compare prices</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {product.offers
              .sort((a, b) => a.price - b.price)
              .map((offer, index) => {
                const priceDiff = offer.price - lowestPrice;
                const percentDiff = lowestPrice > 0 ? ((priceDiff / lowestPrice) * 100).toFixed(1) : 0;

                return (
                  <Card
                    key={offer.id}
                    className={`relative overflow-hidden hover:shadow-lg transition-all duration-200 border-2 ${getMarketplaceColor(offer.marketplace)}`}
                  >
                    {offer.price === lowestPrice && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg shadow-md flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          BEST PRICE
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="capitalize text-lg flex items-center gap-2">
                          <Store className="w-4 h-4" />
                          {offer.marketplace.toLowerCase()}
                        </CardTitle>
                        {index === 0 && offer.price !== lowestPrice && (
                          <Badge variant="outline" className="text-xs">
                            Rank #{index + 1}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Store Name</p>
                        <p className="font-semibold text-base">{offer.storeName}</p>
                      </div>

                      {offer.sku && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            SKU
                          </p>
                          <p className="font-mono text-sm font-medium bg-muted/50 px-2 py-1 rounded">
                            {offer.sku}
                          </p>
                        </div>
                      )}

                      <div className="pt-2 border-t">
                        <div className="flex items-baseline justify-between mb-1">
                          <p className="text-sm text-muted-foreground">Price</p>
                          {priceDiff > 0 && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                              +฿{priceDiff.toLocaleString()} ({percentDiff}%)
                            </p>
                          )}
                        </div>
                        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          ฿{offer.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
                        <Clock className="w-3 h-3" />
                        <span>Updated {new Date(offer.lastCheckedAt).toLocaleDateString()}</span>
                      </div>

                      <Link href={offer.url} target="_blank" rel="noopener noreferrer" className="block">
                        <Button
                          variant="outline"
                          className={`w-full transition-all duration-200 ${getMarketplaceBadge(offer.marketplace)} text-white border-0 hover:shadow-md`}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on {offer.marketplace.toLowerCase()}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
