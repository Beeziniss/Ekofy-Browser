"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryActions } from "../components/category-actions";
import { CategoryFiltersComponent } from "../components/category-filters";
import { CategoryTable } from "../components/category-table";
import { CreateCategoryDialog } from "../components/create-category-dialog";
import { EditCategoryDialog } from "../components/edit-category-dialog";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useCategories } from "../../hooks";
import { Category } from "@/types/category";
import { useSoftDeleteCategoryMutation } from "@/gql/client-mutation-options/category-mutation-options";

export function CategoryListSection() {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const {
    categories,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    filters,
    handlePageChange,
    handleFilterChange,
    resetFilters,
    refetch,
  } = useCategories();

  const deleteMutation = useSoftDeleteCategoryMutation();

  const handleView = (categoryId: string) => {
    router.push(`/admin/category/${categoryId}`);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    deleteMutation.mutate(categoryId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  const handleEditSuccess = () => {
    refetch();
  };

  return (
    <>
      <div className="space-y-6">
        <CategoryActions onCreateCategory={() => setIsCreateDialogOpen(true)} />

        <CategoryFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Showing {categories.length} of {totalCount} categories
            </p>
          </div>

          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <div className="flex justify-center">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      <EditCategoryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={selectedCategory}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
