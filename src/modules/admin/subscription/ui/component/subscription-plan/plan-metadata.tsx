import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";

interface PlanMetadataProps {
  metadata?: Array<{
    key: string;
    value: string;
  }>;
}

export function PlanMetadata({ metadata }: PlanMetadataProps) {
  if (!metadata || metadata.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="w-4 h-4 mr-2" />
          Metadata
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {metadata.map((meta, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-main-white">{meta.key}</span>
              </div>
              <p className="text-sm text-main-grey-dark border-2 border-white p-2 rounded">
                {meta.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}