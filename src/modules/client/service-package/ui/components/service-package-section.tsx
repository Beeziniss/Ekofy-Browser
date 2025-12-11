"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { ArrowLeftIcon, CheckIcon, HeadphonesIcon, MicIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/utils/format-shorten-name";
import { servicePackageOptions } from "@/gql/options/client-options";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import ContactArtistDialog from "./contact-artist-dialog";
import { formatCurrency } from "@/utils/format-currency";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { useAuthAction } from "@/hooks/use-auth-action";

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
  return <div className="text-muted-foreground flex items-center justify-center py-20">Loading...</div>;
};

/* const iconMap: Record<string, React.ReactNode> = {
  "Vocal Tuning": <MicIcon className="size-6 text-cyan-400" />,
  "Vocal Mixing": <HeadphonesIcon className="size-6 text-cyan-400" />,
  "Mastering for Streaming": <RadioIcon className="size-6 text-cyan-400" />,
  "Noise Reduction": <WavesIcon className="size-6 text-cyan-400" />,
  "Reverb & FX": <MusicIcon className="size-6 text-cyan-400" />,
}; */

const ServicePackageSectionSuspense = ({ serviceId }: ServicePackageSectionProps) => {
  const { data } = useSuspenseQuery(servicePackageOptions({ serviceId }));
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth } = useAuthAction();

  const servicePackage = data?.artistPackages?.items?.[0];
  const artist = servicePackage?.artist?.[0];

  return (
    <div className="from-main-blue/20 to-main-purple/20 min-h-screen bg-gradient-to-br via-slate-900 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/artists/${artist?.id}/services`}
            className="text-main-white/70 hover:text-main-white flex items-center gap-x-2 text-sm font-medium transition"
          >
            <ArrowLeftIcon className="size-4" /> Back to Services
          </Link>

          <Link
            href={`/artists-for-hire`}
            className="text-main-purple hover:text-main-purple/90 flex items-center gap-x-2 text-sm font-medium transition"
          >
            Explore more artists <span className="bg-main-purple ml-1 size-2 rounded-full"></span>
          </Link>
        </div>

        {/* Artist Profile Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-start gap-x-8">
            <div className="relative">
              <Avatar className="border-main-purple/50 ring-main-purple/20 size-36 border-4 ring-4">
                <AvatarImage src={artist?.avatarImage || undefined} alt={artist?.stageName || "Artist Avatar"} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-2xl font-bold">
                  {getUserInitials(artist?.stageName || "Artist")}
                </AvatarFallback>
              </Avatar>
              <div className="bg-main-purple absolute -right-2 -bottom-2 flex size-10 items-center justify-center rounded-full shadow-lg">
                <StarIcon className="size-5 fill-slate-900 text-slate-900" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-x-3">
                <h2 className="text-main-purple text-4xl font-bold">{artist?.stageName}</h2>
                <Badge className="border-0 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-semibold text-white">
                  PRO
                </Badge>
              </div>

              <p className="text-main-white/80 max-w-2xl text-base leading-relaxed">
                {artist?.biography || "Professional audio engineer with years of experience"}
              </p>

              <div className="flex items-center gap-x-6">
                <div className="flex items-center gap-x-2 text-sm text-slate-400">
                  <div className="flex items-center">
                    <span className="size-3 rounded-full bg-slate-600"></span>
                    <span className="-ml-1 size-3 rounded-full bg-slate-600"></span>
                    <span className="-ml-1 size-3 rounded-full bg-slate-600"></span>
                  </div>
                  <span>200+ happy clients</span>
                </div>

                <div className="flex items-center gap-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-slate-400">4.9 rating</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-main-purple hover:bg-main-purple/10 hover:text-main-purple/90 mt-2 gap-x-2 px-2 font-medium"
              >
                <PlayIcon className="fill-main-blue text-main-blue size-4 animate-pulse" />
                Listen to samples
              </Button>
            </div>
          </div>
        </div>

        {/* Service Package Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <div className="relative flex items-start justify-between">
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                {/* <div className="flex items-center gap-x-3">
                  <Badge className="border-0 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-semibold text-white uppercase">
                    PREMIUM
                  </Badge>
                  <span className="text-sm text-slate-400">Most popular choice</span>
                </div> */}
                <h3 className="text-main-white text-3xl font-bold">{servicePackage?.packageName}</h3>
                <p className="text-main-white/70 max-w-2xl text-base leading-relaxed">{servicePackage?.description}</p>
              </div>

              {/* What's Included Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">What&apos;s Included</h4>
                <div className="grid grid-cols-2 gap-4">
                  {servicePackage?.serviceDetails?.map((detail, index) => {
                    // const icon = iconMap[detail.value] || <CheckIcon className="text-main-purple size-6" />;
                    const icon = <CheckIcon className="text-main-purple size-6" />;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-x-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition hover:bg-slate-800/80"
                      >
                        <div className="bg-main-purple/10 flex size-12 items-center justify-center rounded-lg">
                          {icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-main-white font-semibold">{detail.value}</p>
                          {/* <p className="text-xs text-slate-400">
                            {detail.value === "Vocal Tuning" && "Pitch-perfect correction"}
                            {detail.value === "Vocal Mixing" && "Professional balance"}
                            {detail.value === "Mastering for Streaming" && "Platform optimized"}
                            {detail.value === "Noise Reduction" && "Crystal clear audio"}
                            {detail.value === "Reverb & FX" && "Atmospheric depth"}
                          </p> */}
                        </div>
                        {/* <CheckIcon className="size-5 text-cyan-400" /> */}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Section */}
              <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-6">
                <div className="flex items-center gap-x-4">
                  <div className="bg-main-purple/10 flex size-14 items-center justify-center rounded-full">
                    <HeadphonesIcon className="text-main-purple size-7" />
                  </div>
                  <div>
                    <p className="text-main-white text-lg font-semibold">Ready to elevate your sound?</p>
                    {/* <p className="text-sm text-slate-400">Usually responds within 2 hours</p> */}
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <Link href={`/artists/${artist?.id}/services`}>
                    <Button
                      variant="ghost"
                      className="text-main-white hover:text-main-white border border-slate-600 font-semibold hover:bg-slate-700/50"
                    >
                      View More Services
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      executeWithAuth(() => setSubscribeDialogOpen(true), "contact artist", artist?.stageName);
                    }}
                    className="text-main-white gap-x-2 bg-gradient-to-r from-purple-500 to-purple-600 px-8 text-base font-semibold shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-purple-700"
                  >
                    <MicIcon className="size-5" />
                    Contact Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="absolute -top-2 -right-2 flex flex-col items-end">
              <div className="text-right">
                <div className="text-main-purple text-4xl font-bold">
                  {formatCurrency(data.artistPackages?.items?.[0].amount || 0)}
                </div>
                <div className="text-sm text-slate-400">per track</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Not meeting your needs?{" "}
            <Link
              href={`/artists/${artist?.id}/services`}
              className="text-main-purple hover:text-main-purple/90 font-semibold transition hover:underline"
            >
              Explore more services from this artist
            </Link>
          </p>
        </div>
      </div>

      <ContactArtistDialog
        open={subscribeDialogOpen}
        onOpenChange={setSubscribeDialogOpen}
        servicePackage={servicePackage}
      />

      <WarningAuthDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        action={warningAction}
        trackName={trackName}
      />
    </div>
  );
};

export default ServicePackageSection;
