"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { FingerprintTable } from "../components/fingerprint-table";
import { EditFingerprintDialog } from "../components/edit-fingerprint-dialog";
import { fingerprintConfidencePolicyOptions } from "@/gql/options/fingerprint-options";

export function FingerprintListSection() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: policy, isLoading, refetch } = useQuery(
    fingerprintConfidencePolicyOptions()
  );

  const handleEditSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div></div>
        {policy && (
          <Button onClick={() => setIsEditDialogOpen(true)} className="ml-auto md:ml-0">
            <Edit className="mr-2 h-4 w-4" />
            Edit Policy
          </Button>
        )}
      </div>

      {/* Table */}
      <FingerprintTable
        policy={policy || null}
        isLoading={isLoading}
      />

      {/* Edit Dialog */}
      <EditFingerprintDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        policy={policy || null}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

