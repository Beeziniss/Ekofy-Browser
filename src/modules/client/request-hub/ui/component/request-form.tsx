"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@/modules/shared/ui/components/editor";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { CreateRequestData, UpdateRequestData, RequestBudget } from "@/types/request-hub";
import { z } from "zod";

// Zod validation schema
const requestFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  summary: z.string().min(1, "Summary is required").max(500, "Summary must be less than 500 characters"),
  detailDescription: z.string().min(1, "Description is required"),
  budgetMin: z.number().min(1000, "Minimum budget must be at least 1,000 VND"),
  budgetMax: z.number().min(1000, "Maximum budget must be at least 1,000 VND"),
  duration: z.number().min(1, "Duration must be at least 1 day").int("Duration must be a whole number"),
}).refine((data) => data.budgetMax >= data.budgetMin, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["budgetMax"],
});

// Helper function to format number with dots
const formatCurrency = (value: string): string => {
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, "");

  // Add dots every 3 digits from right to left
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Helper function to parse formatted currency to number
const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/\./g, "")) || 0;
};

interface RequestFormProps {
  mode: "create" | "edit";
  initialData?: Partial<CreateRequestData> & { 
    id?: string; 
    budget?: RequestBudget | number; 
    duration?: number;
  };
  onSubmit: (data: CreateRequestData | UpdateRequestData) => void;
  onCancel?: () => void;
}

