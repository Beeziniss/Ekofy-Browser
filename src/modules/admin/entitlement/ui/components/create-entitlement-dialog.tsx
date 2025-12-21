"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useCreateEntitlementMutation } from "@/gql/client-mutation-options/entitlements-mutation-options";
import { useQuery } from "@tanstack/react-query";
import { subscriptionOverridesQueryOptions } from "@/gql/options/entitlements-options";
import { EntitlementValueType, UserRole, Scalars } from "@/gql/graphql";
import { CreateEntitlementRequestInput } from "@/gql/graphql";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  code: z.string().min(1, "Code is required").max(100, "Code must be less than 100 characters").regex(/^[a-z_]+$/, "Code must be lowercase with underscores"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  valueType: z.nativeEnum(EntitlementValueType),
  isActive: z.boolean(),
  defaultValues: z.array(
    z.object({
      role: z.nativeEnum(UserRole),
      value: z.string().min(1, "Value is required"),
    })
  ),
  subscriptionOverrides: z.array(
    z.object({
      subscriptionCode: z.string().min(1, "Subscription code is required"),
      value: z.string().min(1, "Value is required"),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateEntitlementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateEntitlementDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateEntitlementDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch subscription codes for subscription overrides
  const { data: subscriptionData } = useQuery(subscriptionOverridesQueryOptions());
  const subscriptionCodes = subscriptionData || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      valueType: EntitlementValueType.String,
      isActive: true,
      defaultValues: [],
      subscriptionOverrides: [],
    },
  });

  const { fields: defaultValueFields, append: appendDefaultValue, remove: removeDefaultValue } = useFieldArray({
    control: form.control,
    name: "defaultValues",
  });

  const { fields: overrideFields, append: appendOverride, remove: removeOverride } = useFieldArray({
    control: form.control,
    name: "subscriptionOverrides",
  });

  const createMutation = useCreateEntitlementMutation();

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // Convert form values to GraphQL input format
    // Note: defaultValues needs to be converted to EntitlementValue format
    // Based on BE, it should be an object mapping role -> value
    const defaultValuesObj: Record<string, unknown> = {};
    values.defaultValues?.forEach((dv) => {
      defaultValuesObj[dv.role] = parseValueByType(dv.value, values.valueType);
    });

    const input: CreateEntitlementRequestInput = {
      name: values.name,
      code: values.code.toLowerCase().replace(/\s+/g, "_"),
      description: values.description,
      valueType: values.valueType,
      isActive: values.isActive,
      defaultValues: defaultValuesObj as Scalars['EntitlementValue']['input'],
      subscriptionOverrides: values.subscriptionOverrides?.map((ov) => ({
        subscriptionCode: ov.subscriptionCode,
        value: parseValueByType(ov.value, values.valueType),
      })) || [],
    };

    createMutation.mutate(input, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
        onSuccess?.();
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  // Helper function to parse value based on value type
  const parseValueByType = (value: string, type: EntitlementValueType): unknown => {
    switch (type) {
      case EntitlementValueType.Boolean:
        return value.toLowerCase() === "true";
      case EntitlementValueType.Int:
        return parseInt(value, 10);
      case EntitlementValueType.Double:
      case EntitlementValueType.Decimal:
        return parseFloat(value);
      case EntitlementValueType.Long:
        return BigInt(value);
      case EntitlementValueType.DateTime:
        return new Date(value).toISOString();
      case EntitlementValueType.Array:
        try {
          return JSON.parse(value);
        } catch {
          return value.split(",").map((v) => v.trim());
        }
      case EntitlementValueType.Object:
        try {
          return JSON.parse(value);
        } catch {
          return {};
        }
      default:
        return value;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Entitlement</DialogTitle>
          <DialogDescription>
            Add a new entitlement to control user feature access.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., High Quality Audio" {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name for this entitlement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Code<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., high_quality_audio" 
                      {...field}
                      onChange={(e) => {
                        const lowerValue = e.target.value.toLowerCase().replace(/\s+/g, "_");
                        field.onChange(lowerValue);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Unique code (lowercase with underscores, e.g., high_quality_audio)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this entitlement..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A detailed description for this entitlement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Value Type<span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value as EntitlementValueType)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a value type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={EntitlementValueType.String}>String</SelectItem>
                      <SelectItem value={EntitlementValueType.Boolean}>Boolean</SelectItem>
                      <SelectItem value={EntitlementValueType.Int}>Int</SelectItem>
                      <SelectItem value={EntitlementValueType.Double}>Double</SelectItem>
                      <SelectItem value={EntitlementValueType.Decimal}>Decimal</SelectItem>
                      <SelectItem value={EntitlementValueType.Long}>Long</SelectItem>
                      <SelectItem value={EntitlementValueType.DateTime}>DateTime</SelectItem>
                      <SelectItem value={EntitlementValueType.Array}>Array</SelectItem>
                      <SelectItem value={EntitlementValueType.Object}>Object</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The data type for this entitlement value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Whether this entitlement is currently active
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Default Values Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Default Values by Role</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendDefaultValue({ role: UserRole.Listener, value: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Default Value
                </Button>
              </div>
              {defaultValueFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`defaultValues.${index}.role`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value as UserRole)}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserRole.Listener}>Listener</SelectItem>
                            <SelectItem value={UserRole.Artist}>Artist</SelectItem>
                            <SelectItem value={UserRole.Moderator}>Moderator</SelectItem>
                            <SelectItem value={UserRole.Admin}>Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`defaultValues.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDefaultValue(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Subscription Overrides Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Subscription Overrides</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendOverride({ subscriptionCode: "", value: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Override
                </Button>
              </div>
              {overrideFields.map((field, index) => {
                // Get all selected subscription codes except the current one
                const selectedCodes = form.watch("subscriptionOverrides")
                  .map((ov, idx) => idx !== index ? ov.subscriptionCode : null)
                  .filter((code): code is string => !!code);
                
                // Filter out already selected codes
                const availableCodes = subscriptionCodes.filter(
                  (sub) => !selectedCodes.includes(sub.code)
                );

                const valueType = form.watch("valueType");

                return (
                  <div key={field.id} className="flex gap-2 items-end">
                    <FormField
                      control={form.control}
                      name={`subscriptionOverrides.${index}.subscriptionCode`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Subscription Code</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subscription" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableCodes.length > 0 ? (
                                availableCodes.map((sub) => (
                                  <SelectItem key={sub.id} value={sub.code}>
                                    {sub.code}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-options" disabled>
                                  No available subscriptions
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`subscriptionOverrides.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            {valueType === EntitlementValueType.Boolean ? (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">True</SelectItem>
                                  <SelectItem value="false">False</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input placeholder="Enter value" {...field} />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOverride(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Entitlement
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

