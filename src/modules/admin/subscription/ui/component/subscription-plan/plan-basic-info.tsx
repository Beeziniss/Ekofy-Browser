import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlanBasicInfoProps {
  plan: {
    stripeProductName: string;
    stripeProductId: string;
    stripeProductType: string;
    stripeProductActive: boolean;
  };
}

export function PlanBasicInfo({ plan }: PlanBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-main-white">Product Name</label>
            <p className="text-sm text-main-grey-dark">{plan.stripeProductName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-main-white">Product ID</label>
            <p className="text-sm text-main-grey-dark font-mono">{plan.stripeProductId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-main-white">Product Type</label>
            <p className="text-sm text-main-grey-dark">{plan.stripeProductType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-main-white">Status</label>
            <Badge variant={plan.stripeProductActive ? "default" : "secondary"} className="ml-1">
              {plan.stripeProductActive ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}