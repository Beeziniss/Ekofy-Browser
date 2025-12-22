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
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">
              {request?.[0]?.title || "Direct Collaboration Request"}
            </CardTitle>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              variant="outline"
              className="bg-muted/50 text-muted-foreground border-muted text-xs font-medium"
            >
              {request?.[0]?.type}
            </Badge>
            <Badge
              className={`${STATUS_CONFIG[request?.[0]?.status as RequestStatus]?.className} border font-semibold transition-colors`}
            >
              {STATUS_CONFIG[request?.[0]?.status as RequestStatus]?.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Requestor Information */}
        <div>
          <h3 className="text-main-white mb-3 text-sm font-semibold">Requestor</h3>
          <div className="bg-main-dark-bg space-y-2 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-main-white text-sm">Name:</span>
              <span className="text-sm font-medium">{request?.[0]?.requestor?.[0]?.displayName || "Unknown"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-main-white text-sm">Email:</span>
              <span className="text-sm font-medium">{request?.[0]?.requestor?.[0]?.email || "No email"}</span>
            </div>
          </div>
        </div>

        {/* Package Information */}
        {request?.[0]?.artistPackage && request?.[0]?.artistPackage[0] && (
          <div>
            <h3 className="text-main-white mb-3 text-sm font-semibold">Package Details</h3>
            <div className="bg-main-dark-bg space-y-2 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-main-white text-sm">Package Name:</span>
                <span className="text-sm font-medium">{request?.[0]?.artistPackage[0].packageName}</span>
              </div>
              {request?.[0]?.artistPackage[0].amount && (
                <div className="flex items-center justify-between">
                  <span className="text-main-white text-sm">Price:</span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat("vi-VN").format(request?.[0]?.artistPackage[0].amount)}{" "}
                    {request?.[0]?.artistPackage[0].currency}
                  </span>
                </div>
              )}
              {request?.[0]?.artistPackage[0].maxRevision !== undefined &&
                request?.[0]?.artistPackage[0].maxRevision !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-main-white text-sm">Max Revisions:</span>
                    <span className="text-sm font-medium">{request?.[0]?.artistPackage[0].maxRevision}</span>
                  </div>
                )}
              {request?.[0]?.artistPackage[0].estimateDeliveryDays && (
                <div className="flex items-center justify-between">
                  <span className="text-main-white text-sm">Estimated Delivery Time By Artist:</span>
                  <span className="text-sm font-medium">
                    {request?.[0]?.artistPackage[0].estimateDeliveryDays} days
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Budget & Timeline */}
        <div>
          <h3 className="text-main-white mb-3 text-sm font-semibold">Budget & Timeline</h3>
          <div className="bg-main-dark-bg space-y-2 rounded-lg p-4">
            {request?.[0]?.budget && (
              <div className="flex items-center justify-between">
                <span className="text-main-white text-sm">Requested Budget:</span>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("vi-VN").format(request?.[0]?.budget?.min)} {request?.[0]?.currency}
                  {request?.[0]?.budget?.min !== request?.[0]?.budget?.max && (
                    <>
                      {" - "}
                      {new Intl.NumberFormat("vi-VN").format(request?.[0]?.budget?.max)} {request?.[0]?.currency}
                    </>
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-main-white text-sm">Created:</span>
              <span className="text-sm font-medium">
                {format(new Date(request?.[0]?.requestCreatedTime), "dd/MM/yyyy hh:mm a")}
              </span>
            </div>
            {request?.[0]?.duration !== 0 && (
              <div className="flex items-center justify-between">
                <span className="text-main-white text-sm">Duration:</span>
                <span className="text-sm font-medium">{request?.[0]?.duration} days</span>
              </div>
            )}
          </div>
        </div>
        {request?.[0]?.requirements && (
          <>
            <Separator />
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-medium">Requirements</h3>
            </div>
            <div className="prose prose-sm mb-4 max-w-none">
              <div 
              className="text-muted-foreground text-xl whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: request?.[0]?.requirements || "No requirements provided" 
                }}
              />
            </div>
          </>
        )}
        {request?.[0].summary && (
          <>
            <Separator />
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-medium">Summary</h3>
            </div>
            <div className="prose prose-sm mb-4 max-w-none">
              <p className="text-muted-foreground text-xl whitespace-pre-wrap">
                {request?.[0]?.summary || "No summary provided"}
              </p>
            </div>
          </>
        )}
        {request?.[0].detailDescription && (
          <>
            <Separator />
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-medium">Description</h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <div
               className="text-muted-foreground text-xl whitespace-pre-wrap"
               dangerouslySetInnerHTML={{ 
                  __html: request?.[0]?.detailDescription || "No description provided" 
                }}
               />
            </div>
          </>
        )}
        {/* Notes */}
        {request?.[0]?.notes && (
          <>
            <Separator />
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-medium">Notes</h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground text-xl whitespace-pre-wrap">{request?.[0]?.notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
