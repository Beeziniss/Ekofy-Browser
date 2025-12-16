"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

export function SubscriptionInfoCard({
  subscription,
}: SubscriptionInfoCardProps) {
  
    function getTierColor(tier: string) {
    switch (tier.toLowerCase()) {
      case "free":
        return "bg-secondary text-muted-foreground border-border";
      case "pro":
        return "text-white border-transparent shadow-md";
      case "premium":
        return "text-white border-transparent shadow-lg";
      default:
        return "bg-gray-800 border-white text-white";
    }
  }

  function getTierStyle(tier: string): React.CSSProperties {
    switch (tier.toLowerCase()) {
      case "pro":
        return {
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
        };
      case "premium":
        return {
          background: "linear-gradient(135deg, #f59e0b, #ec4899)",
          boxShadow: "0 2px 12px rgba(245, 158, 11, 0.5)",
        };
      default:
        return {};
    }
  }

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
            <span
              className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${getTierColor(subscription.tier)}`}
              style={getTierStyle(subscription.tier)}
            >
              {subscription.tier}
            </span>
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
