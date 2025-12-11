import ServicePackageSection from "../components/service-package-section";

interface ServicePackageViewProps {
  serviceId: string;
}

const ServicePackageView = ({ serviceId }: ServicePackageViewProps) => {
  return (
    <div className="w-full">
      <ServicePackageSection serviceId={serviceId} />
    </div>
  );
};

export default ServicePackageView;
