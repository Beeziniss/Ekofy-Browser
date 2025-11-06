"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { servicePackageOptions } from "@/gql/options/client-options";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ServicePackageCard from "../../components/services/service-package-card";
import { PackageXIcon } from "lucide-react";

interface ArtistServiceSectionProps {
  artistId: string;
}

export interface ServicePackage {
  __typename?: "ArtistPackage" | undefined;
  id: string;
  artistId: string;
  amount: number;
  currency: string;
  packageName: string;
  description?: string | null | undefined;
}

const ArtistServiceSection = ({ artistId }: ArtistServiceSectionProps) => {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Service Packages</h2>
        <p className="text-muted-foreground">Choose from available service packages offered by this artist</p>
      </div>
      <Suspense fallback={<ArtistServiceSectionSkeleton />}>
        <ArtistServiceSectionSuspense artistId={artistId} />
      </Suspense>
    </div>
  );
};

const ArtistServiceSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="h-fit">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const ArtistServiceSectionSuspense = ({ artistId }: ArtistServiceSectionProps) => {
  const { data } = useSuspenseQuery(servicePackageOptions(artistId));

  const servicePackages = data?.artistPackages?.items || [];

  if (servicePackages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="space-y-3 text-center">
          <div className="bg-muted mx-auto flex size-16 items-center justify-center rounded-full">
            <PackageXIcon className="text-muted-foreground size-8" />
          </div>
          <h3 className="text-lg font-semibold">No Service Packages Available</h3>
          <p className="text-muted-foreground max-w-md text-sm">
            This artist hasn&apos;t created any service packages yet. Check back later for available services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {servicePackages.map((servicePackage: ServicePackage) => (
        <ServicePackageCard key={servicePackage.id} servicePackage={servicePackage} />
      ))}
    </div>
  );
};

export default ArtistServiceSection;
