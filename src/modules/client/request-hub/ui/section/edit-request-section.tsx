"use client";

import { RequestForm } from "../component";
import { UpdateRequestData } from "@/types/request-hub";

interface EditRequestSectionProps {
  initialData: {
    id: string;
    title: string;
    description: string;
    duration: string;
  };
  onSubmit: (data: UpdateRequestData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function EditRequestSection({ initialData, onSubmit, onCancel }: EditRequestSectionProps) {
  const handleSubmit = (data: { title: string; description: string; duration: string; attachments: File[] }) => {
    onSubmit({
      id: initialData.id,
      title: data.title,
      description: data.description,
      duration: data.duration,
      attachments: data.attachments,
    });
  };

  return (
    <RequestForm 
      mode="edit" 
      initialData={initialData}
      onSubmit={handleSubmit} 
      onCancel={onCancel}
    />
  );
}