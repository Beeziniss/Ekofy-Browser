"use client";

import { RequestForm } from "../component";
import { CreateRequestData } from "@/types/request-hub";

interface CreateRequestSectionProps {
  onSubmit: (data: CreateRequestData) => void;
  onCancel?: () => void;
}

export function CreateRequestSection({ onSubmit, onCancel }: CreateRequestSectionProps) {
  const handleSubmit = (data: { title: string; description: string; duration: string; attachments: File[] }) => {
    onSubmit({
      title: data.title,
      description: data.description,
      duration: data.duration,
      attachments: data.attachments,
    });
  };

  return <RequestForm mode="create" onSubmit={handleSubmit} onCancel={onCancel} />;
}