import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
  subtitle?: string;
}

export function StatsCard({ title, value, change, changeType, icon: Icon, delay = 0, subtitle }: StatsCardProps) {
  return (
    <div 
      className="stat-card animate-fade-in rounded-lg border bg-card p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {change && changeType && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
          <span className="text-sm text-muted-foreground">
            {changeType === "neutral" ? "" : "vs last month"}
          </span>
        </div>
      )}
    </div>
  );
}
