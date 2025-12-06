"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateDirectRequestInput, CurrencyType } from "@/gql/graphql";
import { sendRequestMutationOptions } from "@/gql/options/client-mutation-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const subscribeFormSchema = z.object({
  /* deadline: z
    .date({
      message: "Please select a deadline.",
    })
    .refine(
      (date) => {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 5);
        return date >= minDate;
      },
      {
        message: "Deadline must be at least 5 days from today.",
      },
    ), */
  requirements: z.string().max(2000, { error: "Requirements only allow up to 2000 characters." }).optional(),
});

type SubscribeFormValues = z.infer<typeof subscribeFormSchema>;

interface ContactArtistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servicePackage:
    | {
        __typename?: "ArtistPackage" | undefined;
        id: string;
        artistId: string;
        amount: number;
        currency: CurrencyType;
        packageName: string;
        description?: string | null;
        serviceDetails: Array<{
          __typename?: "Metadata";
          value: string;
        }>;
        artist: Array<{
          __typename?: "Artist";
          id: string;
          stageName: string;
          avatarImage?: string | null;
          biography?: string | null;
        }>;
      }
    | null
    | undefined;
}

const ContactArtistDialog = ({ open, onOpenChange, servicePackage }: ContactArtistDialogProps) => {
  const queryClient = useQueryClient();
  const sendRequestMutation = useMutation(sendRequestMutationOptions);

  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      requirements: "",
    },
  });

  const onSubmit = async (data: SubscribeFormValues) => {
    try {
      // Validate required fields
      if (!servicePackage?.id) {
        toast.error("Service package not found. Please try again.");
        return;
      }

      if (!servicePackage.artist?.[0]?.id) {
        toast.error("Artist information not found. Please try again.");
        return;
      }

      const requestInput: CreateDirectRequestInput = {
        artistId: servicePackage.artist[0].id,
        packageId: servicePackage.id,
        requirements: data.requirements || undefined,
        // publicRequestId is ignored as mentioned in the requirements
      };

      await sendRequestMutation.mutateAsync({
        request: requestInput,
        isDirect: true, // Always true as mentioned in requirements
      });

      toast.success("Request sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["listener-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error sending direct request:", error);
      toast.error("Failed to send direct request. Please try again.");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  // Calculate minimum date (5 days from now)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contact Artist</DialogTitle>
          <DialogDescription>
            Send a direct request for{" "}
            <strong className="text-main-white">&ldquo;{servicePackage?.packageName}&rdquo;</strong> by{" "}
            {servicePackage?.artist?.[0]?.stageName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Project Deadline *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "dd/MM/yyyy") : <span>Select deadline</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < minDate}
                        captionLayout="dropdown"
                        fromYear={2000}
                        toYear={new Date().getFullYear() + 10}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-muted-foreground text-xs">Deadline must be at least 5 days from today</p>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any specific requirements or preferences for your project..."
                      className="h-42 max-h-42 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={sendRequestMutation.isPending} variant={"ekofy"}>
                {sendRequestMutation.isPending ? "Sending..." : "Contact Artist"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactArtistDialog;
