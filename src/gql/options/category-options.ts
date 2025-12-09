import { execute } from '@/gql/execute';
import { CATEGORY_QUERIES, CATEGORY_QUERIES_DETAIL } from "@/modules/shared/queries/admin/category-queries";
import { CategoryFilterInput, CategoriesAdminQuery, CategorySortInput } from '../graphql';

type Category = NonNullable<
  NonNullable<CategoriesAdminQuery["categories"]>["items"]
>[number];

export const categoriesQueryOptions = (skip: number, take: number, where?: CategoryFilterInput, order?: CategorySortInput ) => ({
  queryKey: ["categories", skip, take, where, order],
  queryFn: async () => {
    const result = await execute(CATEGORY_QUERIES, { skip, take, where, order });
    return result.categories || {
      items: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

export const categoryDetailQueryOptions = (categoryId: string) => ({
  queryKey: ["category", categoryId],
  queryFn: async () => {
    const result = await execute(CATEGORY_QUERIES_DETAIL, { 
      where: { id: { eq: categoryId } } 
    });
    return result.categories?.items?.[0] || null;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Helper functions for category filtering
export const getVisibleCategories = (categories: Category[]) => {
  return categories.filter((c) => c.isVisible);
};

export const getHiddenCategories = (categories: Category[]) => {
  return categories.filter((c) => !c.isVisible);
};

export const getCategoriesByType = (categories: Category[], type: string) => {
  return categories.filter((c) => c.type === type);
};

export const searchCategories = (categories: Category[], searchTerm: string) => {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return categories.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerSearchTerm) ||
      c.slug?.toLowerCase().includes(lowerSearchTerm) ||
      c.description?.toLowerCase().includes(lowerSearchTerm)
  );
};
