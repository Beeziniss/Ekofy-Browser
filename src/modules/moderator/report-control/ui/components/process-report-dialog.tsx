"use client";

import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { useProcessReport } from "@/gql/client-mutation-options/report-mutation-options";
import { toast } from "sonner";
import { ReportAction, ReportStatus, RestrictionAction, ReportRelatedContentType } from "@/gql/graphql";

interface ProcessReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  relatedContentType?: ReportRelatedContentType | null;
  onSuccess?: () => void;
}

const processReportFormSchema = z
  .object({
    actionTaken: z.nativeEnum(ReportAction).refine((val) => val !== undefined, {
      message: "Please select an action",
    }),
    status: z.nativeEnum(ReportStatus).refine((val) => val !== undefined, {
      message: "Please select a status",
    }),
    note: z.string().optional(),
    suspensionDays: z.number().min(1).max(365).optional(),
    restrictionActions: z.array(z.nativeEnum(RestrictionAction)).optional(),
    restrictionNotes: z.record(z.string(), z.string()).optional(),
  })
  .refine(
    (data) => {
      // Validate status based on actionTaken
      if (data.actionTaken === ReportAction.NoAction) {
        return [ReportStatus.Rejected].includes(data.status);
      } else {
        return data.status === ReportStatus.Approved;
      }
    },
    {
      message: "Status does not match the selected action",
      path: ["status"],
    },
  );

type ProcessReportFormValues = z.infer<typeof processReportFormSchema>;

// Action labels
const ACTION_LABELS: Record<ReportAction, string> = {
  [ReportAction.NoAction]: "No Action",
  [ReportAction.Warning]: "Warning",
  [ReportAction.Suspended]: "Suspended",
  [ReportAction.EntitlementRestriction]: "Entitlement Restriction",
  [ReportAction.ContentRemoval]: "Content Removal",
  [ReportAction.PermanentBan]: "Permanent Ban",
};

// Status labels
const STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.Pending]: "Pending",
  [ReportStatus.UnderReview]: "Under Review",
  [ReportStatus.Approved]: "Approved",
  [ReportStatus.Rejected]: "Rejected",
  [ReportStatus.Restored]: "Restored",
  [ReportStatus.Escalated]: "Escalated",
};

// Restriction action labels
const RESTRICTION_ACTION_LABELS: Record<RestrictionAction, string> = {
  [RestrictionAction.None]: "None",
  [RestrictionAction.Comment]: "Comment",
  [RestrictionAction.CreatePublicRequest]: "Create Public Request",
  [RestrictionAction.SendRequest]: "Create Private Request",
  [RestrictionAction.UploadTrack]: "Upload Track",
  [RestrictionAction.Report]: "Report",
};

