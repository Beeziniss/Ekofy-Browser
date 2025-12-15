"use client";

import { RequestForm } from "../component";
import { UpdateRequestData, CreateRequestData, RequestBudget } from "@/types/request-hub";
import { RequestStatus } from "@/gql/graphql";

interface EditRequestSectionProps {
  initialData: {
    id: string;
    title: string;
    summary: string;
    detailDescription: string;
    budget: RequestBudget;
    duration: number;
    status?: RequestStatus;
  };
  onSubmit: (data: UpdateRequestData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function EditRequestSection({ initialData, onSubmit, onCancel, onDelete }: EditRequestSectionProps) {
  // Check if request is closed, blocked, or deleted
  if (initialData.status && initialData.status !== RequestStatus.Open) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">Cannot Edit Request</h2>
          <p className="mb-4">
            {initialData.status === RequestStatus.Closed
              ? "This request has been closed and cannot be edited."
              : initialData.status === RequestStatus.Blocked
              ? "This request has been blocked and cannot be edited."
              : "This request cannot be edited."}
          </p>
          {onCancel && (
            <button onClick={onCancel} className="text-blue-400 underline hover:text-blue-300">
              Go back
            </button>
          )}
        </div>
      </div>
    );
  }

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
