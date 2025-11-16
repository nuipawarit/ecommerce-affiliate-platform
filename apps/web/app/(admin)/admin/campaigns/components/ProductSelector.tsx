"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api-client";

interface Offer {
  id: string;
  marketplace: string;
  price: number;
}

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  offers?: Offer[];
}

interface ProductSelectorProps {
  selectedProductIds: string[];
  onSelectionChange: (productIds: string[]) => void;
}

export function ProductSelector({
  selectedProductIds,
  onSelectionChange,
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await apiGet<{ products: Product[] }>("/api/products");
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const selectedProducts = products.filter((p) =>
    selectedProductIds.includes(p.id)
  );

  const toggleProduct = (productId: string) => {
    const newSelection = selectedProductIds.includes(productId)
      ? selectedProductIds.filter((id) => id !== productId)
      : [...selectedProductIds, productId];

    onSelectionChange(newSelection);
  };

  const removeProduct = (productId: string) => {
    onSelectionChange(selectedProductIds.filter((id) => id !== productId));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedProductIds.length === 0
              ? "Select products..."
              : `${selectedProductIds.length} product${
                  selectedProductIds.length === 1 ? "" : "s"
                } selected`}
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
                  const offers = product.offers || [];
                  const prices = offers.map(o => o.price);
                  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
                  const lazadaCount = offers.filter(o => o.marketplace === 'lazada').length;
                  const shopeeCount = offers.filter(o => o.marketplace === 'shopee').length;

                  return (
                    <CommandItem
                      key={product.id}
                      value={product.title}
                      onSelect={() => toggleProduct(product.id)}
                      className="flex items-start gap-3 p-3"
                    >
                      <Check
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0",
                          selectedProductIds.includes(product.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-12 w-12 rounded object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {offers.length > 0 && (
                            <>
                              <span className="text-sm text-muted-foreground">
                                ฿{minPrice.toLocaleString()}{maxPrice !== minPrice && ` - ฿${maxPrice.toLocaleString()}`}
                              </span>
                              <div className="flex gap-1">
                                {lazadaCount > 0 && (
                                  <Badge variant="outline" className="h-5 px-1.5 text-xs bg-orange-50 text-orange-700 border-orange-200">
                                    L
                                  </Badge>
                                )}
                                {shopeeCount > 0 && (
                                  <Badge variant="outline" className="h-5 px-1.5 text-xs bg-red-50 text-red-700 border-red-200">
                                    S
                                  </Badge>
                                )}
                              </div>
                            </>
                          )}
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

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50">
          {selectedProducts.map((product) => (
            <Badge
              key={product.id}
              variant="secondary"
              className="pl-2 pr-1 py-1 gap-1"
            >
              <span className="max-w-[200px] truncate">{product.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeProduct(product.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
