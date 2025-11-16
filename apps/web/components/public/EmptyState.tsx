import { Package, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in-up">
      <div className="mb-8">
        <Package className="w-24 h-24 text-slate-400" strokeWidth={1.5} />
      </div>

      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
        No Active Campaigns Yet
      </h2>

      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-8">
        There are currently no active campaigns available. Check back soon for amazing deals and price comparisons!
      </p>

      <div className="flex gap-4">
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
          <Link href="/admin/campaigns">
            <Sparkles className="w-4 h-4 mr-2" />
            Go to Admin Panel
          </Link>
        </Button>
      </div>
    </div>
  );
}
