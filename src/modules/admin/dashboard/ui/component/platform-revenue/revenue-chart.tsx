"use client";

import { PlatformRevenueQuery } from "@/gql/graphql";
import { formatCurrencyVND } from "@/utils/format-currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Wallet, 
} from "lucide-react";

type PlatformRevenue = NonNullable<NonNullable<PlatformRevenueQuery["platformRevenues"]>["items"]>[number];

interface RevenueChartProps {
  data: PlatformRevenue;
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Calculate percentages
  const subscriptionPercentage = data.grossRevenue 
    ? (data.subscriptionRevenue / data.grossRevenue) * 100 
    : 0;
  const servicePercentage = data.grossRevenue 
    ? (data.serviceRevenue / data.grossRevenue) * 100 
    : 0;
  const profitMargin = data.grossRevenue 
    ? (data.netProfit / data.grossRevenue) * 100 
    : 0;

  return (
    <div className="space-y-6">
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {subscriptionPercentage.toFixed(1)}% of total
                </span>
              </div>
              <Progress value={subscriptionPercentage} className="h-2 bg-purple-100" />
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {servicePercentage.toFixed(1)}% of total
                </span>
              </div>
              <Progress value={servicePercentage} className="h-2 bg-blue-100" />
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
                <span className="font-semibold text-red-600 dark:text-red-400">
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

            {/* Net Profit - Final Result */}
            <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 p-4 dark:from-emerald-950/20 dark:to-green-950/20 border-2 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyVND(data.netProfit)} {data.currency}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Profit Margin: {profitMargin.toFixed(1)}%
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
