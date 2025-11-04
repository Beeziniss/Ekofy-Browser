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
            <div key={sub.id} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-main-white">Name</label>
                  <p className="text-sm text-main-grey-dark">{sub.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-main-white">Code</label>
                  <p className="text-sm text-main-grey-dark font-mono">{sub.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-main-white">Tier</label>
                  <Badge variant="outline" className="ml-1">{sub.tier}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-main-white">Status</label>
                  <Badge variant={sub.status === "ACTIVE" ? "default" : "secondary"} className="ml-1">
                    {sub.status}
                  </Badge>
                </div>
              </div>
              {sub.description && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-main-white">Description</label>
                  <p className="text-sm text-main-grey-dark">{sub.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}