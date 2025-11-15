"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Plus,
  Merge,
  Store,
  Tag,
  Sparkles,
} from "lucide-react";

interface Offer {
  id: string;
  marketplace: string;
  storeName: string;
  price: number;
  url: string;
  sku?: string | null;
}

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  offers: Offer[];
}

interface SimilarProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  similarProducts: Product[];
  newProductTitle: string;
  onAddToExisting: (productId: string) => void;
  onCreateNew: () => void;
}

export function SimilarProductDialog({
  open,
  onOpenChange,
  similarProducts,
  newProductTitle,
  onAddToExisting,
  onCreateNew,
}: SimilarProductDialogProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    similarProducts.length > 0 ? similarProducts[0]!.id : null
  );

  const handleAddToExisting = () => {
    if (selectedProductId) {
      onAddToExisting(selectedProductId);
      onOpenChange(false);
    }
  };

  const handleCreateNew = () => {
    onCreateNew();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Similar Products Found
          </DialogTitle>
          <DialogDescription>
            We found products with similar titles. Would you like to add this as
            a new offer to an existing product, or create a new product?
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 -mx-1">
          <div className="space-y-4">
            <Alert className="border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    New Product to Add:
                  </p>
                  <p className="font-semibold text-base text-blue-950 dark:text-blue-50 break-words">
                    {newProductTitle}
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span className="font-medium">Choose an option below</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div>
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <Store className="w-4 h-4" />
                Merge with existing product:
              </p>
              <RadioGroup
                value={selectedProductId || ""}
                onValueChange={setSelectedProductId}
                className="space-y-3"
              >
                {similarProducts.map((product) => {
                  const lowestPrice =
                    product.offers.length > 0
                      ? Math.min(...product.offers.map((o) => o.price))
                      : 0;
                  const isSelected = selectedProductId === product.id;

                  return (
                    <div key={product.id} className="relative">
                      <Label
                        htmlFor={product.id}
                        className={`flex gap-4 border-2 rounded-lg p-4 cursor-pointer transition-all overflow-hidden ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-muted hover:border-primary/50 hover:shadow-sm"
                        }`}
                      >
                        <RadioGroupItem
                          value={product.id}
                          id={product.id}
                          className="mt-1 shrink-0"
                        />

                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border shadow-sm">
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 overflow-hidden space-y-2">
                          <h3 className="font-semibold text-base wrap-break-word line-clamp-2 leading-snug">
                            {product.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-950 rounded-md">
                              <Tag className="w-3 h-3 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-bold text-green-700 dark:text-green-300">
                                ฿{lowestPrice.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {product.offers.some(
                                (o) => o.marketplace === "LAZADA"
                              ) && (
                                <div
                                  className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                  title="Lazada"
                                >
                                  L
                                </div>
                              )}
                              {product.offers.some(
                                (o) => o.marketplace === "SHOPEE"
                              ) && (
                                <div
                                  className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                  title="Shopee"
                                >
                                  S
                                </div>
                              )}
                            </div>

                            <Badge variant="secondary" className="text-xs">
                              {product.offers.length}{" "}
                              {product.offers.length === 1 ? "offer" : "offers"}
                            </Badge>
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Product
          </Button>
          <Button
            onClick={handleAddToExisting}
            disabled={!selectedProductId}
            className="gap-2"
          >
            <Merge className="w-4 h-4" />
            Merge with Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
