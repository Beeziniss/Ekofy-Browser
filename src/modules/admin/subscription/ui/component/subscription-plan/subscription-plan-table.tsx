"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatNumber } from "@/utils/format-number";
import type { SubscriptionPlan } from "@/types";

interface SubscriptionPlanTableProps {
  subscriptionPlans: SubscriptionPlan[];
  onView?: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
  showSubscriptionInfo?: boolean;
  subscriptionId?: string; // For generating detail links
}

export function SubscriptionPlanTable({
  subscriptionPlans,
  isLoading = false,
  showSubscriptionInfo = true,
  subscriptionId,
}: SubscriptionPlanTableProps) {
  const getStatusBadgeVariant = (active: boolean) => {
    return active ? "default" : "secondary";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex h-32 items-center justify-center">
            <div className="text-muted-foreground">Loading subscription plans...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (subscriptionPlans.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex h-32 items-center justify-center">
            <div className="text-muted-foreground">No subscription plans found</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              {showSubscriptionInfo && <TableHead>Subscription</TableHead>}
              <TableHead>Stripe Product</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptionPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">
                      {subscriptionId ? (
                        <Link
                          href={`/admin/subscription/${subscriptionId}/subscription-plan/${plan.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {plan.stripeProductName}
                        </Link>
                      ) : (
                        plan.stripeProductName
                      )}
                    </div>
                    <div className="text-muted-foreground text-sm">Type: {plan.stripeProductType}</div>
                  </div>
                </TableCell>
                {showSubscriptionInfo && (
                  <TableCell>
                    {plan.subscription && plan.subscription.length > 0 && (
                      <div>
                        <div className="font-medium">{plan.subscription[0].name}</div>
                        <div className="text-muted-foreground text-sm">{plan.subscription[0].tier}</div>
                      </div>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted rounded px-2 py-1 text-xs">{plan.stripeProductId}</code>
                    <ExternalLink className="text-muted-foreground h-3 w-3" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {plan.subscriptionPlanPrices.map((price, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">
                          {formatNumber(price.stripePriceUnitAmount)} {price.stripePriceCurrency.toUpperCase()}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          / {price.intervalCount} {price.interval.toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(plan.stripeProductActive)}>
                    {plan.stripeProductActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {subscriptionId && (
                        <Link href={`/admin/subscription/${subscriptionId}/subscription-plan/${plan.id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
