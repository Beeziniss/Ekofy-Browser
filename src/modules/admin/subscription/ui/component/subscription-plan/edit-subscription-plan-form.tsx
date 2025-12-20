"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useUpdateSubscriptionPlanMutation } from "@/gql/client-mutation-options/subscription-mutation-options";
import { PeriodTime } from "@/gql/graphql";
import type { UpdateSubscriptionPlanInput, SubscriptionPlan, SubscriptionPlanPrice } from "@/types";
import { toast } from "sonner";

const priceSchema = z.object({
  interval: z.nativeEnum(PeriodTime),
  intervalCount: z.number().min(1, "Interval count must be at least 1"),
  lookupKey: z.string().min(1, "Lookup key is required"),
});

const updatePriceSchema = z.object({
  stripePriceId: z.string(),
  active: z.boolean().optional(),
  interval: z.nativeEnum(PeriodTime).optional(),
  intervalCount: z.number().min(1, "Interval count must be at least 1").optional(),
  lookupKey: z.string().min(1, "Lookup key is required").optional(),
});

const metadataSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

const imageSchema = z.object({
  url: z.string().url("Must be a valid URL"),
});

const editSubscriptionPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(imageSchema).optional(),
  metadata: z.array(metadataSchema).optional(),
  newPrices: z.array(priceSchema),
  updatePrices: z.array(updatePriceSchema),
});

type EditSubscriptionPlanFormData = z.infer<typeof editSubscriptionPlanSchema>;

interface EditSubscriptionPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  subscriptionPlan: SubscriptionPlan;
}