export function RequestForm({ mode, initialData, onSubmit, onCancel }: RequestFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [detailDescription, setDetailDescription] = useState(initialData?.detailDescription || "");
  const [budgetMin, setBudgetMin] = useState(
    initialData?.budget
      ? typeof initialData.budget === "object"
        ? formatCurrency(initialData.budget.min.toString())
        : formatCurrency(initialData.budget.toString())
      : "",
  );
  const [budgetMax, setBudgetMax] = useState(
    initialData?.budget
      ? typeof initialData.budget === "object"
        ? formatCurrency(initialData.budget.max.toString())
        : formatCurrency(initialData.budget.toString())
      : "",
  );

  const [duration, setDuration] = useState<number>(() => {
    if (initialData?.duration !== undefined && initialData?.duration !== null) {
      const parsedDuration = Number(initialData.duration);
      return !isNaN(parsedDuration) && parsedDuration > 0 ? parsedDuration : 1;
    }
    return 1;
  });
  const [errors, setErrors] = useState<{
    title?: string;
    summary?: string;
    detailDescription?: string;
    budgetMin?: string;
    budgetMax?: string;
    duration?: string;
  }>({});

  // Check user role - only listeners can create/edit requests
  const { user } = useAuthStore();

  if (!user || user.role !== UserRole.LISTENER) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">Access Denied</h2>
          <p className="mb-4">Only listeners can create or edit requests.</p>
          {onCancel && (
            <button onClick={onCancel} className="text-blue-400 underline hover:text-blue-300">
              Go back
            </button>
          )}
        </div>
      </div>
    );
  }

  // Calculate minimum date (5 days from now)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    const budgetMinNumber = parseCurrency(budgetMin);
    const budgetMaxNumber = parseCurrency(budgetMax) || budgetMinNumber;

    // Validate with Zod
    const validationResult = requestFormSchema.safeParse({
      title: title.trim(),
      summary: summary.trim(),
      detailDescription: detailDescription.trim(),
      budgetMin: budgetMinNumber,
      budgetMax: budgetMaxNumber,
      duration,
    });

    if (!validationResult.success) {
      // Map Zod errors to error state
      const fieldErrors: typeof errors = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof typeof errors;
        if (path) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const budget = { min: budgetMinNumber, max: budgetMaxNumber };

    if (mode === "edit" && initialData?.id) {
      const updateData: UpdateRequestData = {
        id: initialData.id,
        title,
        summary,
        detailDescription,
        budget,
        duration,
      };
      onSubmit(updateData);
    } else {
      const createData: CreateRequestData = {
        title,
        summary,
        detailDescription,
        budget,
        duration,
      };
      onSubmit(createData);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label htmlFor="request-title" className="mb-2 block text-sm font-medium">Title<span className="text-red-500">*</span></label>
          {errors.title && (
            <div className="mb-2 rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700">{errors.title}</div>
          )}
          <Input
            id="request-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="Request title"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="request-summary" className="mb-2 block text-sm font-medium">Summary<span className="text-red-500">*</span></label>
          {errors.summary && (
            <div className="mb-2 rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700">{errors.summary}</div>
          )}
          <Textarea
            id="request-summary"
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              if (errors.summary) setErrors((prev) => ({ ...prev, summary: undefined }));
            }}
            placeholder="Brief summary of your request..."
            className="min-h-[100px] w-full"
          />
        </div>

        <div>
          <label htmlFor="request-description" className="mb-2 block text-sm font-medium">Description<span className="text-red-500">*</span></label>
          {errors.detailDescription && (
            <div className="mb-2 rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700">{errors.detailDescription}</div>
          )}
          <Editor
            value={detailDescription}
            onChange={(value) => {
              setDetailDescription(value);
              if (errors.detailDescription) setErrors((prev) => ({ ...prev, detailDescription: undefined }));
            }}
            placeholder="Description for your request with rich formatting..."
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Budget (VND)<span className="text-red-500">*</span></label>
          {(errors.budgetMin || errors.budgetMax) && (
            <div className="mb-2 rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700">
              {errors.budgetMin || errors.budgetMax}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget-min" className="mb-1 block text-xs text-gray-500">Minimum Budget<span className="text-red-500">*</span></label>
              <Input
                id="budget-min"
                type="text"
                value={budgetMin}
                onChange={(e) => {
                  const formattedValue = formatCurrency(e.target.value);
                  setBudgetMin(formattedValue);

                  // Clear error when user types
                  if (errors.budgetMin) setErrors((prev) => ({ ...prev, budgetMin: undefined }));

                  // Auto-update max if it's less than min
                  const minValue = parseCurrency(formattedValue);
                  const maxValue = parseCurrency(budgetMax);
                  if (maxValue > 0 && maxValue < minValue) {
                    setBudgetMax(formattedValue);
                  }
                }}
                placeholder="0"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="budget-max" className="mb-1 block text-xs text-gray-500">Maximum Budget<span className="text-red-500">*</span></label>
              <Input
                id="budget-max"
                type="text"
                value={budgetMax}
                onChange={(e) => {
                  const formattedValue = formatCurrency(e.target.value);
                  setBudgetMax(formattedValue);

                  // Clear error when user types
                  if (errors.budgetMax) setErrors((prev) => ({ ...prev, budgetMax: undefined }));
                }}
                placeholder="0"
                className="w-full"
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Set your budget range (minimum 1,000 VND). If you have a fixed budget, use the same value for both minimum
            and maximum.
          </p>
        </div>

        <div>
          <label htmlFor="request-duration" className="mb-2 block text-sm font-medium">Duration (days)<span className="text-red-500">*</span></label>
          {errors.duration && (
            <div className="mb-2 rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700">{errors.duration}</div>
          )}
          <Input
            id="request-duration"
            type="number"
            value={duration}
            onChange={(e) => {
              const newDuration = parseInt(e.target.value, 10);
              if (!isNaN(newDuration) && newDuration >= 1) {
                setDuration(newDuration);
                if (errors.duration) setErrors((prev) => ({ ...prev, duration: undefined }));
              } else if (e.target.value === "") {
                setDuration(0);
              }
            }}
            placeholder="Enter duration in days"
            className="w-full"
          />
          <p className="mt-1 text-xs text-gray-500">Duration must be at least 1 day.</p>
        </div>
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="ekofy">
            {mode === "create" ? "Submit" : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
