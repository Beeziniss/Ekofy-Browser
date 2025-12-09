"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/utils/format-number";

interface PlanPricingInfoProps {
  prices: Array<{
    stripePriceUnitAmount: number;
    stripePriceCurrency: string;
    intervalCount: number;
    interval: string;
    stripePriceLookupKey: string;
    stripePriceActive: boolean;
  }>;
}

export function PlanPricingInfo({ prices }: PlanPricingInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prices.map((price, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="text-main-white text-sm font-medium">Price</label>
                  <p className="text-main-grey-dark text-lg font-semibold">
                    {formatNumber(price.stripePriceUnitAmount)} {price.stripePriceCurrency.toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-main-white text-sm font-medium">Interval</label>
                  <p className="text-main-grey-dark text-sm">
                    Every {price.intervalCount} {price.interval.toLowerCase()}(s)
                  </p>
                </div>
                <div>
                  <label className="text-main-white text-sm font-medium">Lookup Key</label>
                  <p className="text-main-grey-dark font-mono text-sm break-words">{price.stripePriceLookupKey}</p>
                </div>
                <div>
                  <label className="text-main-white text-sm font-medium">Status</label>
                  <Badge variant={price.stripePriceActive ? "default" : "secondary"} className="ml-1">
                    {price.stripePriceActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
