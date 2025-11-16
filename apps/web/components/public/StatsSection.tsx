"use client";

import { Package, TrendingDown, Zap, Users } from "lucide-react";
import CountUp from "react-countup";

interface StatsSectionProps {
  totalProducts?: number;
  averageSavings?: number;
  activeCampaigns?: number;
  totalClicks?: number;
}

export function StatsSection({
  totalProducts = 1250,
  averageSavings = 15,
  activeCampaigns = 12,
  totalClicks = 50000,
}: StatsSectionProps) {
  const stats = [
    {
      icon: Package,
      value: totalProducts,
      suffix: "+",
      label: "Products Tracked",
      color: "bg-blue-600",
    },
    {
      icon: TrendingDown,
      value: averageSavings,
      suffix: "%",
      label: "Average Savings",
      color: "bg-green-600",
    },
    {
      icon: Zap,
      value: activeCampaigns,
      suffix: "+",
      label: "Active Campaigns",
      color: "bg-indigo-600",
    },
    {
      icon: Users,
      value: totalClicks,
      suffix: "+",
      label: "Happy Shoppers",
      color: "bg-orange-500",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Trusted by Thousands of Shoppers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Compare prices, save money, and shop smarter with our platform
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                <CountUp end={stat.value} duration={2.5} separator="," />
                <span className="text-indigo-600 dark:text-indigo-400">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