export function ProcessReportDialog({
  open,
  onOpenChange,
  reportId,
  relatedContentType,
  onSuccess,
}: ProcessReportDialogProps) {
  const [selectedRestrictionActions, setSelectedRestrictionActions] = useState<RestrictionAction[]>([]);
  const processReport = useProcessReport();

  // Get available restriction actions based on relatedContentType
  const getAvailableRestrictionActions = (): RestrictionAction[] => {
    if (!relatedContentType) {
      // For user reports (no related content), all restrictions are available
      return [
        RestrictionAction.Comment,
        RestrictionAction.CreatePublicRequest,
        RestrictionAction.SendRequest,
        RestrictionAction.UploadTrack,
        RestrictionAction.Report,
      ];
    }

    // For content-related reports, restrict based on content type
    switch (relatedContentType) {
      case ReportRelatedContentType.Comment:
        return [RestrictionAction.Comment];
      case ReportRelatedContentType.Request:
        return [RestrictionAction.CreatePublicRequest, RestrictionAction.SendRequest];
      case ReportRelatedContentType.Track:
        return [RestrictionAction.UploadTrack];
      default:
        return [
          RestrictionAction.Comment,
          RestrictionAction.CreatePublicRequest,
          RestrictionAction.SendRequest,
          RestrictionAction.UploadTrack,
          RestrictionAction.Report,
        ];
    }
  };

  // Get available actions based on relatedContentType
  const getAvailableActions = (): ReportAction[] => {
    if (
      relatedContentType &&
      [ReportRelatedContentType.Track, ReportRelatedContentType.Comment, ReportRelatedContentType.Request].includes(
        relatedContentType,
      )
    ) {
      // For content-related reports, NoAction, Warning, Entitlement Restriction, and Content Removal are available
      return [
        ReportAction.NoAction,
        ReportAction.Warning,
        ReportAction.EntitlementRestriction,
        ReportAction.ContentRemoval,
      ];
    }
    // For user reports (no related content), all other actions are available
    return [
      ReportAction.NoAction,
      ReportAction.Warning,
      ReportAction.Suspended,
      ReportAction.EntitlementRestriction,
      ReportAction.PermanentBan,
    ];
  };

  const availableActions = getAvailableActions();
  const availableRestrictionActions = getAvailableRestrictionActions();

  // Auto-select restriction action if only one is available
  const autoSelectRestriction = availableRestrictionActions.length === 1;

  const form = useForm<ProcessReportFormValues>({
    resolver: zodResolver(processReportFormSchema),
    defaultValues: {
      actionTaken: undefined,
      status: undefined,
      note: "",
      suspensionDays: undefined,
      restrictionActions: autoSelectRestriction ? availableRestrictionActions : [],
      restrictionNotes: {},
    },
  });

  // Initialize selected restriction actions if auto-selecting
  React.useEffect(() => {
    if (autoSelectRestriction && selectedRestrictionActions.length === 0) {
      setSelectedRestrictionActions(availableRestrictionActions);
    }
  }, [autoSelectRestriction, availableRestrictionActions, selectedRestrictionActions.length]);

  const actionTaken = form.watch("actionTaken");

  const getAvailableStatuses = (action: ReportAction | undefined): ReportStatus[] => {
    if (action === ReportAction.NoAction) {
      return [ReportStatus.Rejected];
    }
    return [ReportStatus.Approved];
  };

  const onSubmit = async (data: ProcessReportFormValues) => {
    try {
      // Build restriction action details
      const restrictionActionDetails = selectedRestrictionActions.map((action) => ({
        restrictionAction: action,
        note: data.restrictionNotes?.[action] || undefined,
      }));

      await processReport.mutateAsync({
        reportId,
        actionTaken: data.actionTaken,
        status: data.status,
        note: data.note || undefined,
        suspensionDays:
          data.actionTaken === ReportAction.Suspended || data.actionTaken === ReportAction.EntitlementRestriction
            ? data.suspensionDays
            : undefined,
        restrictionActionDetails:
          data.actionTaken === ReportAction.EntitlementRestriction ? restrictionActionDetails : [],
      });

      toast.success("Report processed successfully");
      onOpenChange(false);
      form.reset();
      setSelectedRestrictionActions([]);
      onSuccess?.();
    } catch (error) {
      console.error("Error processing report:", error);
      toast.error("Failed to process report");
    }
  };

  const handleRestrictionActionToggle = (action: RestrictionAction, checked: boolean) => {
    if (checked) {
      setSelectedRestrictionActions([...selectedRestrictionActions, action]);
    } else {
      setSelectedRestrictionActions(selectedRestrictionActions.filter((a) => a !== action));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-[calc(100%-2rem)] flex-col p-0 sm:max-w-6xl">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Process Report
          </DialogTitle>
          <DialogDescription>Select the appropriate action and status to process this report.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
              <FormField
                control={form.control}
                name="actionTaken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset status when action changes
                        form.setValue("status", undefined as unknown as ReportStatus);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableActions.map((action) => (
                          <SelectItem key={action} value={action}>
                            {ACTION_LABELS[action]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      {relatedContentType &&
                      [
                        ReportRelatedContentType.Track,
                        ReportRelatedContentType.Comment,
                        ReportRelatedContentType.Request,
                      ].includes(relatedContentType)
                        ? "Content-related reports: Only Content Removal is available"
                        : "User reports: All actions except Content Removal are available"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {actionTaken && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAvailableStatuses(actionTaken).map((status) => (
                            <SelectItem key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        {actionTaken === ReportAction.NoAction
                          ? "NoAction: select Dismiss or Reject"
                          : "Other actions: select Approve"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {(actionTaken === ReportAction.Suspended || actionTaken === ReportAction.EntitlementRestriction) && (
                <FormField
                  control={form.control}
                  name="suspensionDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suspension Days *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number of days (1-365)"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseInt(value));
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {actionTaken === ReportAction.Suspended
                          ? "How many days to suspend the account"
                          : "Duration of the restriction in days"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {actionTaken === ReportAction.EntitlementRestriction && (
                <div className="bg-muted/20 space-y-4 rounded-lg border-2 p-5">
                  <div>
                    <h4 className="mb-1 text-sm font-semibold">Select Restrictions</h4>
                    <p className="text-muted-foreground mb-4 text-xs">
                      Select the permissions that the user will be restricted from
                    </p>
                    <div className="space-y-4">
                      {availableRestrictionActions.map((action) => {
                        const label = RESTRICTION_ACTION_LABELS[action];
                        return (
                          <div key={action} className="bg-background/50 space-y-3 rounded-md border p-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={action}
                                checked={selectedRestrictionActions.includes(action)}
                                disabled={autoSelectRestriction}
                                onCheckedChange={(checked) => handleRestrictionActionToggle(action, checked as boolean)}
                              />
                              <label
                                htmlFor={action}
                                className={`cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                  autoSelectRestriction ? "text-muted-foreground" : ""
                                }`}
                              >
                                {label}
                                {autoSelectRestriction && (
                                  <span className="text-muted-foreground ml-2 text-xs">(Auto-selected)</span>
                                )}
                              </label>
                            </div>
                            {selectedRestrictionActions.includes(action) && (
                              <div className="pt-1 pl-7">
                                <Textarea
                                  placeholder={`Note for ${label.toLowerCase()} restriction...`}
                                  className="min-h-[80px] w-full resize-none text-sm"
                                  value={form.watch(`restrictionNotes.${action}`) || ""}
                                  onChange={(e) => form.setValue(`restrictionNotes.${action}`, e.target.value)}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add notes about your decision..."
                        className="min-h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Note will be saved for reference purposes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-muted/20 border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processReport.isPending}>
                {processReport.isPending ? "Processing..." : "Process Report"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
