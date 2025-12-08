"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryDetailHeader } from "../components/category-detail-header";
import { CategoryDetailCard } from "../components/category-detail-card";
import { EditCategoryDialog } from "../components/edit-category-dialog";
import { useCategoryDetail } from "../../hooks";
import { useSoftDeleteCategoryMutation } from "@/gql/client-mutation-options/category-mutation-options";

interface CategoryDetailSectionProps {
  categoryId: string;
}

export function CategoryDetailSection({ categoryId }: CategoryDetailSectionProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { category, isLoading, refetch } = useCategoryDetail(categoryId);
  const deleteMutation = useSoftDeleteCategoryMutation();

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    deleteMutation.mutate(categoryId, {
      onSuccess: () => {
        router.push("/admin/category");
      },
    });
  };

  const handleEditSuccess = () => {
    refetch();
  };

  return (
    <>
      <div className="space-y-6">
        <CategoryDetailHeader
          categoryName={category?.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <CategoryDetailCard category={category} isLoading={isLoading} />
      </div>

      {category && (
        <EditCategoryDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          category={category}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
