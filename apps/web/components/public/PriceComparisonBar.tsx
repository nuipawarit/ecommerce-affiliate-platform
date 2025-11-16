"use client";

interface Offer {
  id: string;
  price: number;
}

interface PriceComparisonBarProps {
  offers: Offer[];
}

export function PriceComparisonBar({ offers }: PriceComparisonBarProps) {
  if (offers.length < 2) return null;

  const prices = offers.map((o) => o.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const savings = highest - lowest;
  const savingsPercent = ((savings / highest) * 100).toFixed(0);

  return (
    <div className="space-y-2">
      {/* Visual Price Bar */}
      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
          style={{ width: `${((highest - lowest) / highest) * 100}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Price Range Text */}
      <div className="flex items-center justify-between text-sm">
        <span
          className="font-semibold text-emerald-600 dark:text-emerald-500"
          aria-label={`Lowest price ${lowest} baht`}
        >
          ฿{lowest.toLocaleString()}
        </span>

        {savings > 0 && (
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Save up to ฿{savings.toLocaleString()} ({savingsPercent}%)
          </span>
        )}

        <span
          className="font-medium text-slate-600 dark:text-slate-400"
          aria-label={`Highest price ${highest} baht`}
        >
          ฿{highest.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
