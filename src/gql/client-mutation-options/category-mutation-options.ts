import {
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
  SOFT_DELETE_CATEGORY_MUTATION,
} from "@/modules/shared/mutations/admin/category-mutaion";
import { execute } from "@/gql/execute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseGraphQLError } from "@/utils/graphql-error-utils";
import type { CreateCategoryRequestInput, UpdateCategoryRequestInput } from "@/gql/graphql";

// Mutation for creating a new category
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; type: string; description: string }) => {
      const result = await execute(CREATE_CATEGORY_MUTATION, {
        categoryRequest: input as CreateCategoryRequestInput,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: Error) => {
      const errorHelper = parseGraphQLError(error, "Failed to create category");
      toast.error(errorHelper.detail);
    },
  });
};

// Mutation for updating an existing category
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<UpdateCategoryRequestInput> & { categoryId: string }) => {
      const result = await execute(UPDATE_CATEGORY_MUTATION, {
        updateCategoryRequest: input as UpdateCategoryRequestInput,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: Error) => {
      const errorHelper = parseGraphQLError(error, "Failed to update category");
      toast.error(errorHelper.detail);
    },
  });
};

// Mutation for soft deleting a category
export const useSoftDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryId: string) => {
      const result = await execute(SOFT_DELETE_CATEGORY_MUTATION, {
        categoryId,
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      const errorHelper = parseGraphQLError(error, "Failed to delete category");
      toast.error(errorHelper.detail);
    },
  });
};
