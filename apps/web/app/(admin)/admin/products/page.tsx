import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Package, TrendingUp, Store } from "lucide-react";
import { ProductsTable } from "./components/ProductsTable";
import { apiGet } from "@/lib/api-client";
import type { ProductWithCounts, ProductsListResponse } from "@repo/shared";

async function getProducts(): Promise<ProductWithCounts[]> {
  try {
    const data = await apiGet<ProductsListResponse>('/api/products');
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  const totalProducts = products.length;
  const totalOffers = products.reduce((sum, p) => sum + p.offers.length, 0);
  const allPrices = products.flatMap(p => p.offers.map(o => o.price));
  const averagePrice = allPrices.length > 0
    ? Math.round(allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length)
    : 0;
  const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage products from Lazada and Shopee
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {totalProducts > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{totalProducts}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across all marketplaces
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Offers</p>
                <Store className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{totalOffers}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(totalOffers / totalProducts).toFixed(1)} avg per product
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Average Price</p>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">฿{averagePrice.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                From all offers
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Best Deal</p>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">฿{lowestPrice.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Lowest price available
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <ProductsTable products={products} />
      </Card>
    </div>
  );
}