export default function EditSubscriptionPlanForm({
  open,
  onOpenChange,
  onSuccess,
  subscriptionPlan,
}: EditSubscriptionPlanFormProps) {
  const updateSubscriptionPlanMutation = useUpdateSubscriptionPlanMutation();

  // Helper function to compare arrays
  const arraysEqual = <T,>(a: T[], b: T[], compareFn?: (itemA: T, itemB: T) => boolean): boolean => {
    if (a.length !== b.length) return false;
    return a.every((item, index) => {
      if (compareFn) {
        return compareFn(item, b[index]);
      }
      return JSON.stringify(item) === JSON.stringify(b[index]);
    });
  };

  const form = useForm<EditSubscriptionPlanFormData>({
    resolver: zodResolver(editSubscriptionPlanSchema),
    defaultValues: {
      name: subscriptionPlan.stripeProductName,
      images: subscriptionPlan.stripeProductImages?.map(url => ({ url })) || [],
      metadata: subscriptionPlan.stripeProductMetadata?.map(meta => ({ key: meta.key, value: meta.value })) || [],
      newPrices: [],
      updatePrices: subscriptionPlan.subscriptionPlanPrices.map((price: SubscriptionPlanPrice) => ({
        stripePriceId: price.stripePriceId,
        active: price.stripePriceActive,
        interval: price.interval,
        intervalCount: price.intervalCount,
        lookupKey: price.stripePriceLookupKey,
      })),
    },
  });

  const {
    fields: newPriceFields,
    append: appendNewPrice,
    remove: removeNewPrice,
  } = useFieldArray({
    control: form.control,
    name: "newPrices",
  });

  const {
    fields: updatePriceFields,
    remove: removeUpdatePrice,
  } = useFieldArray({
    control: form.control,
    name: "updatePrices",
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const {
    fields: metadataFields,
    append: appendMetadata,
    remove: removeMetadata,
  } = useFieldArray({
    control: form.control,
    name: "metadata",
  });

  // Reset form when subscriptionPlan changes
  useEffect(() => {
    if (subscriptionPlan && open) {
      form.reset({
        name: subscriptionPlan.stripeProductName,
        images: subscriptionPlan.stripeProductImages?.map(url => ({ url })) || [],
        metadata: subscriptionPlan.stripeProductMetadata?.map(meta => ({ key: meta.key, value: meta.value })) || [],
        newPrices: [],
        updatePrices: subscriptionPlan.subscriptionPlanPrices.map((price: SubscriptionPlanPrice) => ({
          stripePriceId: price.stripePriceId,
          active: price.stripePriceActive,
          interval: price.interval,
          intervalCount: price.intervalCount,
          lookupKey: price.stripePriceLookupKey,
        })),
      });
    }
  }, [subscriptionPlan, open, form]);

  const onSubmit = async (data: EditSubscriptionPlanFormData) => {
    try {
      // Start with required fields
      const transformedData: UpdateSubscriptionPlanInput = {
        subscriptionPlanId: subscriptionPlan.id,
        newPrices: data.newPrices,
        updatePrices: [], // Will be populated below if there are changes
      };

      // Only add name if it changed
      if (data.name !== subscriptionPlan.stripeProductName) {
        transformedData.name = data.name;
      }

      // Check if images changed
      const currentImages = subscriptionPlan.stripeProductImages || [];
      const formImages = data.images?.map((img) => img.url).filter(Boolean) || [];
      const imagesChanged = !arraysEqual(currentImages, formImages);
      
      if (imagesChanged) {
        transformedData.images = formImages;
      }

      // Check if metadata changed
      const currentMetadata = subscriptionPlan.stripeProductMetadata || [];
      const formMetadata = data.metadata || [];
      const metadataChanged = !arraysEqual(
        currentMetadata, 
        formMetadata,
        (a, b) => a.key === b.key && a.value === b.value
      );
      
      if (metadataChanged && formMetadata.length > 0) {
        transformedData.metadata = formMetadata;
      }

      // Check if prices changed and build updatePrices array
      const changedPrices = data.updatePrices.filter((updatePrice, index) => {
        const originalPrice = subscriptionPlan.subscriptionPlanPrices[index];
        if (!originalPrice) return true; // New price

        return (
          updatePrice.active !== originalPrice.stripePriceActive ||
          updatePrice.interval !== originalPrice.interval ||
          updatePrice.intervalCount !== originalPrice.intervalCount ||
          updatePrice.lookupKey !== originalPrice.stripePriceLookupKey
        );
      });

      transformedData.updatePrices = changedPrices;

      // Only proceed if there are actual changes
      const hasChanges = 
        transformedData.name !== undefined ||
        transformedData.images !== undefined ||
        transformedData.metadata !== undefined ||
        transformedData.newPrices.length > 0 ||
        transformedData.updatePrices.length > 0;

      if (!hasChanges) {
        toast.info("No changes detected");
        onOpenChange(false);
        return;
      }

      await updateSubscriptionPlanMutation.mutateAsync(transformedData);
      handleReset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update subscription plan:", error);
    }
  };

  const handleReset = () => {
    form.reset({
      name: subscriptionPlan.stripeProductName,
      images: subscriptionPlan.stripeProductImages?.map(url => ({ url })) || [],
      metadata: subscriptionPlan.stripeProductMetadata?.map(meta => ({ key: meta.key, value: meta.value })) || [],
      newPrices: [],
      updatePrices: subscriptionPlan.subscriptionPlanPrices.map((price: SubscriptionPlanPrice) => ({
        stripePriceId: price.stripePriceId,
        active: price.stripePriceActive,
        interval: price.interval,
        intervalCount: price.intervalCount,
        lookupKey: price.stripePriceLookupKey,
      })),
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    handleReset();
  };

  // Check if interval is already used (in existing or new prices)
  const isIntervalUsed = (interval: PeriodTime, currentIndex?: number) => {
    const newPricesIntervals = form.watch("newPrices")?.map(price => price.interval) || [];
    const updatePricesIntervals = form.watch("updatePrices")?.map(price => price.interval) || [];
    
    // Remove current index from the check for new prices
    if (currentIndex !== undefined) {
      newPricesIntervals.splice(currentIndex, 1);
    }
    
    return [...updatePricesIntervals, ...newPricesIntervals].includes(interval);
  };

  const getAvailableIntervals = (currentIndex?: number) => {
    return Object.values(PeriodTime).filter(interval => !isIntervalUsed(interval, currentIndex));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="wide-dialog max-h-[90vh] overflow-y-auto"
        style={{
          width: "95vw",
          maxWidth: "none",
          minWidth: "800px",
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Subscription Plan</DialogTitle>
          <DialogDescription>
            Update subscription plan details, pricing options, images, and metadata
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Premium Plan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Images and Metadata in 2 columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">Add image URLs for this plan (optional)</p>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendImage({ url: "" })}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imageFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name={`images.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => removeImage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {imageFields.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      No images added yet. Click &quot;Add Image&quot; to add image URLs.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">Add custom metadata key-value pairs (optional)</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendMetadata({ key: "", value: "" })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Metadata
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {metadataFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name={`metadata.${index}.key`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Key (e.g., category)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`metadata.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Value (e.g., premium)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => removeMetadata(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {metadataFields.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      No metadata added yet. Click &quot;Add Metadata&quot; to add key-value pairs.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Current Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Current Pricing</CardTitle>
                <p className="text-muted-foreground text-sm">Update existing pricing intervals</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {updatePriceFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-medium">Current Price {index + 1}</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeUpdatePrice(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <FormField
                        control={form.control}
                        name={`updatePrices.${index}.interval`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Interval<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select interval" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={PeriodTime.Month}>Monthly</SelectItem>
                                <SelectItem value={PeriodTime.Day}>Daily</SelectItem>
                                <SelectItem value={PeriodTime.Week}>Weekly</SelectItem>
                                <SelectItem value={PeriodTime.Year}>Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`updatePrices.${index}.intervalCount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interval Count<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`updatePrices.${index}.lookupKey`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lookup Key<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="premium_monthly" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`updatePrices.${index}.active`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Active</FormLabel>
                            <Select onValueChange={(value) => field.onChange(value === "true")} value={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* New Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Pricing</CardTitle>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">Add new pricing intervals (if available)</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendNewPrice({
                        interval: getAvailableIntervals()[0] || PeriodTime.Month,
                        intervalCount: 1,
                        lookupKey: "",
                      })
                    }
                    disabled={getAvailableIntervals().length === 0}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Price
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {newPriceFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-medium">New Price Option {index + 1}</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeNewPrice(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`newPrices.${index}.interval`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Interval<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select interval" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getAvailableIntervals(index).map((interval) => (
                                  <SelectItem key={interval} value={interval}>
                                    {interval === PeriodTime.Month && "Monthly"}
                                    {interval === PeriodTime.Day && "Daily"}
                                    {interval === PeriodTime.Week && "Weekly"}
                                    {interval === PeriodTime.Year && "Yearly"}
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
                        name={`newPrices.${index}.intervalCount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interval Count<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`newPrices.${index}.lookupKey`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lookup Key<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="premium_monthly" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}
                {newPriceFields.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No new pricing added yet. Click &quot;Add New Price&quot; to add new pricing intervals.
                  </p>
                )}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateSubscriptionPlanMutation.isPending}>
                {updateSubscriptionPlanMutation.isPending ? "Updating..." : "Update Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}