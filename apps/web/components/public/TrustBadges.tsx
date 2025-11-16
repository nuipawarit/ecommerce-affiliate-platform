import { Shield, TrendingDown, Clock, Verified } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "100% secure affiliate links",
    },
    {
      icon: TrendingDown,
      title: "Best Prices",
      description: "Real-time price tracking",
    },
    {
      icon: Clock,
      title: "Updated Daily",
      description: "Fresh deals every day",
    },
    {
      icon: Verified,
      title: "Verified Stores",
      description: "Official Lazada & Shopee",
    },
  ];

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <badge.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                {badge.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
