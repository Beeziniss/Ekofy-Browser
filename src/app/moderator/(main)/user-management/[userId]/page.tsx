import { ModeratorUserDetailView } from "@/modules/moderator/user-management/ui/views/moderator-user-detail-view";

interface PageProps {
  params: Promise<{ userId: string }>;
}

const ModeratorUserDetailPage = async ({ params }: PageProps) => {
  const { userId } = await params;

  return <ModeratorUserDetailView userId={userId} />;
};

export default ModeratorUserDetailPage;
