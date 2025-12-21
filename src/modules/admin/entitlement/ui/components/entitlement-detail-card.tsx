"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Entitlement } from "@/types/entitlement";
import { formatDate } from "@/utils/format-date";
import { Skeleton } from "@/components/ui/skeleton";

interface EntitlementDetailCardProps {
  entitlement: Entitlement | null | undefined;
  isLoading: boolean;
}

export function EntitlementDetailCard({ entitlement, isLoading }: EntitlementDetailCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!entitlement) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Entitlement not found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              The entitlement you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{entitlement.name}</CardTitle>
            </div>
            <Badge
              variant={entitlement.isActive ? "default" : "secondary"}
              className="flex items-center gap-2"
            >
              {entitlement.isActive ? (
                <>
                  Active
                </>
              ) : (
                <>
                  Inactive
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Code
              </div>
              <code className="text-base bg-muted px-3 py-1.5 rounded block">
                {entitlement.code}
              </code>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Value Type
              </div>
              <Badge variant="outline" className="text-base">
                {entitlement.valueType}
              </Badge>
            </div>
          </div>

          {entitlement.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Description
              </div>
              <p className="rounded-lg bg-muted p-4 text-sm leading-relaxed">
                {entitlement.description}
              </p>
            </div>
          )}

          {entitlement.defaultValues && entitlement.defaultValues.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Default Values by Role
              </div>
              <div className="flex flex-wrap gap-2">
                {entitlement.defaultValues.map((dv, index) => (
                  <Badge key={index} variant="outline">
                    {dv.role}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {entitlement.subscriptionOverrides && entitlement.subscriptionOverrides.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Subscription Overrides
              </div>
              <div className="flex flex-wrap gap-2">
                {entitlement.subscriptionOverrides.map((so, index) => (
                  <Badge key={index} variant="secondary">
                    {so.subscriptionCode}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {entitlement.expiredAt && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Expires At
              </div>
              <div className="text-sm">{formatDate(entitlement.expiredAt)}</div>
            </div>
          )}

          <div className="grid gap-4 pt-4 border-t md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Created Date
              </div>
              <div className="text-sm">{formatDate(entitlement.createdAt)}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                Last Updated
              </div>
              <div className="text-sm">{entitlement.updatedAt ? formatDate(entitlement.updatedAt) : "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

