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
  DialogTrigger,
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
import { AlertTriangle, Flag, X } from "lucide-react";
import { useCreateReport } from "@/gql/client-mutation-options/report-mutation-options";
import { useAuthStore } from "@/store/stores/auth-store";
import { toast } from "sonner";
import {
  REPORT_TYPES_BY_CONTENT,
  REPORT_TYPE_LABELS,
  REPORT_TYPE_DESCRIPTIONS,
  CONTENT_TYPE_LABELS,
  type ReportButtonProps,
} from "@/types/report";
import { ReportType } from "@/gql/graphql";

const reportFormSchema = z.object({
  reportType: z.nativeEnum(ReportType).refine((val) => val !== undefined, {
    message: "Please select a reason for reporting",
  }),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  evidences: z.array(z.string().url("Invalid URL")).optional(),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export function ReportDialog({ 
  contentType, 
  contentId, 
  reportedUserId, 
  reportedUserName,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: ReportButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [evidenceInput, setEvidenceInput] = useState("");
  const [evidences, setEvidences] = useState<string[]>([]);
  const { user } = useAuthStore();
  const createReport = useCreateReport();

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reportType: undefined,
      description: "",
      evidences: [],
    },
  });

  const availableReportTypes = REPORT_TYPES_BY_CONTENT[contentType];

  const onSubmit = async (data: ReportFormValues) => {
    if (!user?.userId) {
      toast.error("You need to login to report");
      return;
    }

    const reportData = {
      reportType: data.reportType,
      description: data.description,
      reportedUserId,
      evidences: evidences.length > 0 ? evidences : undefined,
      relatedContentId: contentId,
      relatedContentType: contentId ? contentType : undefined,
    };

    console.log("📝 Submitting report:", reportData);

    try {
      await createReport.mutateAsync(reportData);

      toast.success("Your report has been submitted successfully");
      setOpen(false);
      form.reset();
      setEvidences([]);
      setEvidenceInput("");
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("An error occurred while submitting the report");
    }
  };

  const addEvidence = () => {
    if (evidenceInput.trim()) {
      try {
        new URL(evidenceInput);
        setEvidences([...evidences, evidenceInput.trim()]);
        setEvidenceInput("");
      } catch {
        toast.error("Invalid URL");
      }
    }
  };

  const removeEvidence = (index: number) => {
    setEvidences(evidences.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Flag className="h-4 w-4" />
            Report
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Report {CONTENT_TYPE_LABELS[contentType]}
          </DialogTitle>
          <DialogDescription>
            {reportedUserName && contentId && `Reporting ${CONTENT_TYPE_LABELS[contentType]}: "${reportedUserName}". `}
            {reportedUserName && !contentId && `Report about user: ${reportedUserName}. `}
            Please provide detailed information so we can review your report.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Reporting *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason for reporting" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableReportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex flex-col">
                            <span className="font-medium">{REPORT_TYPE_LABELS[type]}</span>
                            <span className="text-xs text-muted-foreground">
                              {REPORT_TYPE_DESCRIPTIONS[type]}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe in detail the issue you encountered..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Minimum 20 characters, maximum 1000 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Evidence (optional)</FormLabel>
              <FormDescription className="text-xs">
                Add URLs of images or videos as evidence
              </FormDescription>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/evidence.png"
                  value={evidenceInput}
                  onChange={(e) => setEvidenceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEvidence();
                    }
                  }}
                />
                <Button type="button" onClick={addEvidence} variant="secondary" size="sm">
                  Add
                </Button>
              </div>
              {evidences.length > 0 && (
                <div className="space-y-2 mt-3">
                  {evidences.map((evidence, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
                    >
                      <span className="truncate flex-1">{evidence}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEvidence(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createReport.isPending}>
                {createReport.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
