"use client";

import { useState } from "react";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { useProcessReport } from "@/gql/client-mutation-options/report-mutation-options";
import { toast } from "sonner";
import { ReportAction, ReportStatus, RestrictionAction } from "@/gql/graphql";

interface ProcessReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  onSuccess?: () => void;
}

const processReportFormSchema = z
  .object({
    actionTaken: z.nativeEnum(ReportAction).refine((val) => val !== undefined, {
      message: "Vui lòng chọn hành động xử lý",
    }),
    status: z.nativeEnum(ReportStatus).refine((val) => val !== undefined, {
      message: "Vui lòng chọn trạng thái",
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
        return [ReportStatus.Dismissed, ReportStatus.Rejected].includes(data.status);
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
  [ReportStatus.Dismissed]: "Dismissed",
  [ReportStatus.Escalated]: "Escalated",
};

// Restriction action labels
const RESTRICTION_ACTION_LABELS: Record<RestrictionAction, string> = {
  [RestrictionAction.None]: "None",
  [RestrictionAction.Comment]: "Comment",
  [RestrictionAction.CreateRequest]: "Create Public Request",
  [RestrictionAction.CreateDirectRequest]: "Create Private Request",
  [RestrictionAction.UploadTrack]: "Upload Track",
  [RestrictionAction.Report]: "Report",
};

export function ProcessReportDialog({ open, onOpenChange, reportId, onSuccess }: ProcessReportDialogProps) {
  const [selectedRestrictionActions, setSelectedRestrictionActions] = useState<RestrictionAction[]>([]);
  const processReport = useProcessReport();

  const form = useForm<ProcessReportFormValues>({
    resolver: zodResolver(processReportFormSchema),
    defaultValues: {
      actionTaken: undefined,
      status: undefined,
      note: "",
      suspensionDays: undefined,
      restrictionActions: [],
      restrictionNotes: {},
    },
  });

  const actionTaken = form.watch("actionTaken");

  const getAvailableStatuses = (action: ReportAction | undefined): ReportStatus[] => {
    if (action === ReportAction.NoAction) {
      return [ReportStatus.Dismissed, ReportStatus.Rejected];
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
        suspensionDays: data.actionTaken === ReportAction.Suspended ? data.suspensionDays : undefined,
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Process Report
          </DialogTitle>
          <DialogDescription>
            Select the appropriate action and status to process this report.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      {Object.entries(ACTION_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            {actionTaken === ReportAction.Suspended && (
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
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>How many days to suspend the account</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {actionTaken === ReportAction.EntitlementRestriction && (
              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Select Restrictions</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Select the permissions that the user will be restricted from
                  </p>
                  <div className="space-y-3">
                    {Object.entries(RESTRICTION_ACTION_LABELS)
                      .filter(([key]) => key !== RestrictionAction.None)
                      .map(([key, label]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={selectedRestrictionActions.includes(key as RestrictionAction)}
                              onCheckedChange={(checked) =>
                                handleRestrictionActionToggle(key as RestrictionAction, checked as boolean)
                              }
                            />
                            <label
                              htmlFor={key}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {label}
                            </label>
                          </div>
                          {selectedRestrictionActions.includes(key as RestrictionAction) && (
                            <Textarea
                              placeholder="Note for this restriction..."
                              className="ml-6 text-xs"
                              value={form.watch(`restrictionNotes.${key}`) || ""}
                              onChange={(e) =>
                                form.setValue(`restrictionNotes.${key}`, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}
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

            <DialogFooter>
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
