"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Loader2,
  Search,
  Link as LinkIcon,
  Hash,
  ShoppingCart,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiPost } from "@/lib/api-client";
import { SimilarProductDialog } from "../components/SimilarProductDialog";

interface SearchResult {
  title: string;
  imageUrl: string;
  storeName: string;
  price: number;
  marketplace: "lazada" | "shopee";
  url: string;
  sku?: string;
}

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

const getMarketplaceColor = (marketplace: string): string => {
  return marketplace === "lazada" ? "bg-orange-500" : "bg-red-500";
};

export default function SearchProductsPage() {
  const router = useRouter();
  const [inputType, setInputType] = useState<"url" | "sku">("url");
  const [url, setUrl] = useState("");
  const [sku, setSku] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<Set<number>>(
    new Set()
  );
  const [mergeMode, setMergeMode] = useState<"merge" | "separate">("separate");
  const [showSimilarDialog, setShowSimilarDialog] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [pendingProduct, setPendingProduct] = useState<SearchResult | null>(
    null
  );
  const [pendingProducts, setPendingProducts] = useState<SearchResult[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSearchResults([]);
    setSelectedResults(new Set());
    setHasSearched(false);

    try {
      const payload = inputType === "url" ? { url } : { sku };
      const data = await apiPost<SearchResult[]>(
        "/api/products/search",
        payload
      );
      setSearchResults(data || []);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedResults);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedResults(newSelected);
  };

  const selectAll = () => {
    setSelectedResults(new Set(searchResults.map((_, i) => i)));
  };

  const clearSelection = () => {
    setSelectedResults(new Set());
  };

  const checkForSimilarProducts = async (title: string): Promise<Product[]> => {
    try {
      const similar = await apiPost<Product[]>("/api/products/check-similar", {
        title,
        threshold: 0.8,
      });
      return similar || [];
    } catch (err) {
      console.error("Failed to check for similar products:", err);
      return [];
    }
  };

  const addProductWithSimilarCheck = async (product: SearchResult) => {
    const similar = await checkForSimilarProducts(product.title);

    if (similar.length > 0) {
      setPendingProduct(product);
      setSimilarProducts(similar);
      setShowSimilarDialog(true);
      return null;
    }

    return await apiPost<Product>("/api/products", {
      url: product.url,
      marketplace: product.marketplace,
    });
  };

  const handleAddToExisting = async (productId: string) => {
    if (!pendingProduct) return;

    try {
      await apiPost(`/api/products/${productId}/offers`, {
        url: pendingProduct.url,
        marketplace: pendingProduct.marketplace,
      });
      setPendingProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add offer");
      throw err;
    }
  };

  const handleCreateNew = async () => {
    if (!pendingProduct) return;

    try {
      await apiPost("/api/products", {
        url: pendingProduct.url,
        marketplace: pendingProduct.marketplace,
      });
      setPendingProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
      throw err;
    }
  };

  const handleAddSelected = async () => {
    if (selectedResults.size === 0) return;

    setLoading(true);
    setError("");

    try {
      const selectedProducts = Array.from(selectedResults)
        .map((i) => searchResults[i])
        .filter((product): product is SearchResult => product !== undefined);

      if (mergeMode === "merge") {
        if (selectedProducts.length === 0) return;

        const firstProductData = selectedProducts[0];
        if (!firstProductData) return;

        const firstProduct = await addProductWithSimilarCheck(firstProductData);
        if (!firstProduct) {
          setLoading(false);
          return;
        }

        for (let i = 1; i < selectedProducts.length; i++) {
          const product = selectedProducts[i];
          if (!product) continue;

          await apiPost(`/api/products/${firstProduct.id}/offers`, {
            url: product.url,
            marketplace: product.marketplace,
          });
        }

        router.push("/admin/products");
        router.refresh();
      } else {
        setPendingProducts(selectedProducts);
        setCurrentProductIndex(0);
        await processNextProduct(selectedProducts, 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add products");
      setLoading(false);
    }
  };

  const processNextProduct = async (products: SearchResult[], index: number) => {
    if (index >= products.length) {
      router.push("/admin/products");
      router.refresh();
      return;
    }

    const product = products[index];
    if (!product) {
      router.push("/admin/products");
      router.refresh();
      return;
    }

    const similar = await checkForSimilarProducts(product.title);

    if (similar.length > 0) {
      setPendingProduct(product);
      setSimilarProducts(similar);
      setCurrentProductIndex(index);
      setShowSimilarDialog(true);
      setLoading(false);
    } else {
      await apiPost<Product>("/api/products", {
        url: product.url,
        marketplace: product.marketplace,
      });
      await processNextProduct(products, index + 1);
    }
  };

  const lowestPrice =
    searchResults.length > 0
      ? Math.min(...searchResults.map((r) => r.price))
      : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              Add Products
            </h1>
            <p className="text-muted-foreground mt-1">
              Search and add products from Lazada and Shopee
            </p>
          </div>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Product Search
          </CardTitle>
          <CardDescription>
            Search by product URL or SKU code to find and compare products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={inputType}
            onValueChange={(v) => setInputType(v as "url" | "sku")}
            className="space-y-4"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                URL
              </TabsTrigger>
              <TabsTrigger value="sku" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                SKU
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSearch} className="space-y-4">
              <TabsContent value="url" className="space-y-3 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-base">
                    Product URL
                  </Label>
                  <div className="relative">
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://www.lazada.co.th/products/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      disabled={loading}
                      className="pr-10 h-11"
                    />
                    {url && (
                      <button
                        type="button"
                        onClick={() => setUrl("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Clear URL input"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Paste the full product URL from Lazada or Shopee
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="sku" className="space-y-3 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-base">
                    Product SKU
                  </Label>
                  <div className="relative">
                    <Input
                      id="sku"
                      type="text"
                      placeholder="e.g., ABC123, XYZ789"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                      disabled={loading}
                      className="pr-10 h-11"
                    />
                    {sku && (
                      <button
                        type="button"
                        onClick={() => setSku("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Clear SKU input"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter SKU code to search across all marketplaces
                  </p>
                </div>
              </TabsContent>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={loading || (inputType === "url" ? !url : !sku)}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Search Products
                  </>
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {hasSearched && searchResults.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Search Results
                </CardTitle>
                <CardDescription>
                  Found {searchResults.length}{" "}
                  {searchResults.length === 1 ? "product" : "products"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  <Check className="w-4 h-4 mr-1" />
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {searchResults.map((result, index) => {
                const isSelected = selectedResults.has(index);
                const isBestPrice =
                  result.price === lowestPrice && searchResults.length > 1;

                return (
                  <div
                    key={index}
                    onClick={() => toggleSelection(index)}
                    className={`relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-muted hover:border-primary/50 hover:shadow-sm"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelection(index)}
                      className="flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border shadow-sm">
                      <Image
                        src={result.imageUrl}
                        alt={result.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="font-semibold text-base line-clamp-2 leading-snug">
                        {result.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={`${getMarketplaceColor(result.marketplace)} text-white border-0`}
                        >
                          {result.marketplace.charAt(0).toUpperCase() +
                            result.marketplace.slice(1)}
                        </Badge>
                        {result.sku && (
                          <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                            {result.sku}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground truncate">
                          {result.storeName}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right space-y-1">
                      <p className="text-2xl font-bold text-green-600">
                        ฿{result.price.toLocaleString()}
                      </p>
                      {isBestPrice && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white shadow-sm">
                          Best Price
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedResults.size > 1 && (
              <div className="p-4 border-2 rounded-xl bg-muted/30">
                <Label className="text-base font-semibold mb-3 block">
                  How would you like to add these products?
                </Label>
                <RadioGroup
                  value={mergeMode}
                  onValueChange={(value) =>
                    setMergeMode(value as "merge" | "separate")
                  }
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="merge" id="merge" className="mt-1" />
                    <Label
                      htmlFor="merge"
                      className="cursor-pointer flex-1 font-normal"
                    >
                      <span className="font-semibold block mb-1">
                        Merge into one product
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Create a single product with multiple offers from
                        different marketplaces
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem
                      value="separate"
                      id="separate"
                      className="mt-1"
                    />
                    <Label
                      htmlFor="separate"
                      className="cursor-pointer flex-1 font-normal"
                    >
                      <span className="font-semibold block mb-1">
                        Add as separate products
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Create individual product entries for each marketplace
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                size="lg"
                onClick={handleAddSelected}
                disabled={selectedResults.size === 0 || loading}
                className="flex-1 sm:flex-initial"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add{" "}
                    {selectedResults.size > 0 ? `${selectedResults.size} ` : ""}
                    Product{selectedResults.size !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
              <Link href="/admin/products">
                <Button variant="outline" size="lg" disabled={loading}>
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {hasSearched && !loading && searchResults.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We couldn&apos;t find any products matching your search. Try a
              different URL or SKU.
            </p>
          </CardContent>
        </Card>
      )}

      <SimilarProductDialog
        open={showSimilarDialog}
        onOpenChange={setShowSimilarDialog}
        similarProducts={similarProducts}
        newProductTitle={pendingProduct?.title || ""}
        onAddToExisting={async (productId) => {
          await handleAddToExisting(productId);
          setShowSimilarDialog(false);

          if (mergeMode === "separate" && pendingProducts.length > 0) {
            setLoading(true);
            await processNextProduct(pendingProducts, currentProductIndex + 1);
          } else if (mergeMode === "merge" && selectedResults.size > 1) {
            const selectedProducts = Array.from(selectedResults)
              .map((i) => searchResults[i])
              .filter(
                (product): product is SearchResult => product !== undefined
              );

            for (let i = 1; i < selectedProducts.length; i++) {
              const product = selectedProducts[i];
              if (product && product !== pendingProduct) {
                await apiPost(`/api/products/${productId}/offers`, {
                  url: product.url,
                  marketplace: product.marketplace,
                });
              }
            }
            router.push("/admin/products");
            router.refresh();
          } else {
            router.push("/admin/products");
            router.refresh();
          }
        }}
        onCreateNew={async () => {
          await handleCreateNew();
          setShowSimilarDialog(false);

          if (mergeMode === "separate" && pendingProducts.length > 0) {
            setLoading(true);
            await processNextProduct(pendingProducts, currentProductIndex + 1);
          } else if (mergeMode === "merge" && selectedResults.size > 1) {
            const selectedProducts = Array.from(selectedResults)
              .map((i) => searchResults[i])
              .filter(
                (product): product is SearchResult => product !== undefined
              );

            const firstProductData = selectedProducts[0];
            if (!firstProductData) return;

            const firstProduct = await apiPost<Product>("/api/products", {
              url: firstProductData.url,
              marketplace: firstProductData.marketplace,
            });

            for (let i = 1; i < selectedProducts.length; i++) {
              const product = selectedProducts[i];
              if (product && product !== pendingProduct) {
                await apiPost(`/api/products/${firstProduct.id}/offers`, {
                  url: product.url,
                  marketplace: product.marketplace,
                });
              }
            }
            router.push("/admin/products");
            router.refresh();
          } else {
            router.push("/admin/products");
            router.refresh();
          }
        }}
      />
    </div>
  );
}
