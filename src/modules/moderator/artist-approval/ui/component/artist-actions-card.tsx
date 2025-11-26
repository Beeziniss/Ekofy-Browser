"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApprovalConfirmModal } from "../component";
import { RejectModal } from "../component";
interface ArtistActionsCardProps {
  artistName: string;
  userId: string;
  onApprove: () => void;
  onReject: (rejectionReason: string) => void;
  // onCancel: () => void;
  isLoading?: boolean;
}

export function ArtistActionsCard({
  artistName,
  // userId,
  onApprove,
  onReject,
  // onCancel,
  isLoading = false,
}: ArtistActionsCardProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApprove = () => {
    onApprove();
    setShowConfirmModal(false);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = (rejectionReason: string) => {
    onReject(rejectionReason);
    setShowRejectModal(false);
  };

  return (
    <>
      <div className="mt-8 flex justify-end space-x-4">
        {/* <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          Cancel
        </Button> */}
        <Button onClick={handleReject} disabled={isLoading} className="bg-red-600 text-white hover:bg-red-700">
          Reject
        </Button>
        <Button onClick={handleApprove} disabled={isLoading} className="bg-green-600 text-white hover:bg-green-700">
          Approve
        </Button>
      </div>

      <ApprovalConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmApprove}
        isLoading={isLoading}
        artistName={artistName}
      />
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        isLoading={isLoading}
        artistName={artistName}
      />
    </>
  );
}
