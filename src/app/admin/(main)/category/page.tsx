import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CategoryView } from "@/modules/admin/category/ui/views";
import { categoriesQueryOptions } from "@/gql/options/category-options";

const CategoryPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch the first page of categories
  await queryClient.prefetchQuery(categoriesQueryOptions(0, 10, undefined));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryView />
    </HydrationBoundary>
  );
};

export default CategoryPage;
