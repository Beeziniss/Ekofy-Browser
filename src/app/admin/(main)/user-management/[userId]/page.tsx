import { AdminUserDetailView } from "@/modules/admin/user-management/ui/views";

interface UserDetailPageProps {
  params: Promise<{ userId: string }>;
}

const UserDetailPage = async ({ params }: UserDetailPageProps) => {
  const { userId } = await params;
  return <AdminUserDetailView userId={userId} />;
};

export default UserDetailPage;
