"use client";

import React, { useState } from "react";
import DeleteConfirmModal from "../component/delete-package-service/delete-confirm-modal";
import ProgressModal from "../component/delete-package-service/progress-modal";
import { usePackageOperations } from "../../hooks/use-package-operations";

interface DeletePackageServiceSectionProps {
  packageId: string;
  packageName: string;
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const DeletePackageServiceSection: React.FC<DeletePackageServiceSectionProps> = ({
  packageId,
  packageName,
  onSuccess,
  onCancel,
  isOpen,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deletePackage } = usePackageOperations();

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    
    deletePackage(packageId, {
      onSuccess: () => {
        setIsDeleting(false);
        onSuccess();
      },
      onError: () => {
        setIsDeleting(false);
      },
    });
  };

  if (isDeleting) {
    return (
      <ProgressModal
        isOpen={true}
        title="Deleting package..."
        description="Please wait while the package is being deleted."
        onIgnore={() => {
          setIsDeleting(false);
          onCancel();
        }}
        onCancel={() => {
          setIsDeleting(false);
          onCancel();
        }}
      />
    );
  }

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onConfirm={handleConfirmDelete}
      onCancel={onCancel}
      title={`Delete "${packageName}"`}
      description="This action cannot be undone. This will permanently delete the package and all associated data."
      action="delete"
    />
  );
};

export default DeletePackageServiceSection;
