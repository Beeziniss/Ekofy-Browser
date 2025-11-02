"use client";

import { useQuery } from "@tanstack/react-query";
import { listenerInvoicesOptions } from "@/gql/options/listener-activity-options";

export function useListenerInvoices(params: { userId: string; page: number; pageSize?: number }) {
  const { userId, page, pageSize = 10 } = params;
  return useQuery({
    ...listenerInvoicesOptions({ userId, page, pageSize }),
  });
}
