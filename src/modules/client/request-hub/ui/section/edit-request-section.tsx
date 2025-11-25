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
    duration: number;
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

  // Convert duration to number if needed
  const processedInitialData = {
    ...initialData,
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
