import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Loader2, Plus } from "lucide-react";
import { submitDeliveryMutationOptions } from "@/gql/options/client-mutation-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const deliveryFormSchema = z.object({
  notes: z.string().optional(),
  deliveryFileUrl: z.string().url({ message: "Please enter a valid URL" }).min(1, "File URL is required"),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

interface OrderSubmissionSubmitDialogProps {
  orderId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderSubmissionSubmitDialog = ({ orderId, isOpen, onOpenChange }: OrderSubmissionSubmitDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      notes: "",
      deliveryFileUrl: "",
    },
  });

  const submitDeliveryMutation = useMutation(submitDeliveryMutationOptions);

  const onSubmit = async (data: DeliveryFormValues) => {
    try {
      // Submit delivery with the provided file URL
      await submitDeliveryMutation.mutateAsync({
        packageOrderId: orderId,
        notes: data.notes || "",
        deliveryFileUrl: data.deliveryFileUrl,
      });

      toast.success("Delivery submitted successfully!");

      // Reset form, close dialog and invalidate queries to refresh the data
      form.reset();
      onOpenChange(false);
      await queryClient.invalidateQueries({ queryKey: ["order-package-detail"] });
    } catch (error) {
      console.error("Failed to submit delivery:", error);
      toast.error("Failed to submit delivery. Please try again.");
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
            {/* File URL Input */}
            <FormField
              control={form.control}
              name="deliveryFileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-main-white">
                    Delivery File URL <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://example.com/your-delivery-file.pdf" />
                  </FormControl>
                  <p className="text-main-grey-dark-1 text-xs">
                    Please provide a direct URL to your delivery file (e.g., Google Drive, Dropbox, etc.)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              disabled={submitDeliveryMutation.isPending}
              className="bg-main-purple hover:bg-main-purple/80 w-full text-white"
            >
              {submitDeliveryMutation.isPending ? (
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
