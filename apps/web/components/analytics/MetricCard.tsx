import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/lib/analytics-utils";

type MetricCardVariant = "default" | "hero" | "compact";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  format?: "number" | "text";
  variant?: MetricCardVariant;
  accentColor?: "green" | "blue" | "orange" | "purple";
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  format = "number",
  variant = "default",
  accentColor,
}: MetricCardProps) {
  const displayValue =
    format === "number" && typeof value === "number"
      ? formatNumber(value)
      : value;

  const accentClasses = {
    green: {
      border: "border-green-200",
      bg: "bg-green-50/50",
      text: "text-green-600",
      icon: "text-green-600",
    },
    blue: {
      border: "border-blue-200",
      bg: "bg-blue-50/50",
      text: "text-blue-600",
      icon: "text-blue-600",
    },
    orange: {
      border: "border-orange-200",
      bg: "bg-orange-50/50",
      text: "text-orange-600",
      icon: "text-orange-600",
    },
    purple: {
      border: "border-purple-200",
      bg: "bg-purple-50/50",
      text: "text-purple-600",
      icon: "text-purple-600",
    },
  };

  const accent = accentColor ? accentClasses[accentColor] : null;

  if (variant === "hero") {
    return (
      <Card
        className={`border-2 hover:shadow-md transition-shadow ${
          accent ? `${accent.border} ${accent.bg}` : ""
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <Icon className={`w-5 h-5 ${accent ? accent.icon : "text-muted-foreground"}`} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`text-4xl font-bold ${accent ? accent.text : ""}`}>
            {displayValue}
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <p
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground ml-1">
                from last period
              </p>
            </div>
          )}
          {description && !trend && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <div className="bg-muted/50 p-3 rounded-lg">
        <div className="flex items-center gap-1.5 mb-1">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
        </div>
        <p className="text-sm font-semibold">{displayValue}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p
            className={`text-xs mt-1 ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value.toFixed(1)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
}
