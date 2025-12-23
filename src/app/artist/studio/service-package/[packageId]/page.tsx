import ServicePackageDetailSection from "@/modules/artist/service-package/ui/section/service-package-detail-section";

interface ServicePackageDetailPageProps {
  params: Promise<{
    packageId: string;
  }>;
}

const ServicePackageDetailPage = async ({ params }: ServicePackageDetailPageProps) => {
  const { packageId } = await params;

  return (
    <div className="min-h-screen">
      <ServicePackageDetailSection packageId={packageId} />
    </div>
  );
};

export default ServicePackageDetailPage;
