"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MarketplaceBadgeProps {
  marketplace: "LAZADA" | "SHOPEE";
  variant?: "default" | "compact";
  className?: string;
}

const LazadaIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
    <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
    <path d="M10 14h4" strokeWidth="2.5" />
  </svg>
);

const ShopeeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
    <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" />
  </svg>
);

export function MarketplaceBadge({
  marketplace,
  variant = "compact",
  className,
}: MarketplaceBadgeProps) {
  const isLazada = marketplace === "LAZADA";

  const badgeStyles = isLazada
    ? "bg-[#1E71FF] text-white border-[#1E71FF] dark:bg-[#1E71FF] dark:border-[#5AAEDC]"
    : "bg-[#EE4D2D] text-white border-[#EE4D2D] dark:bg-[#EE4D2D] dark:border-[#83340D]";

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-bold text-sm border-2 shadow-sm",
        badgeStyles,
        className
      )}
      aria-label={`${marketplace} marketplace`}
    >
      {variant === "compact" ? (
        <span className="text-base font-extrabold">{isLazada ? "L" : "S"}</span>
      ) : (
        <div className="flex items-center gap-1.5">
          {isLazada ? (
            <LazadaIcon className="w-4 h-4" />
          ) : (
            <ShopeeIcon className="w-4 h-4" />
          )}
          <span>{marketplace}</span>
        </div>
      )}
    </Badge>
  );
}
