import Link from "next/link";
import { ChevronsRightIcon } from "lucide-react";
import { ServicePackage } from "../../sections/services/artist-service-section";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ServicePackageCard = ({ servicePackage }: { servicePackage: ServicePackage }) => {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="group h-fit transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="group-hover:text-primary text-xl font-bold transition-colors">
            {servicePackage.packageName}
          </CardTitle>
          <div className="flex items-center gap-1">
            <span className="text-main-purple/85 text-2xl font-bold">
              {formatPrice(servicePackage.amount, servicePackage.currency)}
            </span>
          </div>
        </div>
        <CardDescription className="line-clamp-2 leading-relaxed">
          {servicePackage.description || "No description available for this service package."}
        </CardDescription>
      </CardHeader>

      <CardFooter className="justify-end pt-4">
        <Link
          href={`/service-package/${servicePackage.id}`}
          className="text-main-purple hover:border-main-purple flex items-center gap-x-1 border-b border-transparent font-normal transition-colors"
        >
          <span>Detail</span>
          <ChevronsRightIcon className="size-6" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ServicePackageCard;
