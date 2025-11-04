import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/utils/format-number";

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
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "outline";
  getTierBadgeVariant: (tier: string) => "default" | "secondary" | "outline" | "destructive";
}

export function SubscriptionInfoCard({ 
  subscription, 
  getStatusBadgeVariant, 
  getTierBadgeVariant 
}: SubscriptionInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Code</div>
            <div className="text-sm font-mono">{subscription.code}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Tier</div>
            <Badge variant={getTierBadgeVariant(subscription.tier)}>
              {subscription.tier}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <Badge variant={getStatusBadgeVariant(subscription.status)}>
              {subscription.status}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Version</div>
            <div className="text-sm">{subscription.version}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Amount</div>
            <div className="text-sm">
              {formatNumber(subscription.amount)} {subscription.currency}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Created</div>
            <div className="text-sm">
              {new Date(subscription.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Updated</div>
            <div className="text-sm">
              {subscription.updatedAt 
                ? new Date(subscription.updatedAt).toLocaleDateString()
                : "Never"
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}