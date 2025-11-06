"use client";

import { RequestForm } from "../component";
import { UpdateRequestData, CreateRequestData, RequestBudget } from "@/types/request-hub";

interface EditRequestSectionProps {
  initialData: {
    id: string;
    title: string;
    summary: string;
    detailDescription: string;
    budget: RequestBudget;
    deadline: Date | string;
  };
  onSubmit: (data: UpdateRequestData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function EditRequestSection({ initialData, onSubmit, onCancel, onDelete }: EditRequestSectionProps) {
  const handleSubmit = (data: CreateRequestData | UpdateRequestData) => {
    onSubmit(data as UpdateRequestData);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  // Convert deadline to Date if it's a string
  const processedInitialData = {
    ...initialData,
    deadline: typeof initialData.deadline === "string" ? new Date(initialData.deadline) : initialData.deadline,
  };

  return (
    <RequestForm
      mode="edit"
      initialData={processedInitialData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onDelete={handleDelete}
    />
  );
}
