"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CampaignProductCard } from "./CampaignProductCard";
import { ProductSelector } from "./ProductSelector";
import { apiPut } from "@/lib/api-client";

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

interface CampaignProductsManagerProps {
  campaignId: string;
  initialProducts: Product[];
  currentProductIds: string[];
}

export function CampaignProductsManager({
  campaignId,
  initialProducts,
  currentProductIds,
}: CampaignProductsManagerProps) {
  const router = useRouter();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [productToRemove, setProductToRemove] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] =
    useState<string[]>(currentProductIds);
  const [loading, setLoading] = useState(false);

  const handleAddProducts = async () => {
    setLoading(true);
    try {
      await apiPut(`/api/campaigns/${campaignId}`, {
        productIds: selectedProductIds,
      });

      setShowAddDialog(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to add products:", error);
      alert("Failed to add products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setProductToRemove(productId);
    setShowRemoveDialog(true);
  };

  const confirmRemoveProduct = async () => {
    if (!productToRemove) return;

    setLoading(true);
    try {
      const newProductIds = currentProductIds.filter(
        (id) => id !== productToRemove
      );

      await apiPut(`/api/campaigns/${campaignId}`, {
        productIds: newProductIds,
      });

      setShowRemoveDialog(false);
      setProductToRemove(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to remove product:", error);
      alert("Failed to remove product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {initialProducts.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {initialProducts.length}{" "}
              {initialProducts.length === 1 ? "product" : "products"} in this
              campaign
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedProductIds(currentProductIds);
                setShowAddDialog(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Products
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialProducts.map((product) => (
              <CampaignProductCard
                key={product.id}
                product={product}
                showRemove={true}
                onRemove={handleRemoveProduct}
              />
            ))}
          </div>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              Add products to this campaign to start generating affiliate links
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedProductIds([]);
                setShowAddDialog(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Products
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Products to Campaign</DialogTitle>
            <DialogDescription>
              Select products to add to this campaign. You can select multiple
              products at once.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <ProductSelector
              selectedProductIds={selectedProductIds}
              onSelectionChange={setSelectedProductIds}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddProducts}
              disabled={loading || selectedProductIds.length === 0}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add{" "}
              {selectedProductIds.length > 0 &&
                `(${selectedProductIds.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove product from campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the product from this campaign. Any affiliate
              links associated with this product will remain but won't be shown
              in the campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveProduct}
              disabled={loading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
