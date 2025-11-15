"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { RequestStatus, RequestPendingDetailByIdQuery } from "@/gql/graphql";

type PendingRequestDetail = NonNullable<RequestPendingDetailByIdQuery["requests"]>["items"];

const STATUS_VARIANTS: Record<RequestStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [RequestStatus.Pending]: "outline",
  [RequestStatus.Confirmed]: "default",
  [RequestStatus.Rejected]: "destructive",
  [RequestStatus.Canceled]: "secondary",
  [RequestStatus.Blocked]: "destructive",
  [RequestStatus.Closed]: "secondary",
  [RequestStatus.Deleted]: "destructive",
  [RequestStatus.Open]: "outline",
};

const STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: "PENDING",
  [RequestStatus.Confirmed]: "CONFIRMED",
  [RequestStatus.Rejected]: "REJECTED",
  [RequestStatus.Canceled]: "CANCELED",
  [RequestStatus.Blocked]: "BLOCKED",
  [RequestStatus.Closed]: "CLOSED",
  [RequestStatus.Deleted]: "DELETED",
  [RequestStatus.Open]: "OPEN",
};

interface PendingRequestInfoCardProps {
  request: PendingRequestDetail;
}

export function PendingRequestInfoCard({ request }: PendingRequestInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{request?.[0]?.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{request?.[0]?.type}</p>
          </div>
          <Badge variant={STATUS_VARIANTS[request?.[0]?.status as RequestStatus]}>
            {STATUS_LABELS[request?.[0]?.status as RequestStatus]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Requestor Information */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-main-white">Requestor</h3>
          <div className="bg-main-dark-bg rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-main-white">Name:</span>
              <span className="text-sm font-medium">{request?.[0]?.requestor?.[0]?.displayName || 'Unknown'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-main-white">Email:</span>
              <span className="text-sm font-medium">{request?.[0]?.requestor?.[0]?.email || 'No email'}</span>
            </div>
          </div>
        </div>

        {/* Package Information */}
        {request?.[0]?.artistPackage && request?.[0]?.artistPackage[0] && (
          <div>
            <h3 className="text-sm font-semibold mb-3 text-main-white">Package Details</h3>
            <div className="bg-main-dark-bg rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-main-white">Package Name:</span>
                <span className="text-sm font-medium">{request?.[0]?.artistPackage[0].packageName}</span>
              </div>
              {request?.[0]?.artistPackage[0].amount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-main-white">Price:</span>
                    <span className="text-sm font-medium">
                    {new Intl.NumberFormat('vi-VN').format(request?.[0]?.artistPackage[0].amount)} {request?.[0]?.artistPackage[0].currency}
                    </span>
                </div>
              )}
              {request?.[0]?.artistPackage[0].maxRevision !== undefined && request?.[0]?.artistPackage[0].maxRevision !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-main-white">Max Revisions:</span>
                  <span className="text-sm font-medium">{request?.[0]?.artistPackage[0].maxRevision}</span>
                </div>
              )}
              {request?.[0]?.artistPackage[0].estimateDeliveryDays && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-main-white">Delivery Time:</span>
                  <span className="text-sm font-medium">{request?.[0]?.artistPackage[0].estimateDeliveryDays} days</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Budget & Timeline */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-main-white">Budget & Timeline</h3>
          <div className="bg-main-dark-bg rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-main-white">Requested Budget:</span>
                <span className="text-sm font-medium">
                {new Intl.NumberFormat('vi-VN').format(request?.[0]?.budget?.min)} {request?.[0]?.currency}
                {request?.[0]?.budget?.min !== request?.[0]?.budget?.max && (
                  <>
                  {" - "}
                  {new Intl.NumberFormat('vi-VN').format(request?.[0]?.budget?.max)} {request?.[0]?.currency}
                  </>
                )}
                </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-main-white">Created:</span>
              <span className="text-sm font-medium">
                {format(new Date(request?.[0]?.requestCreatedTime), "dd/MM/yyyy HH:mm")}
              </span>
            </div>
            {request?.[0]?.deadline && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-main-white">Deadline:</span>
                <span className="text-sm font-medium">
                  {format(new Date(request?.[0]?.deadline), "dd/MM/yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>
            <Separator />
          {/* Summary */}
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-medium">Summary</h3>
          </div>
          <div className="prose prose-sm max-w-none mb-4">
            <p className="text-xl text-muted-foreground whitespace-pre-wrap">
              {request?.[0]?.summary || "No summary provided"}
            </p>
          </div>
            <Separator />
          {/* Description */}
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-medium">Description</h3>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-xl text-muted-foreground whitespace-pre-wrap">
              {request?.[0]?.detailDescription || "No description provided"}
            </p>
          </div>

        {/* Notes */}
        {request?.[0]?.notes && (
          <>
            <Separator />
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-medium">Notes</h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-xl text-muted-foreground whitespace-pre-wrap">
                {request?.[0]?.notes}
              </p>
            </div>
          </>
        )}

        {/* Timeline */}
        {request?.[0]?.deadline && (
          <>
            <Separator />
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(request?.[0]?.deadline), "dd/MM/yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created On</p> 
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(request?.[0]?.requestCreatedTime), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}