"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { apiPut } from "@/lib/api-client";

interface RefreshButtonProps {
  productId: string;
}

export function RefreshButton({ productId }: RefreshButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await apiPut(`/api/products/${productId}/refresh`, {});
      router.refresh();
    } catch (error) {
      console.error("Failed to refresh product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleRefresh} disabled={loading} variant="outline">
      <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      Refresh Prices
    </Button>
  );
}
