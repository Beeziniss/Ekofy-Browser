"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { requestHubOptions } from "@/gql/options/client-options";
import { useCreateRequest, useUpdateRequest } from "@/gql/client-mutation-options/request-hub-mutation-options";
import { RequestHubLayout } from "../layout";
import { CreateRequestSection, ViewRequestSection, EditRequestSection } from "../section";
import { RequestDetailView, Pagination, StripeAccountRequiredModal } from "../component";
import { CreateRequestData, UpdateRequestData } from "@/types/request-hub";
import { RequestsQuery, RequestStatus as GqlRequestStatus } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthDialogProvider } from "../context/auth-dialog-context";
import { useStripeAccountStatus } from "@/hooks/use-stripe-account-status";
import { useAuthStore } from "@/store";

type RequestHubMode = "view" | "create" | "edit" | "detail";

type RequestItem = NonNullable<NonNullable<RequestsQuery["requests"]>["items"]>[0];

export function RequestHubView() {
  const [mode, setMode] = useState<RequestHubMode>("view");
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const router = useRouter();

  // Auth and Stripe status
  const { isAuthenticated } = useAuthStore();
  const { isArtist, hasStripeAccount } = useStripeAccountStatus();

  // Fetch requests with pagination
  const { data: requestsData, isLoading } = useQuery(
    requestHubOptions((currentPage - 1) * pageSize, pageSize, {
      status: { eq: GqlRequestStatus.Open },
    }),
  );
  const requests = requestsData?.items || [];
  const totalCount = requestsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Mutations
  const createRequestMutation = useCreateRequest();
  const updateRequestMutation = useUpdateRequest();

  // Filter requests based on search (already filtered to OPEN by query)
  const filteredRequests = requests.filter(
    (request: RequestItem) =>
      request.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      request.summary.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handlePostRequest = () => {
    setMode("create");
  };

  const handleBrowseArtists = () => {
    router.push("/hire-artists");
  };

  const handleMyRequests = () => {
    router.push("/request-hub/my-requests");
  };

  const handleViewDetails = (id: string) => {
    // Navigate to the detail page instead of changing mode
    router.push(`/request-hub/${id}`);
  };

  const handleEdit = (id: string) => {
    const request = requests.find((r: RequestItem) => r.id === id);
    if (request) {
      setEditingRequest(request);
      setMode("edit");
    }
  };

  const handleApply = (id: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.info("Please sign in to apply for requests");
      return;
    }

    // Check if user is artist and has stripe account
    if (isArtist && !hasStripeAccount) {
      setShowStripeModal(true);
      return;
    }

    // Only allow artists to apply
    if (isArtist) {
      console.log("Apply to request:", id);
      toast.info("Application feature coming soon!");
    } else {
      toast.info("Only artists can apply to requests");
    }
  };

  const handleSave = (id: string) => {
    console.log("Save request:", id);
    toast.info("Bookmark feature coming soon!");
  };

  const handleBackToList = () => {
    setMode("view");
    setSelectedRequest(null);
    setEditingRequest(null);
  };

  const handleContactClient = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.info("Please sign in to contact clients");
      return;
    }

    // Check if user is artist and has stripe account
    if (isArtist && !hasStripeAccount) {
      setShowStripeModal(true);
      return;
    }

    // Only allow artists to contact client
    if (isArtist) {
      console.log("Contact client");
      toast.info("Contact feature coming soon!");
    } else {
      toast.info("Only artists can contact clients");
    }
  };

  const handleCreateSubmit = async (data: CreateRequestData) => {
    try {
      await createRequestMutation.mutateAsync(data);
      toast.success("Request created successfully!");
      setMode("view");
    } catch (error) {
      toast.error("Failed to create request");
      console.error("Create request error:", error);
    }
  };

  const handleUpdateSubmit = async (data: UpdateRequestData) => {
    try {
      // Convert to GraphQL input format
      const updateInput = {
        id: data.id,
        title: data.title,
        summary: data.summary,
        detailDescription: data.detailDescription,
        budget: data.budget,
        deadline: data.deadline instanceof Date ? data.deadline.toISOString() : data.deadline,
        // Convert local enum to GraphQL enum if status exists
        ...(data.status && {
          status:
            data.status === "OPEN"
              ? GqlRequestStatus.Open
              : data.status === "CLOSED"
                ? GqlRequestStatus.Closed
                : data.status === "BLOCKED"
                  ? GqlRequestStatus.Blocked
                  : data.status === "DELETED"
                    ? GqlRequestStatus.Deleted
                    : undefined,
        }),
      };

      await updateRequestMutation.mutateAsync(updateInput);
      toast.success("Request updated successfully!");
      setMode("view");
      setEditingRequest(null);
    } catch (error) {
      toast.error("Failed to update request");
      console.error("Update request error:", error);
    }
  };

  const handleCancel = () => {
    setMode("view");
    setEditingRequest(null);
  };

  const renderContent = () => {
    switch (mode) {
      case "create":
        return <CreateRequestSection onSubmit={handleCreateSubmit} onCancel={handleCancel} />;
      case "edit":
        return editingRequest ? (
          <EditRequestSection
            initialData={{
              id: editingRequest.id,
              title: editingRequest.title,
              summary: editingRequest.summary,
              detailDescription: editingRequest.detailDescription,
              budget: editingRequest.budget,
              deadline: editingRequest.deadline,
            }}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCancel}
          />
        ) : null;
      case "detail":
        return selectedRequest ? (
          <RequestDetailView
            request={selectedRequest}
            onBack={handleBackToList}
            onApply={() => handleApply(selectedRequest.id)}
            onContactClient={handleContactClient}
          />
        ) : null;
      case "view":
      default:
        return (
          <AuthDialogProvider>
            <RequestHubLayout
              onPostRequest={handlePostRequest}
              onBrowseArtists={handleBrowseArtists}
              onMyRequests={handleMyRequests}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            >
              <ViewRequestSection
                requests={filteredRequests}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
                onEdit={handleEdit}
                onSave={handleSave}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </RequestHubLayout>
          </AuthDialogProvider>
        );
    }
  };

  return (
    <>
      {renderContent()}
      
      {/* Stripe Account Required Modal */}
      <StripeAccountRequiredModal
        open={showStripeModal}
        onOpenChange={setShowStripeModal}
        onCancel={() => setShowStripeModal(false)}
      />
    </>
  );
}
