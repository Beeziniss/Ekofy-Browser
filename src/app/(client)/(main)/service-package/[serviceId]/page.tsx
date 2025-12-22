import ServicePackageView from "@/modules/client/service-package/ui/views/service-package-view";

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { serviceId } = await params;

  return <ServicePackageView serviceId={serviceId} />;
};

export default Page;
