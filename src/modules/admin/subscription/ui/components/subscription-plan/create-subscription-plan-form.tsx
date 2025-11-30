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
import { useCreateSubscriptionPlanMutation } from "@/gql/client-mutation-options/subscription-mutation-options";
import { PeriodTime } from "@/gql/graphql";
import type { CreateSubscriptionPlanInput } from "@/types";

const priceSchema = z.object({
  interval: z.nativeEnum(PeriodTime),
  intervalCount: z.number().min(1, "Interval count must be at least 1"),
  lookupKey: z.string().min(1, "Lookup key is required"),
});

const metadataSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

const imageSchema = z.object({
  url: z.string().url("Must be a valid URL"),
});

const createSubscriptionPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subscriptionCode: z
    .string()
    .min(1, "Subscription code is required")
    .regex(
      /^[a-z][a-z0-9_]*$/,
      "Subscription code must be lowercase, start with a letter, and contain only letters, numbers, and underscores",
    ),
  images: z.array(imageSchema).optional(),
  metadata: z.array(metadataSchema).optional(),
  prices: z.array(priceSchema).min(1, "At least one price is required"),
});

type CreateSubscriptionPlanFormData = z.infer<typeof createSubscriptionPlanSchema>;

interface CreateSubscriptionPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  preselectedSubscriptionCode?: string;
}

export default function CreateSubscriptionPlanForm({
  open,
  onOpenChange,
  onSuccess,
  preselectedSubscriptionCode,
}: CreateSubscriptionPlanFormProps) {
  const createSubscriptionPlanMutation = useCreateSubscriptionPlanMutation();

  const form = useForm<CreateSubscriptionPlanFormData>({
    resolver: zodResolver(createSubscriptionPlanSchema),
    defaultValues: {
      name: "",
      subscriptionCode: preselectedSubscriptionCode || "",
      images: [],
      metadata: [],
      prices: [
        {
          interval: PeriodTime.Month,
          intervalCount: 1,
          lookupKey: "",
        },
      ],
    },
  });

  const {
    fields: priceFields,
    append: appendPrice,
    remove: removePrice,
  } = useFieldArray({
    control: form.control,
    name: "prices",
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

  // Reset form when preselectedSubscriptionCode changes
  useEffect(() => {
    if (preselectedSubscriptionCode) {
      form.setValue("subscriptionCode", preselectedSubscriptionCode);
    }
  }, [preselectedSubscriptionCode, form]);

  const onSubmit = async (data: CreateSubscriptionPlanFormData) => {
    try {
      // Transform the data to match the API expected format
      const transformedData: CreateSubscriptionPlanInput = {
        name: data.name,
        subscriptionCode: data.subscriptionCode,
        prices: data.prices,
      };

      // Only add images if there are any
      const images = data.images?.map((img) => img.url).filter(Boolean);
      if (images && images.length > 0) {
        transformedData.images = images;
      }

      // Only add metadata if there are any
      if (data.metadata && data.metadata.length > 0) {
        transformedData.metadata = data.metadata;
      }

      await createSubscriptionPlanMutation.mutateAsync(transformedData);
      handleReset();
      onOpenChange(false);
      onSuccess?.(); // Call onSuccess callback if provided
    } catch (error) {
      console.error("Failed to create subscription plan:", error);
    }
  };

  const handleReset = () => {
    form.reset({
      name: "",
      subscriptionCode: preselectedSubscriptionCode || "",
      images: [],
      metadata: [],
      prices: [
        {
          interval: PeriodTime.Month,
          intervalCount: 1,
          lookupKey: "",
        },
      ],
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    handleReset();
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
          <DialogTitle>Create Subscription Plan</DialogTitle>
          <DialogDescription>
            Create a new subscription plan with pricing options, images, and metadata
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Premium Plan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subscriptionCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Code</FormLabel>
                        <FormControl>
                          <Input placeholder="premium_plan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">Configure pricing intervals and options</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendPrice({
                        interval: PeriodTime.Month,
                        intervalCount: 1,
                        lookupKey: "",
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Price
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {priceFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-medium">Price Option {index + 1}</h4>
                      {priceFields.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removePrice(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`prices.${index}.interval`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Interval</FormLabel>
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
                        name={`prices.${index}.intervalCount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interval Count</FormLabel>
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
                        name={`prices.${index}.lookupKey`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lookup Key</FormLabel>
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
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={createSubscriptionPlanMutation.isPending}>
                {createSubscriptionPlanMutation.isPending ? "Creating..." : "Create Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
