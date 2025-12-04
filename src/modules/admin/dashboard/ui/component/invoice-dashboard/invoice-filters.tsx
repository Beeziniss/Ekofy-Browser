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
  return (
    <div className="flex gap-4">
      {/* Invoice Type Filter */}
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="service">Service</SelectItem>
          <SelectItem value="subscription">Subscription</SelectItem>
        </SelectContent>
      </Select>

      {/* Payment Status Filter */}
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Status" />
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
