"use client";

import { Suspense, useState } from "react";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicePackageOptions } from "@/gql/options/client-options";
import { sendRequestMutationOptions } from "@/gql/options/client-mutation-options";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils/format-shorten-name";
import { PackageXIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import type { CreateDirectRequestInput, CurrencyType } from "@/gql/graphql";

interface ServicePackageSectionProps {
  serviceId: string;
}

const subscribeFormSchema = z.object({
  deadline: z
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
    ),
  requirements: z.string().optional(),
});

type SubscribeFormValues = z.infer<typeof subscribeFormSchema>;

interface SubscribeDialogProps {
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

function SubscribeDialog({ open, onOpenChange, servicePackage }: SubscribeDialogProps) {
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
        deadline: data.deadline.toISOString(),
        requirements: data.requirements || undefined,
        // publicRequestId is ignored as mentioned in the requirements
      };

      await sendRequestMutation.mutateAsync({
        request: requestInput,
        isDirect: true, // Always true as mentioned in requirements
      });

      toast.success("Subscription request sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error sending subscription request:", error);
      toast.error("Failed to send subscription request. Please try again.");
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
          <DialogTitle>Subscribe to Service Package</DialogTitle>
          <DialogDescription>
            Send a direct request for &ldquo;{servicePackage?.packageName}&rdquo; by{" "}
            {servicePackage?.artist?.[0]?.stageName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
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
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any specific requirements or preferences for your project..."
                      className="min-h-24 resize-none"
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
              <Button
                type="submit"
                disabled={sendRequestMutation.isPending}
                className="bg-main-purple hover:bg-main-purple/90"
              >
                {sendRequestMutation.isPending ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const ServicePackageSection = ({ serviceId }: ServicePackageSectionProps) => {
  return (
    <Suspense fallback={<ServicePackageSectionSkeleton />}>
      <ServicePackageSectionSuspense serviceId={serviceId} />
    </Suspense>
  );
};

const ServicePackageSectionSkeleton = () => {
  return <div>Loading...</div>;
};

const ServicePackageSectionSuspense = ({ serviceId }: ServicePackageSectionProps) => {
  const { data } = useSuspenseQuery(servicePackageOptions({ serviceId }));
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

  const servicePackage = data?.artistPackages?.items?.[0];

  return (
    <div className="flex flex-col gap-y-8">
      <h1 className="text-main-white text-4xl font-bold">About The Artist</h1>

      <div className="flex items-start gap-x-14">
        <Avatar className="size-40">
          <AvatarImage
            src={servicePackage?.artist?.[0].avatarImage || undefined}
            alt={servicePackage?.artist?.[0].stageName || "Artist Avatar"}
          />
          <AvatarFallback>{getUserInitials(servicePackage?.artist?.[0].stageName || "Ekofy Artist")}</AvatarFallback>
        </Avatar>

        <div className="text-main-white text-sm font-normal">
          <h2 className="text-main-purple text-2xl font-semibold">{servicePackage?.artist?.[0].stageName}</h2>
          <div className="mt-4 space-y-4">
            <p>{servicePackage?.artist?.[0].biography}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xl">Here&apos;s what you get from service Remix Track Without Beat:</div>
        <ul className="text-main-white space-y-2 font-medium">
          {servicePackage?.serviceDetails?.map((detail, index) => (
            <li key={index} className="flex items-center gap-x-2">
              <PackageXIcon className="text-main-purple size-5" />
              {detail.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <Button
          variant={"ekofy"}
          size={"lg"}
          className="!rounded-sm text-base"
          onClick={() => setSubscribeDialogOpen(true)}
        >
          <span>Subscribe Now</span>
          <Separator orientation="vertical" className="bg-main-white/80 mx-3 h-6" />
          {/* {servicePackage?.amount} */}
          <span>
            {Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(servicePackage?.amount || 0)}
          </span>
        </Button>

        <div>
          Not meeting your needs?{" "}
          <Link
            href={`/artists/${servicePackage?.artist?.[0].id}/services`}
            className="text-main-link font-semibold hover:underline"
          >
            Explore more service from this artist
          </Link>
        </div>

        <SubscribeDialog
          open={subscribeDialogOpen}
          onOpenChange={setSubscribeDialogOpen}
          servicePackage={servicePackage}
        />
      </div>
    </div>
  );
};

export default ServicePackageSection;
