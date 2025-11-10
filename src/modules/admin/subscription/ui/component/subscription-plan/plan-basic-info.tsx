"use client";

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-main-white text-sm font-medium">Product Name</label>
            <p className="text-main-grey-dark text-sm">{plan.stripeProductName}</p>
          </div>
          <div>
            <label className="text-main-white text-sm font-medium">Product ID</label>
            <p className="text-main-grey-dark font-mono text-sm">{plan.stripeProductId}</p>
          </div>
          <div>
            <label className="text-main-white text-sm font-medium">Product Type</label>
            <p className="text-main-grey-dark text-sm">{plan.stripeProductType}</p>
          </div>
          <div>
            <label className="text-main-white text-sm font-medium">Status</label>
            <Badge variant={plan.stripeProductActive ? "default" : "secondary"} className="ml-1">
              {plan.stripeProductActive ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
