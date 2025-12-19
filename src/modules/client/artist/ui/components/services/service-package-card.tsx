import Link from "next/link";
import { ChevronsRightIcon, StarIcon } from "lucide-react";
import { ServicePackage } from "../../sections/services/artist-service-section";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ServicePackageCard = ({ servicePackage }: { servicePackage: ServicePackage }) => {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const averageRating = servicePackage.review?.averageRating || 0;
  const totalReviews = servicePackage.review?.totalReviews || 0;

  return (
    <Card className="group flex h-full flex-col gap-1 transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="group-hover:text-primary text-xl font-bold transition-colors">
            {servicePackage.packageName}
          </CardTitle>
        </div>
        <CardDescription className="line-clamp-2 leading-relaxed">
          {servicePackage.description || "No description available for this service package."}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        {(averageRating > 0 || totalReviews > 0) && (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center gap-1">
              <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">
                {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
              </span>
            </div>
            {totalReviews > 0 && (
              <span className="text-muted-foreground text-xs">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto items-center justify-between pt-4">
        <div className="flex items-center gap-1">
          <span className="text-main-purple/85 text-lg font-bold">
            {formatPrice(servicePackage.amount, servicePackage.currency)}
          </span>
        </div>
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
