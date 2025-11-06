"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Editor } from "@/modules/shared/ui/components/editor";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
// import { Card, CardContent } from "@/components/ui/card";
// import { X } from "lucide-react";
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

// const UploadIcon = () => (
//   <svg
//     className="mx-auto h-12 w-12 mb-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <defs>
//       <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//         <stop offset="0%" stopColor="#3B54EA" />
//         <stop offset="100%" stopColor="#AB4EE5" />
//       </linearGradient>
//     </defs>
//     <path
//       d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
//       stroke="url(#uploadGradient)"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// );

interface RequestFormProps {
  mode: "create" | "edit";
  initialData?: Partial<CreateRequestData> & { id?: string; budget?: RequestBudget | number; deadline?: Date | string };
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
        ? initialData.budget.min.toString()
        : initialData.budget.toString()
      : "",
  );
  const [budgetMax, setBudgetMax] = useState(
    initialData?.budget
      ? typeof initialData.budget === "object"
        ? initialData.budget.max.toString()
        : initialData.budget.toString()
      : "",
  );

  const [deadline, setDeadline] = useState<Date | undefined>(
    initialData?.deadline ? new Date(initialData.deadline) : undefined,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  // const [attachments, setAttachments] = useState<File[]>([]);
  // const [isDragOver, setIsDragOver] = useState(false);

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

    // Validation: max should be >= min
    if (budgetMaxNumber < budgetMinNumber) {
      setBudgetError("Maximum budget must be greater than or equal to minimum budget");
      return;
    }

    // Validation: deadline is required
    if (!deadline) {
      alert("Please select a deadline");
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
        deadline,
      };
      onSubmit(updateData);
    } else {
      const createData: CreateRequestData = {
        title,
        summary,
        detailDescription,
        budget,
        deadline,
      };
      onSubmit(createData);
    }
  };

  // const handleFileSelect = (files: FileList | null) => {
  //   if (files) {
  //     setAttachments(prev => [...prev, ...Array.from(files)]);
  //   }
  // };

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setIsDragOver(false);
  //   handleFileSelect(e.dataTransfer.files);
  // };

  // const removeAttachment = (index: number) => {
  //   setAttachments(prev => prev.filter((_, i) => i !== index));
  // };

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
          <label className="mb-2 block text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Request title"
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Summary</label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief summary of your request..."
            className="min-h-[100px] w-full"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Detailed Description</label>
          <Editor
            value={detailDescription}
            onChange={setDetailDescription}
            placeholder="Detailed description for your request with rich formatting..."
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Budget (VND)</label>
          {budgetError && (
            <div className="mb-2 rounded border border-red-400 bg-red-100 p-2 text-sm text-red-700">{budgetError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Minimum Budget</label>
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
              <label className="mb-1 block text-xs text-gray-500">Maximum Budget</label>
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
                  if (maxValue > 0 && maxValue < minValue) {
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
            Set your budget range. If you have a fixed budget, use the same value for both minimum and maximum.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Deadline</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? format(deadline, "dd/MM/yyyy") : "Select deadline"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                disabled={(date) => date < minDate}
                captionLayout="dropdown"
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="mt-1 text-xs text-gray-500">Deadline must be at least 5 days from today</p>
        </div>

        {/* <div>
          <label className="block text-sm font-medium mb-2">Attachment (optional)</label>
          <Card 
            className={`border-2 border-dashed transition-colors ${
              isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <CardContent 
              className="p-12 text-center"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={handleDrop}
            >
              <UploadIcon />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop audio files to get started
              </p>
              <Button 
                type="button" 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'audio/*,image/*';
                  input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files);
                  input.click();
                }}
                className="primary_gradient text-white "
              >
                Choose files
              </Button>
            </CardContent>
          </Card>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div> */}

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
