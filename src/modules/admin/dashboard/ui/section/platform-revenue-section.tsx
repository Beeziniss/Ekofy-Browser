"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { platformRevenueOptions } from "@/gql/options/dashboard-options";
import { RevenueChart } from "../component/platform-revenue/revenue-chart";
import { SortEnumType } from "@/gql/graphql";

export function PlatformRevenueSection() {
  const { data, isLoading } = useQuery(
    platformRevenueOptions(0, 1, undefined, [{ createdAt: SortEnumType.Desc }])
  );

  const latestRevenue = data?.items?.[0];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[600px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!latestRevenue) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <RevenueChart data={latestRevenue} />
    </div>
  );
}
