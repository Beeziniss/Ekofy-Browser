"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { myRequestsOptions } from "@/gql/options/client-options";
import { useCreateRequest, useUpdateRequest, useDeleteRequest } from "@/gql/client-mutation-options/request-hub-mutation-options";
import { RequestHubLayout } from "../layout";
import { CreateRequestSection, ViewRequestSection, EditRequestSection } from "../section";
import { Pagination } from "../component";
import { CreateRequestData, UpdateRequestData } from "@/types/request-hub";
import { RequestsQuery, RequestStatus as GqlRequestStatus } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthDialogProvider } from "../context/auth-dialog-context";

type RequestHubMode = 'view' | 'create' | 'edit' | 'detail';

type RequestItem = NonNullable<NonNullable<RequestsQuery['requests']>['items']>[0];

export function MyRequestsView() {
  const [mode, setMode] = useState<RequestHubMode>('view');
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<GqlRequestStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const router = useRouter();
  const { user } = useAuthStore();

  // Fetch requests with pagination
  const skip = (currentPage - 1) * pageSize;
  const where = {
    ...(searchValue && { title: { contains: searchValue } }),
    ...(statusFilter !== 'ALL' && { status: { eq: statusFilter } }),
    // Filter by current user's requests only
    ...(user?.userId && { requestUserId: { eq: user.userId } }),
  };
  
  const { data: requestsData, isLoading } = useQuery(myRequestsOptions(skip, pageSize, where));
  const requests = requestsData?.items || [];
  const totalItems = requestsData?.totalCount || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Mutations
  const createRequestMutation = useCreateRequest();
  const updateRequestMutation = useUpdateRequest();
  const deleteRequestMutation = useDeleteRequest();

  // Display requests (filtering already handled by query)
  const displayRequests = requests;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, statusFilter]);

  const handlePostRequest = () => {
    setMode('create');
  };

  const handleBrowseArtists = () => {
    router.push('/hire-artists');
  };

  const handleBackToHub = () => {
    router.push('/request-hub');
  };

  const handleViewDetails = (id: string) => {
    // Navigate to the detail page instead of changing mode
    router.push(`/request-hub/${id}`);
  };

  const handleEdit = (id: string) => {
    const request = requests.find((r: RequestItem) => r.id === id);
    if (request) {
      setEditingRequest(request);
      setMode('edit');
    }
  };

  const handleApply = (id: string) => {
    console.log('Apply to request:', id);
    toast.info('Application feature coming soon!');
  };

  const handleSave = (id: string) => {
    console.log('Save request:', id);
    toast.info('Bookmark feature coming soon!');
  };

  const handleCancel = () => {
    setMode('view');
    setEditingRequest(null);
  };

  const handleCreateSubmit = async (data: CreateRequestData) => {
    try {
      await createRequestMutation.mutateAsync(data);
      toast.success('Request created successfully!');
      setMode('view');
    } catch (error) {
      toast.error('Failed to create request');
      console.error('Create request error:', error);
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
          status: data.status === 'OPEN' ? GqlRequestStatus.Open :
                  data.status === 'CLOSED' ? GqlRequestStatus.Closed :
                  data.status === 'BLOCKED' ? GqlRequestStatus.Blocked :
                  data.status === 'DELETED' ? GqlRequestStatus.Deleted :
                  undefined
        }),
      };
      
      await updateRequestMutation.mutateAsync(updateInput);
      toast.success('Request updated successfully!');
      setMode('view');
      setEditingRequest(null);
    } catch (error) {
      toast.error('Failed to update request');
      console.error('Update request error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!editingRequest) return;
      
      const deleteInput = {
        id: editingRequest.id,
        title: editingRequest.title,
        summary: editingRequest.summary,
        detailDescription: editingRequest.detailDescription,
        budget: editingRequest.budget,
        deadline: editingRequest.deadline instanceof Date ? editingRequest.deadline.toISOString() : editingRequest.deadline,
      };
      
      await deleteRequestMutation.mutateAsync(deleteInput);
      toast.success('Request deleted successfully!');
      setMode('view');
      setEditingRequest(null);
    } catch (error) {
      toast.error('Failed to delete request');
      console.error('Delete request error:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Please login to view your requests</div>
      </div>
    );
  }

  // Check if user is listener - only listeners can access my requests
  if (user.role !== UserRole.LISTENER) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>Only listeners can access request management features.</p>
          <p className="mt-4">
            <button 
              onClick={() => router.push('/request-hub')} 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Go back to Request Hub
            </button>
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (mode) {
      case 'create':
        return (
          <CreateRequestSection 
            onSubmit={handleCreateSubmit}
            onCancel={handleCancel}
          />
        );
      case 'edit':
        return editingRequest ? (
          <EditRequestSection
            initialData={{
              id: editingRequest.id,
              title: editingRequest.title,
              summary: editingRequest.summary,
              detailDescription: editingRequest.detailDescription,
              budget: editingRequest.budget,
              deadline: editingRequest.deadline
            }}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        ) : null;
      case 'view':
      default:
        return (
          <AuthDialogProvider>
            <RequestHubLayout
              onPostRequest={handlePostRequest}
              onBrowseArtists={handleBrowseArtists}
              onMyRequests={handleBackToHub}
              myRequestsButtonText="Back to Hub"
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            >
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-white">Filter by status:</span>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as GqlRequestStatus | 'ALL')}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
                      <SelectItem value={GqlRequestStatus.Open}>Open</SelectItem>
                      <SelectItem value={GqlRequestStatus.Closed}>Closed</SelectItem>
                      <SelectItem value={GqlRequestStatus.Blocked}>Blocked</SelectItem>
                      <SelectItem value={GqlRequestStatus.Deleted}>Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ViewRequestSection
                requests={displayRequests}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
                onEdit={handleEdit}
                onSave={handleSave}
              />
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                  totalItems={totalItems}
                  itemsPerPage={pageSize}
                />
              )}
            </RequestHubLayout>
          </AuthDialogProvider>
        );
    }
  };

  return <>{renderContent()}</>;
}