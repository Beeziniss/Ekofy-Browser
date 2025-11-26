"use client";

import React, { useState } from "react";
// import { useRouter } from "next/navigation";
import PackageServiceLayout from "../layout/package-service-layout";
import ServicePackageListSection from "../section/service-package-list-section";
import CreatePackageServiceSection from "../section/create-package-service-section";
import UpdatePackageServiceSection from "../section/update-package-service-section";
import ServicePackageDetailSection from "../section/service-package-detail-section";
import DeleteConfirmModal from "../component/delete-package-service/delete-confirm-modal";

type ViewMode = "list" | "create" | "edit" | "detail";

const ServicePackageServiceView = () => {
  // const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleCreatePackage = () => {
    setViewMode("create");
  };

  const handleEditPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
    setViewMode("edit");
  };

  // const handleViewDetail = (packageId: string) => {
  //   // Navigate to detail page instead of changing local state
  //   router.push(`/artist/studio/service-package/${packageId}`);
  // };

  const handleDeletePackage = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Delete logic will be handled in section
    setDeleteModalOpen(false);
    if (viewMode !== "list") {
      setViewMode("list");
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedPackageId("");
  };

  const handleSuccess = () => {
    setViewMode("list");
    setSelectedPackageId("");
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case "create":
        return <CreatePackageServiceSection onCancel={handleBackToList} onSuccess={handleSuccess} />;
      case "edit":
        return (
          <UpdatePackageServiceSection
            packageId={selectedPackageId}
            onCancel={handleBackToList}
            onSuccess={handleSuccess}
            onDelete={handleDeletePackage}
          />
        );
      case "detail":
        return (
          <ServicePackageDetailSection
            packageId={selectedPackageId}
            onBack={handleBackToList}
            onEdit={() => handleEditPackage(selectedPackageId)}
            onDelete={handleDeletePackage}
          />
        );
      case "list":
      default:
        return (
          <ServicePackageListSection
            onCreatePackage={handleCreatePackage}
            onEditPackage={handleEditPackage}
            // onViewDetail={handleViewDetail}
          />
        );
    }
  };

  return (
    <PackageServiceLayout>
      {renderCurrentView()}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        action="delete"
      />
    </PackageServiceLayout>
  );
};

export default ServicePackageServiceView;
