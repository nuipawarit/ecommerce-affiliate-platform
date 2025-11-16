"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductWithOffers } from "@repo/shared";
import Image from "next/image";

interface ProductSelectorProps {
  products: ProductWithOffers[];
  selectedProductId: string | null;
  onProductChange: (productId: string | null) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ProductSelector({
  products,
  selectedProductId,
  onProductChange,
  disabled = false,
  loading = false,
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const getMarketplaceBadges = (product: ProductWithOffers) => {
    const marketplaces = new Set(
      product.offers?.map((o) => o.marketplace) || []
    );
    return Array.from(marketplaces);
  };

  const getPriceRange = (product: ProductWithOffers) => {
    const prices = product.offers?.map((o) => o.price) || [];
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `฿${min.toLocaleString()}`;
    return `฿${min.toLocaleString()} - ฿${max.toLocaleString()}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[44px]"
          disabled={disabled || loading}
        >
          {selectedProduct ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border">
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="truncate font-medium text-sm">
                  {selectedProduct.title}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {getMarketplaceBadges(selectedProduct).map((marketplace) => (
                    <div
                      key={marketplace}
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                        marketplace === "LAZADA"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      )}
                      title={marketplace}
                    >
                      {marketplace === "LAZADA" ? "L" : "S"}
                    </div>
                  ))}
                  <span className="text-xs text-muted-foreground">
                    {selectedProduct.offers?.length || 0} offer(s)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {loading ? "Loading products..." : "Select product..."}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading products..." : "No products found."}
            </CommandEmpty>
            <CommandGroup>
              {products.map((product) => {
                const marketplaces = getMarketplaceBadges(product);
                const priceRange = getPriceRange(product);

                return (
                  <CommandItem
                    key={product.id}
                    value={product.title}
                    onSelect={() => {
                      onProductChange(
                        product.id === selectedProductId ? null : product.id
                      );
                      setOpen(false);
                    }}
                    className="py-3"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        selectedProductId === product.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate font-medium text-sm">
                          {product.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {marketplaces.map((marketplace) => (
                              <div
                                key={marketplace}
                                className={cn(
                                  "w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                                  marketplace === "LAZADA"
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                                )}
                                title={marketplace}
                              >
                                {marketplace === "LAZADA" ? "L" : "S"}
                              </div>
                            ))}
                          </div>
                          {priceRange && (
                            <span className="text-xs text-muted-foreground">
                              {priceRange}
                            </span>
                          )}
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-4"
                          >
                            {product.offers?.length || 0} offers
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
