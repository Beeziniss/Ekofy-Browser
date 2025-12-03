import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Loader2, Plus, FileAudio, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitDeliveryMutationOptions } from "@/gql/options/client-mutation-options";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FilePath } from "@/types/file";

const deliveryFormSchema = z.object({
  notes: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

interface OrderSubmissionSubmitDialogProps {
  orderId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderSubmissionSubmitDialog = ({ orderId, isOpen, onOpenChange }: OrderSubmissionSubmitDialogProps) => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; key: string } | null>(null);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  const submitDeliveryMutation = useMutation(submitDeliveryMutationOptions);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/ogg": [".ogg"],
      "audio/wav": [".wav"],
      "audio/aac": [".aac"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error("Please upload only MP3, OGG, WAV, or AAC audio files");
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        setUploadedFile(null); // Clear any previous upload
      }
    },
    disabled: isUploading || submitDeliveryMutation.isPending,
  });

  const handleFileUpload = async (file: File): Promise<string> => {
    // Validate file type
    const allowedTypes = ["audio/mpeg", "audio/ogg", "audio/wav", "audio/aac"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only MP3, OGG, WAV, and AAC audio files are allowed");
    }

    setIsUploading(true);

    try {
      // 1. Get presigned URL from our API
      const presignRes = await fetch("/api/s3/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          filePath: FilePath.ORDERS,
        }),
      });

      if (!presignRes.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { uploadUrl, fileKey } = await presignRes.json();

      // 2. Upload file directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file");
      }

      setUploadedFile({ name: file.name, key: fileKey });
      return fileKey;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: DeliveryFormValues) => {
    try {
      let fileKey = uploadedFile?.key;

      // If no file uploaded yet but file is selected, upload it now
      if (!fileKey && selectedFile) {
        fileKey = await handleFileUpload(selectedFile);
      }

      if (!fileKey) {
        toast.error("Please select a file first");
        return;
      }

      // Submit delivery with the file key
      await submitDeliveryMutation.mutateAsync({
        packageOrderId: orderId,
        notes: data.notes || "",
        deliveryFileUrl: fileKey, // Store the S3 key instead of URL
      });

      toast.success("Delivery submitted successfully!");

      // Reset form, close dialog and invalidate queries to refresh the data
      form.reset();
      setSelectedFile(null);
      setUploadedFile(null);
      onOpenChange(false);
      await queryClient.invalidateQueries({ queryKey: ["order-package-detail"] });
    } catch (error) {
      console.error("Failed to submit delivery:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit delivery. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-main-purple hover:bg-main-purple/80 text-white">
          <Plus className="h-4 w-4" />
          Submit Delivery
        </Button>
      </DialogTrigger>
      <DialogContent className="border-main-grey/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-main-white">Submit New Delivery</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* File Upload Dropzone */}
            <div className="space-y-2">
              <label className="text-main-white text-sm font-medium">
                Audio Delivery File <span className="text-red-500">*</span>
              </label>

              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isDragActive && !isDragReject ? "border-blue-400 bg-blue-400/10" : ""} ${isDragReject ? "border-red-400 bg-red-400/10" : ""} ${!isDragActive ? "border-main-grey hover:border-main-grey/60" : ""} ${isUploading || submitDeliveryMutation.isPending ? "pointer-events-none opacity-50" : ""} `}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-main-grey h-8 w-8" />
                    <div className="text-main-white">
                      {isDragActive ? (
                        isDragReject ? (
                          <p className="text-red-400">Invalid file type</p>
                        ) : (
                          <p className="text-blue-400">Drop the file here...</p>
                        )
                      ) : (
                        <div>
                          <p>
                            Drop your audio file here, or <span className="text-main-purple">browse</span>
                          </p>
                          <p className="text-main-grey-dark-1 mt-1 text-xs">Supports MP3, OGG, WAV, AAC formats</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-blue-400/30 bg-blue-400/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileAudio className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-blue-400">{selectedFile.name}</p>
                        <p className="text-xs text-blue-400/70">Ready to upload</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      className="h-auto p-1 text-blue-400 hover:text-blue-400/80"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-white">Delivery Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any notes or instructions for the client..."
                      className="min-h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitDeliveryMutation.isPending || isUploading || !selectedFile}
              className="bg-main-purple hover:bg-main-purple/80 w-full text-white"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : submitDeliveryMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Delivery
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSubmissionSubmitDialog;
