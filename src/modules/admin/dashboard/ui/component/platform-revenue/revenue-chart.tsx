"use client";

import { PlatformRevenueQuery } from "@/gql/graphql";
import { formatCurrencyVND } from "@/utils/format-currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  DollarSign, 
  Wallet,
  BarChart3,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts";

type PlatformRevenue = NonNullable<NonNullable<PlatformRevenueQuery["platformRevenues"]>["items"]>[number];

interface RevenueChartProps {
  data: PlatformRevenue;
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Prepare data for bar chart
  const chartData = [
    {
      name: "Revenue",
      "Subscription Revenue": data.subscriptionRevenue,
      "Service Revenue": data.serviceRevenue,
      "Gross Revenue": data.grossRevenue,
    },
    {
      name: "Deductions",
      "Royalty Payout": data.royaltyPayoutAmount,
      "Service Payout": data.servicePayoutAmount,
      "Refund Amount": data.refundAmount,
      "Total Deductions": data.grossDeductions,
    },
    {
      name: "Profit",
      "Commission Profit": data.commissionProfit,
      "Net Profit": data.netProfit,
    },
  ];

  // Format currency for tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.name}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrencyVND(entry.value || 0)} {data.currency}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Bar Chart - Visual Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue & Profit Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {/* Revenue bars */}
              <Bar dataKey="Subscription Revenue" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Service Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gross Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              
              {/* Deduction bars */}
              <Bar dataKey="Royalty Payout" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Service Payout" fill="#fb923c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Refund Amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Total Deductions" fill="#9ca3af" radius={[4, 4, 0, 0]} />
              
              {/* Profit bars */}
              <Bar dataKey="Commission Profit" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Net Profit" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Breakdown - 2 Column Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Subscription Revenue */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Subscription Revenue
              </CardTitle>
              <div className="rounded-full bg-purple-500/10 p-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{formatCurrencyVND(data.subscriptionRevenue)} {data.currency}</p>
            </div>
          </CardContent>
        </Card>

        {/* Service Revenue */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Service Revenue
              </CardTitle>
              <div className="rounded-full bg-blue-500/10 p-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{formatCurrencyVND(data.serviceRevenue)} {data.currency}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Flow - Main Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Revenue Flow Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">


            {/* Deductions Section */}
            <div className="space-y-3 pl-8 border-l-2 border-dashed border-muted">
              <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3 dark:bg-orange-950/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Royalty Payouts</span>
                </div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  -{formatCurrencyVND(data.royaltyPayoutAmount)} {data.currency}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3 dark:bg-orange-950/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Service Payouts</span>
                </div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  -{formatCurrencyVND(data.servicePayoutAmount)} {data.currency}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Refunds</span>
                </div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  -{formatCurrencyVND(data.refundAmount)} {data.currency}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Deductions
                </span>
                <span className="font-bold">
                  -{formatCurrencyVND(data.grossDeductions)} {data.currency}
                </span>
              </div>
            </div>

            {/* Commission Profit */}
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commission Profit</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrencyVND(data.commissionProfit)} {data.currency}
                  </p>
                </div>
              </div>
            </div>

            {/* Gross Revenue */}
            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:from-green-950/20 dark:to-emerald-950/20">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gross Revenue</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrencyVND(data.grossRevenue)} {data.currency}
                  </p>
                </div>
              </div>
            </div>

            {/* Net Profit - Final Result */}
            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 p-4 dark:from-emerald-950/20 dark:to-green-950/20 border-2 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyVND(data.netProfit)} {data.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
