import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlanSubscriptionInfoProps {
  subscription?: Array<{
    id: string;
    name: string;
    code: string;
    tier: string;
    status: string;
    description?: string | null;
  }>;
}

export function PlanSubscriptionInfo({ subscription }: PlanSubscriptionInfoProps) {
  if (!subscription || subscription.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscription.map((sub) => (
            <div key={sub.id} className="rounded-lg border p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-main-white text-sm font-medium">Name</label>
                  <p className="text-main-grey-dark text-sm">{sub.name}</p>
                </div>
                <div>
                  <label className="text-main-white text-sm font-medium">Code</label>
                  <p className="text-main-grey-dark font-mono text-sm">{sub.code}</p>
                </div>
                <div>
                  <label className="text-main-white text-sm font-medium">Tier</label>
                  <Badge variant="outline" className="ml-1">
                    {sub.tier}
                  </Badge>
                </div>
                <div>
                  <label className="text-main-white text-sm font-medium">Status</label>
                  <Badge variant={sub.status === "ACTIVE" ? "default" : "secondary"} className="ml-1">
                    {sub.status}
                  </Badge>
                </div>
              </div>
              {sub.description && (
                <div className="mt-4">
                  <label className="text-main-white text-sm font-medium">Description</label>
                  <p className="text-main-grey-dark text-sm">{sub.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
