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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

type PlatformRevenue = NonNullable<NonNullable<PlatformRevenueQuery["platformRevenues"]>["items"]>[number];

interface RevenueChartProps {
  data: PlatformRevenue;
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Chart configuration
  const chartConfig = {
    "Subscription Revenue": {
      label: "Subscription Revenue",
      color: "#a855f7",
    },
    "Service Revenue": {
      label: "Service Revenue",
      color: "#3b82f6",
    },
    "Gross Revenue": {
      label: "Gross Revenue",
      color: "#10b981",
    },
    "Royalty Payout": {
      label: "Royalty Payout",
      color: "#f97316",
    },
    "Service Payout": {
      label: "Service Payout",
      color: "#fb923c",
    },
    "Refund Amount": {
      label: "Refund Amount",
      color: "#ef4444",
    },
    "Total Deductions": {
      label: "Total Deductions",
      color: "#9ca3af",
    },
    "Commission Profit": {
      label: "Commission Profit",
      color: "#06b6d4",
    },
    "Net Profit": {
      label: "Net Profit",
      color: "#059669",
    },
  } satisfies ChartConfig;

  // Prepare data for bar chart - gộp tất cả thành 1 nhóm
  const chartData = [
    {
      name: "Subscription Revenue",
      value: data.subscriptionRevenue,
    },
    {
      name: "Service Revenue",
      value: data.serviceRevenue,
    },
    {
      name: "Gross Revenue",
      value: data.grossRevenue,
    },
    {
      name: "Royalty Payout",
      value: data.royaltyPayoutAmount,
    },
    {
      name: "Service Payout",
      value: data.servicePayoutAmount,
    },
    {
      name: "Refund Amount",
      value: data.refundAmount,
    },
    {
      name: "Total Deductions",
      value: data.grossDeductions,
    },
    {
      name: "Commission Profit",
      value: data.commissionProfit,
    },
    {
      name: "Net Profit",
      value: data.netProfit,
    },
  ];

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
        <CardContent className="p-6">
          <ChartContainer 
            config={chartConfig} 
            className="h-[600px] w-full aspect-auto [&_.recharts-wrapper]:!w-full [&_.recharts-surface]:!w-full"
          >
            <BarChart 
              data={chartData}
              margin={{ top: 10, right: 30, left: 30, bottom: 80 }}
              barCategoryGap="15%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                height={80}
                angle={-45}
                textAnchor="end"
                interval={0}
                tick={{ 
                  fontSize: 12, 
                  fontWeight: 700,
                  fill: 'currentColor'
                }}
                style={{ 
                  letterSpacing: '0.05em',
                  textTransform: 'none'
                }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value) => [
                      `${formatCurrencyVND(Number(value))} ${data.currency}`,
                    ]}
                    labelFormatter={(label) => {
                      const entryName = label as string;
                      return chartConfig[entryName as keyof typeof chartConfig]?.label || entryName;
                    }}
                  />
                }
              />
              <ChartLegend 
                content={<ChartLegendContent />} 
                wrapperStyle={{ paddingTop: '10px' }}
              />
              
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                maxBarSize={250}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={chartConfig[entry.name as keyof typeof chartConfig]?.color || "#8884d8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
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
                  {formatCurrencyVND(data.royaltyPayoutAmount)} {data.currency}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3 dark:bg-orange-950/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Service Payouts</span>
                </div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrencyVND(data.servicePayoutAmount)} {data.currency}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Refunds</span>
                </div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrencyVND(data.refundAmount)} {data.currency}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Deductions
                </span>
                <span className="font-bold">
                  {formatCurrencyVND(data.grossDeductions)} {data.currency}
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
