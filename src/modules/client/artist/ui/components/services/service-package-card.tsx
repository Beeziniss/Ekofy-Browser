import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServicePackage } from "../../sections/services/artist-service-section";

const ServicePackageCard = ({
  servicePackage,
}: {
  servicePackage: ServicePackage;
}) => {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="group h-fit transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
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
          {servicePackage.description ||
            "No description available for this service package."}
        </CardDescription>
      </CardHeader>

      <CardFooter className="pt-4">
        <Button variant="ekofy" className="w-full">
          Book Service
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServicePackageCard;
