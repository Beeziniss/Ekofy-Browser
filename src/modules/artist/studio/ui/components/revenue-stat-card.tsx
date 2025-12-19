import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface RevenueStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function RevenueStatCard({ title, value, change, icon: Icon, iconColor = "text-cyan-400" }: RevenueStatCardProps) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <Card className="border-slate-700/50 bg-slate-800/30 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <div className={`rounded-full p-2 ${iconColor.replace('text-', 'bg-').replace('400', '500/10')}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{formattedValue}</div>
        {change && (
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="mr-1 h-3 w-3 text-green-400" />
            <span className="text-green-400">{change}</span>
            <span className="ml-1 text-slate-500">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

