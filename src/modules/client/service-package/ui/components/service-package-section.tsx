"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { ArrowLeftIcon, PackageXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/utils/format-shorten-name";
import { servicePackageOptions } from "@/gql/options/client-options";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSuspenseQuery } from "@tanstack/react-query";
import ContactArtistDialog from "./contact-artist-dialog";

interface ServicePackageSectionProps {
  serviceId: string;
}

const ServicePackageSection = ({ serviceId }: ServicePackageSectionProps) => {
  return (
    <Suspense fallback={<ServicePackageSectionSkeleton />}>
      <ServicePackageSectionSuspense serviceId={serviceId} />
    </Suspense>
  );
};

const ServicePackageSectionSkeleton = () => {
  return <div>Loading...</div>;
};

const ServicePackageSectionSuspense = ({ serviceId }: ServicePackageSectionProps) => {
  const { data } = useSuspenseQuery(servicePackageOptions({ serviceId }));
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

  const servicePackage = data?.artistPackages?.items?.[0];

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex items-start justify-between">
        <h1 className="text-main-white text-4xl font-bold">About The Artist</h1>

        <Link
          href={`/artists/${servicePackage?.artist?.[0].id}/services`}
          className="hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm font-normal transition hover:border-b"
        >
          <ArrowLeftIcon className="size-4" /> Back to Services
        </Link>
      </div>

      <div className="flex items-start gap-x-14">
        <Avatar className="size-40">
          <AvatarImage
            src={servicePackage?.artist?.[0].avatarImage || undefined}
            alt={servicePackage?.artist?.[0].stageName || "Artist Avatar"}
          />
          <AvatarFallback>{getUserInitials(servicePackage?.artist?.[0].stageName || "Ekofy Artist")}</AvatarFallback>
        </Avatar>

        <div className="text-main-white text-sm font-normal">
          <h2 className="text-main-purple text-2xl font-semibold">{servicePackage?.artist?.[0].stageName}</h2>
          <div className="mt-4 space-y-4">
            <p>{servicePackage?.artist?.[0].biography}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{servicePackage?.packageName}</h2>
        <p className="text-muted-foreground w-1/2 text-lg">{servicePackage?.description}</p>
        <div className="text-lg">Here&apos;s what you get:</div>
        <ul className="text-main-white space-y-2 font-medium">
          {servicePackage?.serviceDetails?.map((detail, index) => (
            <li key={index} className="flex items-center gap-x-2">
              <PackageXIcon className="text-main-purple size-5" />
              {detail.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <Button
          variant={"ekofy"}
          size={"lg"}
          className="!rounded-sm text-base"
          onClick={() => setSubscribeDialogOpen(true)}
        >
          <span>Contact Now</span>
          {/* <Separator orientation="vertical" className="bg-main-white/80 mx-3 h-6" />
          <span>
            {Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(servicePackage?.amount || 0)}
          </span> */}
        </Button>

        <div>
          Not meeting your needs?{" "}
          <Link
            href={`/artists/${servicePackage?.artist?.[0].id}/services`}
            className="text-main-link font-semibold hover:underline"
          >
            Explore more service from this artist
          </Link>
        </div>

        <ContactArtistDialog
          open={subscribeDialogOpen}
          onOpenChange={setSubscribeDialogOpen}
          servicePackage={servicePackage}
        />
      </div>
    </div>
  );
};

export default ServicePackageSection;
