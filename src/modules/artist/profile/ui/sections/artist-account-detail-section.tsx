import React from "react";
import DetailItem from "@/modules/client/profile/ui/components/detail-item";
import { useArtistProfile } from "../../hooks/use-artist-profile";

export default function ArtistAccountDetailSection() {
  const { data, createdAt, isVerified } = useArtistProfile();

  const accountFields = [
    { title: "Stage name", value: data?.stageName || "-" },
    { title: "Created date", value: createdAt || "-" },
    // Membership status not yet defined for artists; use placeholder or derived logic if available later
    { title: "Membership status", value: isVerified ? "ACTIVE" : "FREE" },
    { title: "Account verification", value: isVerified ? "Verified" : "Not verified" },
  ];

  return (
    <div className="w-full ">
      <div className="flex items-end justify-between gap-x-3">
        <h2 className="text-xl font-bold">Account Details</h2>
      </div>
      <div className="mt-6 md:mt-12 md:mb-12">
        {accountFields.map((item) => (
          <DetailItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}
