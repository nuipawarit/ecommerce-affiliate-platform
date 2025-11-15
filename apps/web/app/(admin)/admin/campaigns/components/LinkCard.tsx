"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Package } from "lucide-react";

interface LinkCardProps {
  link: {
    id: string;
    shortCode: string;
    targetUrl: string;
    _count?: {
      clicks: number;
    };
    product?: {
      id: string;
      title: string;
    };
  };
}

export function LinkCard({ link }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const shortUrl = `/go/${link.shortCode}`;
  const fullUrl = typeof window !== "undefined"
    ? `${window.location.origin}${shortUrl}`
    : shortUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleOpenLink = () => {
    window.open(shortUrl, "_blank");
  };

  return (
    <Card className="hover:shadow-md transition-all border-2">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono font-bold bg-muted px-2 py-1 rounded">
                  {shortUrl}
                </code>
                <Badge variant="secondary" className="text-xs">
                  {link._count?.clicks || 0} clicks
                </Badge>
              </div>

              {link.product && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Package className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{link.product.title}</span>
                </div>
              )}

              <p className="text-xs text-muted-foreground truncate">
                → {link.targetUrl}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={copied ? "bg-green-50 border-green-500" : ""}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenLink}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
