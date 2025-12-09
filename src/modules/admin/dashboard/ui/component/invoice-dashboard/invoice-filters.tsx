"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentTransactionStatus } from "@/gql/graphql";

interface InvoiceFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function InvoiceFilters({
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
}: InvoiceFiltersProps) {
  const getTypeLabel = (value: string) => {
    switch (value) {
      case "service": return "Service";
      case "subscription": return "Subscription";
      default: return "All Types";
    }
  };

  const getStatusLabel = (value: string) => {
    switch (value) {
      case PaymentTransactionStatus.Paid: return "Paid";
      case PaymentTransactionStatus.Pending: return "Pending";
      case PaymentTransactionStatus.Unpaid: return "Unpaid";
      default: return "All Status";
    }
  };

  const handleTypeChange = (value: string) => {
    onTypeChange(value);
  };

  const handleStatusChange = (value: string) => {
    onStatusChange(value);
  };

  return (
    <div className="flex gap-4">
      {/* Invoice Type Filter */}
      <Select value={selectedType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            {getTypeLabel(selectedType)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="service">Service</SelectItem>
          <SelectItem value="subscription">Subscription</SelectItem>
        </SelectContent>
      </Select>

      {/* Payment Status Filter */}
      <Select value={selectedStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            {getStatusLabel(selectedStatus)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value={PaymentTransactionStatus.Paid}>Paid</SelectItem>
          <SelectItem value={PaymentTransactionStatus.Pending}>Pending</SelectItem>
          <SelectItem value={PaymentTransactionStatus.Unpaid}>Unpaid</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
