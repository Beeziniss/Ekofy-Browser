import RequestDetailSection from "@/modules/client/profile/ui/sections/my-requests/request-detail-section";

interface PageProps {
  params: Promise<{ id: string }>;
}

const RequestDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;

  return <RequestDetailSection requestId={id} />;
};

export default RequestDetailPage;
