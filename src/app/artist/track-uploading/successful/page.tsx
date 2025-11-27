"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EkofyLogo, EkofyLogoXs } from "@/assets/icons";

const Page = () => {
  const router = useRouter();

  const handleClose = () => {
    router.push("/artist/studio/tracks");
  };

  return (
    <div className="relative w-full">
      <header className="bg-main-dark-bg fixed top-0 z-1000 flex w-full items-center justify-between px-6 py-3">
        <div className="flex items-center gap-x-2 select-none">
          <EkofyLogoXs className="size-8" />

          <div className="primary_gradient flex h-6 items-center gap-x-2 bg-clip-text text-transparent">
            <span className="text-lg font-bold">Ekofy | Track Upload Successful</span>
          </div>
        </div>

        <Button
          onClick={handleClose}
          className="bg-main-grey-dark-bg group hover:bg-main-grey-dark-bg/90 z-10 size-10 rounded-full"
        >
          <X className="text-main-grey-dark group-hover:text-main-grey size-6" />
        </Button>
      </header>

      <div className="container mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-start gap-x-8">
          <EkofyLogo className="size-42" />

          <div className="flex flex-col gap-y-6">
            <h1 className="text-6xl font-bold">Saved to Ekofy.</h1>
            <p className="text-muted-foreground text-lg">Congratulations! Your tracks are now available on Ekofy.</p>
            <Button onClick={handleClose} className="w-fit" variant={"ekofy"}>
              Go to My Tracks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
