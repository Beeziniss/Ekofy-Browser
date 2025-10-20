"use client";
import { useArtistProfile } from "../../../hooks/use-artist-profile";

export default function BiographySection() {
  const { biography } = useArtistProfile();
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold">Biography</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {biography || "No biography provided yet."}
      </p>
    </div>
  );
}
