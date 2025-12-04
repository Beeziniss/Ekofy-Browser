import { getQueryClient } from "@/providers/get-query-client";
import { adminUserDetailOptions } from "@/gql/options/admin-options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AdminUserDetailView } from "@/modules/admin/user-management/ui/views";

interface UserDetailPageProps {
  params: Promise<{ userId: string }>;
}

const UserDetailPage = async ({ params }: UserDetailPageProps) => {
  const { userId } = await params;
  const queryClient = getQueryClient();

  // Prefetch user details
  await queryClient.prefetchQuery(adminUserDetailOptions(userId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUserDetailView userId={userId} />
    </HydrationBoundary>
  );
};

export default UserDetailPage;
