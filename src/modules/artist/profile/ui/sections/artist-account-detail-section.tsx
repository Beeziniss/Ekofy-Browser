import React from "react";
import DetailItem from "@/modules/client/profile/ui/components/detail-item";
import { useArtistProfile } from "../../hooks/use-artist-profile";

export default function ArtistAccountDetailSection() {
  const { data, createdAt, userStatus, artistType, membershipStatus } = useArtistProfile();

  const humanize = (value?: string | null) =>
    value
      ? value
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "-";

  const accountFields = [
    { title: "Stage name", value: data?.stageName || "-" },
    { title: "Created date", value: createdAt || "-" },
    { title: "Artist type", value: humanize(artistType as unknown as string) },
    { title: "Membership status", value: membershipStatus || "-" },
    { title: "Account status", value: humanize(userStatus as unknown as string) },
  ];

  return (
    <div className="w-full">
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
