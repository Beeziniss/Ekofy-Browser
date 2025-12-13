"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminPaymentTransactions,
  useAdminPayoutTransactions,
  useAdminRefundTransactions,
} from "../../hooks";
import {
  TransactionTable,
  TransactionFilters,
  PayoutTransactionTable,
  PayoutTransactionFilters,
  RefundTransactionTable,
  RefundTransactionFilters,
} from "../components";

export function TransactionListSection() {
  const [activeTab, setActiveTab] = useState("payment");

  // Payment transactions
  const {
    transactions: paymentTransactions,
    totalCount: paymentTotalCount,
    isLoading: isLoadingPayment,
    isError: isErrorPayment,
    page: paymentPage,
    pageSize: paymentPageSize,
    searchTerm: paymentSearchTerm,
    statusFilter: paymentStatusFilter,
    setPage: setPaymentPage,
    setSearchTerm: setPaymentSearchTerm,
    setStatusFilter: setPaymentStatusFilter,
  } = useAdminPaymentTransactions();

  // Payout transactions
  const {
    transactions: payoutTransactions,
    totalCount: payoutTotalCount,
    isLoading: isLoadingPayout,
    isError: isErrorPayout,
    page: payoutPage,
    pageSize: payoutPageSize,
    searchTerm: payoutSearchTerm,
    statusFilter: payoutStatusFilter,
    setPage: setPayoutPage,
    setSearchTerm: setPayoutSearchTerm,
    setStatusFilter: setPayoutStatusFilter,
  } = useAdminPayoutTransactions();

  // Refund transactions
  const {
    transactions: refundTransactions,
    totalCount: refundTotalCount,
    isLoading: isLoadingRefund,
    isError: isErrorRefund,
    page: refundPage,
    pageSize: refundPageSize,
    searchTerm: refundSearchTerm,
    statusFilter: refundStatusFilter,
    setPage: setRefundPage,
    setSearchTerm: setRefundSearchTerm,
    setStatusFilter: setRefundStatusFilter,
  } = useAdminRefundTransactions();

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="payment" className="data-[state=active]:bg-gray-700">
            Payment Transactions
          </TabsTrigger>
          <TabsTrigger value="payout" className="data-[state=active]:bg-gray-700">
            Payout Transactions
          </TabsTrigger>
          <TabsTrigger value="refund" className="data-[state=active]:bg-gray-700">
            Refund Transactions
          </TabsTrigger>
        </TabsList>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4" forceMount={activeTab === "payment" ? undefined : true}>
          <div className={activeTab !== "payment" ? "hidden" : ""}>
            <TransactionFilters
              searchTerm={paymentSearchTerm}
              onSearchChange={setPaymentSearchTerm}
              statusFilter={paymentStatusFilter}
              onStatusChange={setPaymentStatusFilter}
            />
            <TransactionTable
              transactions={paymentTransactions}
              isLoading={isLoadingPayment}
              isError={isErrorPayment}
              page={paymentPage}
              pageSize={paymentPageSize}
              totalCount={paymentTotalCount}
              onPageChange={setPaymentPage}
            />
          </div>
        </TabsContent>

        {/* Payout Tab */}
        <TabsContent value="payout" className="space-y-4" forceMount={activeTab === "payout" ? undefined : true}>
          <div className={activeTab !== "payout" ? "hidden" : ""}>
            <PayoutTransactionFilters
              searchTerm={payoutSearchTerm}
              onSearchChange={setPayoutSearchTerm}
              statusFilter={payoutStatusFilter}
              onStatusChange={setPayoutStatusFilter}
            />
            <PayoutTransactionTable
              transactions={payoutTransactions}
              isLoading={isLoadingPayout}
              isError={isErrorPayout}
              page={payoutPage}
              pageSize={payoutPageSize}
              totalCount={payoutTotalCount}
              onPageChange={setPayoutPage}
            />
          </div>
        </TabsContent>

        {/* Refund Tab */}
        <TabsContent value="refund" className="space-y-4" forceMount={activeTab === "refund" ? undefined : true}>
          <div className={activeTab !== "refund" ? "hidden" : ""}>
            <RefundTransactionFilters
              searchTerm={refundSearchTerm}
              onSearchChange={setRefundSearchTerm}
              statusFilter={refundStatusFilter}
              onStatusChange={setRefundStatusFilter}
            />
            <RefundTransactionTable
              transactions={refundTransactions}
              isLoading={isLoadingRefund}
              isError={isErrorRefund}
              page={refundPage}
              pageSize={refundPageSize}
              totalCount={refundTotalCount}
              onPageChange={setRefundPage}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
