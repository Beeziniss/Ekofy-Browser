"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/utils/format-number";
import { activeInactiveStatusBadge } from "@/modules/shared/ui/components/status/status-badges";

interface SubscriptionInfoCardProps {
  subscription: {
    id: string;
    name: string;
    description?: string | null;
    code: string;
    tier: string;
    status: string;
    version: number;
    amount: number;
    currency: string;
    createdAt: string;
    updatedAt?: string;
  };
  getTierBadgeVariant: (tier: string) => "default" | "secondary" | "outline" | "destructive";
}

export function SubscriptionInfoCard({
  subscription,
  getTierBadgeVariant,
}: SubscriptionInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div className="text-muted-foreground text-sm font-medium">Code</div>
            <div className="font-mono text-sm">{subscription.code}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm font-medium">Tier</div>
            <Badge variant={getTierBadgeVariant(subscription.tier)}>{subscription.tier}</Badge>
          </div>
          <div>
            <div className="text-muted-foreground text-sm font-medium">Status</div>
            {activeInactiveStatusBadge(subscription.status)}
          </div>
          <div>
            <div className="text-muted-foreground text-sm font-medium">Version</div>
            <div className="text-sm">{subscription.version}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm font-medium">Amount</div>
            <div className="text-sm">
              {formatNumber(subscription.amount)} {subscription.currency}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm font-medium">Created</div>
            <div className="text-sm">{new Date(subscription.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-sm font-medium">Updated</div>
            <div className="text-sm">
              {subscription.updatedAt ? new Date(subscription.updatedAt).toLocaleDateString() : "Never"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
