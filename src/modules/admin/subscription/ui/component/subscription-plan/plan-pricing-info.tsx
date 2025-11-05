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
        <CardTitle>Pricing Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prices.map((price, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-main-white">Price</label>
                  <p className="text-lg font-semibold text-main-grey-dark">
                    {formatNumber(price.stripePriceUnitAmount / 100)} {price.stripePriceCurrency}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-main-white">Interval</label>
                  <p className="text-sm text-main-grey-dark">
                    Every {price.intervalCount} {price.interval.toLowerCase()}(s)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-main-white">Lookup Key</label>
                  <p className="text-sm text-main-grey-dark font-mono break-words">{price.stripePriceLookupKey}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-main-white">Status</label>
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