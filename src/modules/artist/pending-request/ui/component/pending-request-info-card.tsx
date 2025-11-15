"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { RequestStatus, RequestPendingDetailByIdQuery } from "@/gql/graphql";

type PendingRequestDetail = NonNullable<RequestPendingDetailByIdQuery["requests"]>["items"];

const STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  [RequestStatus.Pending]: {
    label: "PENDING",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
  },
  [RequestStatus.Confirmed]: {
    label: "CONFIRMED",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20",
  },
  [RequestStatus.Rejected]: {
    label: "REJECTED",
    className: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
  },
  [RequestStatus.Canceled]: {
    label: "CANCELED",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20",
  },
  [RequestStatus.Blocked]: {
    label: "BLOCKED",
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20",
  },
  [RequestStatus.Closed]: {
    label: "CLOSED",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  },
  [RequestStatus.Deleted]: {
    label: "DELETED",
    className: "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20",
  },
  [RequestStatus.Open]: {
    label: "OPEN",
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
  },
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
          <Badge 
            className={`${STATUS_CONFIG[request?.[0]?.status as RequestStatus]?.className} border font-semibold transition-colors`}
          >
            {STATUS_CONFIG[request?.[0]?.status as RequestStatus]?.label}
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
      </CardContent>
    </Card>
  );
}