import { EntitlementDetailView } from "@/modules/admin/entitlement/ui/views";

interface EntitlementDetailPageProps {
  params: Promise<{
    entitlementId: string;
  }>;
}

const EntitlementDetailPage = async ({ params }: EntitlementDetailPageProps) => {
  const { entitlementId } = await params;

  return <EntitlementDetailView entitlementId={entitlementId} />;
};

export default EntitlementDetailPage;
