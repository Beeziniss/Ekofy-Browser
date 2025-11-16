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
import { AlertTriangle, Flag, X, Upload, Image as ImageIcon } from "lucide-react";
import { useCreateReport } from "@/gql/client-mutation-options/report-mutation-options";
import { useAuthStore } from "@/store/stores/auth-store";
import { toast } from "sonner";
import {
  REPORT_TYPES_BY_CONTENT,
  REPORT_TYPE_LABELS,
  CONTENT_TYPE_LABELS,
  type ReportButtonProps,
} from "@/types/report";
import { ReportType } from "@/gql/graphql";
import { uploadImageToCloudinary, validateImageFile } from "@/utils/cloudinary-utils";
import Image from "next/image";

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
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

    setIsUploading(true);
    let uploadedEvidences: string[] = [];

    try {
      // Upload all selected images to Cloudinary when submitting
      if (selectedFiles.length > 0) {
        toast.loading(`Uploading ${selectedFiles.length} evidence image(s)...`, { id: "upload-evidence" });
        
        const uploadPromises = selectedFiles.map(file =>
          uploadImageToCloudinary(file, {
            folder: "report-evidences",
            tags: ["report", "evidence"],
            resourceType: "image",
          })
        );

        const results = await Promise.all(uploadPromises);
        uploadedEvidences = results.map(result => result.secure_url);
        
        toast.success(`${uploadedEvidences.length} image(s) uploaded successfully`, { id: "upload-evidence" });
      }

      const reportData = {
        reportType: data.reportType,
        description: data.description,
        reportedUserId,
        evidences: uploadedEvidences.length > 0 ? uploadedEvidences : undefined,
        relatedContentId: contentId,
        relatedContentType: contentId ? contentType : undefined,
      };

      console.log("📝 Submitting report:", reportData);

      await createReport.mutateAsync(reportData);

      toast.success("Your report has been submitted successfully");
      setOpen(false);
      form.reset();
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("An error occurred while submitting the report");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate image file
    if (!validateImageFile(file)) {
      return;
    }

    setSelectedFiles([...selectedFiles, file]);
    
    // Reset input to allow selecting the same file again
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

            <div className="space-y-3">
              <FormLabel>Evidence (optional)</FormLabel>
              <FormDescription className="text-xs">
                Select images as evidence to support your report (will be uploaded when you submit)
              </FormDescription>
              
              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="evidence-upload"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("evidence-upload")?.click()}
                  disabled={isUploading}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Select Image
                </Button>
                <span className="text-xs text-muted-foreground">
                  Max 10MB • JPG, PNG, WEBP
                </span>
              </div>

              {/* Evidence List with Preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3 mt-4">
                  <p className="text-sm font-medium">Selected Evidence ({selectedFiles.length})</p>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedFiles.map((file, index) => {
                      const previewUrl = URL.createObjectURL(file);
                      return (
                        <div
                          key={index}
                          className="relative group rounded-lg border bg-muted/30 overflow-hidden"
                        >
                          {/* Image Preview */}
                          <div className="aspect-video relative">
                            <Image
                              src={previewUrl}
                              alt={`Evidence ${index + 1}`}
                              className="w-full h-full object-cover"
                              layout="fill"
                              objectFit="cover"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => window.open(previewUrl, "_blank")}
                                className="gap-1"
                              >
                                <ImageIcon className="h-3 w-3" />
                                View
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="gap-1"
                              >
                                <X className="h-3 w-3" />
                                Remove
                              </Button>
                            </div>
                          </div>
                          {/* Image Label */}
                          <div className="p-2 bg-background">
                            <p className="text-xs text-muted-foreground truncate">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createReport.isPending || isUploading}>
                {isUploading ? "Uploading..." : createReport.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
