"use client";

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
          <Tag className="mr-2 h-4 w-4" />
          Metadata
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {metadata.map((meta, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-main-white text-sm font-medium">{meta.key.charAt(0).toUpperCase() + meta.key.slice(1)}</span>
              </div>
              <p className="text-main-grey-dark rounded border-2 border-white p-2 text-sm">{meta.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
