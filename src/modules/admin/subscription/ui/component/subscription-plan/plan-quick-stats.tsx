import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanQuickStatsProps {
  totalPrices: number;
  activePrices: number;
  totalImages: number;
  totalMetadata: number;
}

export function PlanQuickStats({ 
  totalPrices, 
  activePrices, 
  totalImages, 
  totalMetadata 
}: PlanQuickStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-main-white">Total Prices</span>
          <span className="text-sm font-medium">{totalPrices}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-main-white">Active Prices</span>
          <span className="text-sm font-medium">{activePrices}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-main-white">Images</span>
          <span className="text-sm font-medium">{totalImages}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-main-white">Metadata Fields</span>
          <span className="text-sm font-medium">{totalMetadata}</span>
        </div>
      </CardContent>
    </Card>
  );
}