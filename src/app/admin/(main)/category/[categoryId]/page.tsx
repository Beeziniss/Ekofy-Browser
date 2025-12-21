import { CategoryDetailView } from "@/modules/admin/category/ui/views";

interface CategoryDetailPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const CategoryDetailPage = async ({ params }: CategoryDetailPageProps) => {
  const resolvedParams = await params;
  const categoryId = resolvedParams.categoryId;

  return <CategoryDetailView categoryId={categoryId} />;
};

export default CategoryDetailPage;
