"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package } from "lucide-react";

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
  offers: Offer[];
}

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <CardHeader>
        <CardTitle>All Products</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No products found" : "No products yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding your first product from Lazada or Shopee"}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Best Price</TableHead>
                  <TableHead className="text-center">Marketplaces</TableHead>
                  <TableHead className="text-center">Offers</TableHead>
                  <TableHead className="text-right">Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const lowestPrice =
                    product.offers.length > 0
                      ? Math.min(...product.offers.map((o) => o.price))
                      : null;
                  const hasLazada = product.offers.some(
                    (o) => o.marketplace === "LAZADA"
                  );
                  const hasShopee = product.offers.some(
                    (o) => o.marketplace === "SHOPEE"
                  );

                  return (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <Link href={`/admin/products/${product.id}`}>
                          <div className="relative h-16 w-16 overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                            <Image
                              src={product.imageUrl}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="hover:underline block"
                        >
                          <div className="font-semibold text-base line-clamp-2">
                            {product.title}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {lowestPrice !== null ? (
                          <p className="font-bold text-xl text-green-600 whitespace-nowrap">
                            ฿{lowestPrice.toLocaleString()}
                          </p>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5 justify-center">
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
                          {product.offers.length === 0 && (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className="font-semibold text-sm px-2.5"
                        >
                          {product.offers.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </>
  );
}
