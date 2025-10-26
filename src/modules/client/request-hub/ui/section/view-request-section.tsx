"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { RequestCard, DeleteConfirmModal } from "../component";
import { RequestHubItem } from "@/types/request-hub";

interface ViewRequestSectionProps {
  requests: RequestHubItem[];
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onContact: (id: string) => void;
  onReport: (id: string) => void;
}

export function ViewRequestSection({ 
  requests, 
  onCreateNew, 
  onDelete, 
  onContact, 
  onReport 
}: ViewRequestSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (selectedRequestId) {
      onDelete(selectedRequestId);
      setDeleteModalOpen(false);
      setSelectedRequestId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-8">Request Hub</h1>
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onCreateNew} className="flex items-center space-x-2 bg-black border-2 border-white/30 hover:bg-white/10">
            <Plus className="h-4 w-4 text-white" />
            <span className="text-white">Create</span>
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Request Cards */}
      <div className="space-y-6">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No requests found</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onContact={onContact}
              onReport={onReport}
            />
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}