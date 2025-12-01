"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@/modules/shared/ui/components/editor";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { CreateRequestData, UpdateRequestData, RequestBudget } from "@/types/request-hub";

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
  onDelete?: () => void;
}

export function RequestForm({ mode, initialData, onSubmit, onCancel, onDelete }: RequestFormProps) {
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const [durationError, setDurationError] = useState("");

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

    const budgetMinNumber = parseCurrency(budgetMin);
    const budgetMaxNumber = parseCurrency(budgetMax) || budgetMinNumber;

    // Validation: minimum budget should be at least 1000 VND
    if (budgetMinNumber < 1000) {
      setBudgetError("Minimum budget must be at least 1,000 VND");
      return;
    }

    // Validation: max should be >= min
    if (budgetMaxNumber < budgetMinNumber) {
      setBudgetError("Maximum budget must be greater than or equal to minimum budget");
      return;
    }

    // Validation: duration is required
    if (!duration || duration < 0) {
      setDurationError("Please indicate a valid duration of at least 1 day.");
      return;
    }

    // Clear error if validation passes
    setBudgetError("");

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
      <div className="mb-8">
        <h1 className="mb-2 text-center text-2xl font-bold">Request Hub</h1>
        {mode === "edit" && initialData?.id && onDelete && (
          <div className="flex justify-end">
            <Button type="button" variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Title<span className="text-red-500">*</span></label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Request title"
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Summary<span className="text-red-500">*</span></label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief summary of your request..."
            className="min-h-[100px] w-full"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Detailed Description<span className="text-red-500">*</span></label>
          <Editor
            value={detailDescription}
            onChange={setDetailDescription}
            placeholder="Detailed description for your request with rich formatting..."
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Budget (VND)<span className="text-red-500">*</span></label>
          {budgetError && (
            <div className="mb-2 rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700">{budgetError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Minimum Budget<span className="text-red-500">*</span></label>
              <Input
                type="text"
                value={budgetMin}
                onChange={(e) => {
                  const formattedValue = formatCurrency(e.target.value);
                  setBudgetMin(formattedValue);

                  // Clear error when user types
                  if (budgetError) setBudgetError("");

                  // Auto-update max if it's less than min
                  const minValue = parseCurrency(formattedValue);
                  const maxValue = parseCurrency(budgetMax);
                  if (maxValue > 0 && maxValue < minValue) {
                    setBudgetMax(formattedValue);
                  }
                }}
                placeholder="0"
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Maximum Budget<span className="text-red-500">*</span></label>
              <Input
                type="text"
                value={budgetMax}
                onChange={(e) => {
                  const formattedValue = formatCurrency(e.target.value);
                  setBudgetMax(formattedValue);

                  // Clear error when user types
                  if (budgetError) setBudgetError("");

                  // Real-time validation
                  const minValue = parseCurrency(budgetMin);
                  const maxValue = parseCurrency(formattedValue);
                  if (minValue > 0 && minValue < 1000) {
                    setBudgetError("Minimum budget must be at least 1,000 VND");
                  } else if (maxValue > 0 && maxValue < minValue) {
                    setBudgetError("Maximum budget must be greater than or equal to minimum budget");
                  }
                }}
                placeholder="0"
                className="w-full"
                required
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Set your budget range (minimum 1,000 VND). If you have a fixed budget, use the same value for both minimum
            and maximum.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Duration (days)<span className="text-red-500">*</span></label>
          {durationError && (
            <div className="mb-2 rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700">{durationError}</div>
          )}
          <Input
            type="number"
            value={duration}
            onChange={(e) => {
              const newDuration = parseInt(e.target.value, 10);
              if (!isNaN(newDuration) && newDuration >= 1) {
                setDuration(newDuration);
                setDurationError("");
              } else {
              setDurationError("Duration must be at least 1 day.");
              }
            }}
            placeholder="Enter duration in days"
            className="w-full"
            required
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          if (onDelete) {
            onDelete();
          }
        }}
      />
    </div>
  );
}
