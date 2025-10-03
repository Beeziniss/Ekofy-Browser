"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TrackUploadEmpty = () => {
  const router = useRouter();

  const handleNavigateToUpload = () => {
    router.push("/artist/track-upload");
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-white/30 py-20">
      <Image
        src={"/track-xl.svg"}
        alt="Track Upload Empty"
        width={70}
        height={70}
      />

      <p className="text-main-white my-6 text-center text-lg font-medium">
        You haven&apos;t uploaded any tracks yet. Try uploading to get
        discovered and start building your audience.
      </p>

      <Button
        onClick={handleNavigateToUpload}
        className="primary_gradient text-main-white hover:brightness-90"
      >
        Upload Now
      </Button>
    </div>
  );
};

export default TrackUploadEmpty;
