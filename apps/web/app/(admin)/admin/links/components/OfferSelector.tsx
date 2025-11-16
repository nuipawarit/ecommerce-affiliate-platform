"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Store, Tag, TrendingDown } from "lucide-react";
import type { Offer } from "@repo/shared";

interface OfferSelectorProps {
  offers: Offer[];
  selectedOfferId: string | null;
  onOfferChange: (offerId: string) => void;
  disabled?: boolean;
}

export function OfferSelector({
  offers,
  selectedOfferId,
  onOfferChange,
  disabled = false,
}: OfferSelectorProps) {
  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No offers available for this product
          </p>
        </CardContent>
      </Card>
    );
  }

  const prices = offers.map((o) => o.price);
  const lowestPrice = Math.min(...prices);

  return (
    <RadioGroup
      value={selectedOfferId || ""}
      onValueChange={onOfferChange}
      disabled={disabled}
      className="grid gap-3 md:grid-cols-2"
    >
      {offers.map((offer) => {
        const isBestPrice = offer.price === lowestPrice && offers.length > 1;
        const isLazada = offer.marketplace === "LAZADA";
        const isSelected = selectedOfferId === offer.id;

        return (
          <div key={offer.id} className="relative">
            <RadioGroupItem
              value={offer.id}
              id={offer.id}
              className="sr-only"
            />
            <Label
              htmlFor={offer.id}
              className={`cursor-pointer block ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Card
                className={`relative border-2 hover:shadow-md transition-all ${
                  isSelected
                    ? isLazada
                      ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/30"
                      : "border-red-500 bg-red-50/50 dark:bg-red-950/30"
                    : isLazada
                    ? "border-orange-200 hover:border-orange-300 dark:border-orange-800"
                    : "border-red-200 hover:border-red-300 dark:border-red-800"
                }`}
              >
                {isBestPrice && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg shadow-md flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      BEST PRICE
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isLazada ? (
                          <div
                            className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                            title="Lazada"
                          >
                            L
                          </div>
                        ) : (
                          <div
                            className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                            title="Shopee"
                          >
                            S
                          </div>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            isLazada
                              ? "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-300"
                              : "bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300"
                          }
                        >
                          {isLazada ? "Lazada" : "Shopee"}
                        </Badge>
                      </div>
                      {isSelected && (
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Store className="w-3.5 h-3.5" />
                      <span className="truncate">{offer.storeName}</span>
                    </div>

                    {offer.sku && (
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                        <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                          {offer.sku}
                        </code>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <p
                        className={`text-2xl font-bold ${
                          isBestPrice ? "text-green-600" : ""
                        }`}
                      >
                        ฿{offer.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
