import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "bg-green-100 text-green-600 dark:bg-green-600 dark:text-green-100",
  trend,
}: StatCardProps) {
  return (
    <div className={` p-6 border rounded-xl bg-background `}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="mb-1 font-medium text-muted-foreground text-sm">
            {title}
          </p>
          <h3 className="font-bold text-foreground text-2xl">{value}</h3>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(`p-3 rounded-full`, iconColor)}>
            <Icon className={cn("w-5 h-5")} />
          </div>
        )}
      </div>
    </div>
  );
}
