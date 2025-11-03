"use client";

import { RequestForm } from "../component";
import { CreateRequestData } from "@/types/request-hub";

interface CreateRequestSectionProps {
  onSubmit: (data: CreateRequestData) => void;
  onCancel?: () => void;
}

export function CreateRequestSection({ onSubmit, onCancel }: CreateRequestSectionProps) {
  const handleSubmit = (data: CreateRequestData) => {
    onSubmit(data);
  };

  return <RequestForm mode="create" onSubmit={handleSubmit} onCancel={onCancel} />;
}