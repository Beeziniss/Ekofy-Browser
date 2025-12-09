import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CategoryDetailView } from "@/modules/admin/category/ui/views";
import { categoryDetailQueryOptions } from "@/gql/options/category-options";

interface CategoryDetailPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const CategoryDetailPage = async ({ params }: CategoryDetailPageProps) => {
  const queryClient = getQueryClient();
  const resolvedParams = await params;
  const categoryId = resolvedParams.categoryId;

  // Prefetch category detail
  await queryClient.prefetchQuery(categoryDetailQueryOptions(categoryId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryDetailView categoryId={categoryId} />
    </HydrationBoundary>
  );
};

export default CategoryDetailPage;
