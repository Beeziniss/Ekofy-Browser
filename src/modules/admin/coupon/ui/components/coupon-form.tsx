"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { CouponStatus, CouponDurationType, CouponPurposeType, CreateCouponRequestInput } from "@/gql/graphql";

interface CouponFormProps {
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    code?: string;
    percentOff?: number;
    duration?: CouponDurationType;
    purpose?: CouponPurposeType;
    status?: CouponStatus;
  };
  onSubmit: (data: CreateCouponRequestInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function CouponForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
}: CouponFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCouponRequestInput>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      code: initialData?.code || "",
      percentOff: initialData?.percentOff || 0,
      duration: initialData?.duration || CouponDurationType.Once,
      purpose: initialData?.purpose || CouponPurposeType.AnnualPlanDiscount,
    },
  });

  const duration = watch("duration");
  const purpose = watch("purpose");

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name || "");
      setValue("description", initialData.description || "");
      setValue("code", initialData.code || "");
      setValue("percentOff", initialData.percentOff || 0);
      setValue("duration", initialData.duration || CouponDurationType.Once);
      setValue("purpose", initialData.purpose || CouponPurposeType.AnnualPlanDiscount);
    }
  }, [initialData, setValue]);

  const onFormSubmit = (data: CreateCouponRequestInput) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>{mode === "create" ? "Create New Coupon" : "Edit Coupon"}</CardTitle>
            <CardDescription>
              {mode === "create"
                ? "Fill in the details to create a new discount coupon"
                : "Update the coupon information"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Coupon Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Coupon name is required" })}
                placeholder="e.g., Summer Sale 2024"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Coupon Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                {...register("code", { required: "Coupon code is required" })}
                placeholder="e.g., SUMMER2024"
                className="font-mono"
              />
              {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
            </div>

            {/* Percent Off */}
            <div className="space-y-2">
              <Label htmlFor="percentOff">
                Discount Percentage <span className="text-red-500">*</span>
              </Label>
              <Input
                id="percentOff"
                type="number"
                min="0"
                max="100"
                {...register("percentOff", {
                  required: "Discount percentage is required",
                  min: { value: 0, message: "Must be between 0 and 100" },
                  max: { value: 100, message: "Must be between 0 and 100" },
                  valueAsNumber: true,
                })}
                placeholder="e.g., 20"
              />
              {errors.percentOff && <p className="text-sm text-red-500">{errors.percentOff?.message as string}</p>}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duration <span className="text-red-500">*</span>
              </Label>
              <Select
                value={duration}
                onValueChange={(value) => setValue("duration", value as CouponDurationType)}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={CouponDurationType.Once} value={CouponDurationType.Once}>
                    Once
                  </SelectItem>
                  <SelectItem key={CouponDurationType.Forever} value={CouponDurationType.Forever}>
                    Forever
                  </SelectItem>
                  <SelectItem key={CouponDurationType.Repeating} value={CouponDurationType.Repeating}>
                    Repeating
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">
                Purpose <span className="text-red-500">*</span>
              </Label>
              <Select
                value={purpose}
                onValueChange={(value) => setValue("purpose", value as CouponPurposeType)}
              >
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={CouponPurposeType.AnnualPlanDiscount} value={CouponPurposeType.AnnualPlanDiscount}>
                    Annual Plan Discount
                  </SelectItem>
                  <SelectItem key={CouponPurposeType.AutoService} value={CouponPurposeType.AutoService}>
                    Auto Service
                  </SelectItem>
                  <SelectItem key={CouponPurposeType.General} value={CouponPurposeType.General}>
                    General
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Optional description for this coupon"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : mode === "create" ? "Create Coupon" : "Update Coupon"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

