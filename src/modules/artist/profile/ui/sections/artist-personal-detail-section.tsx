import React from "react";
import DetailItem from "@/modules/client/profile/ui/components/detail-item";
import { useArtistProfile } from "../../hooks/use-artist-profile";
import { format } from "date-fns";

export default function ArtistPersonalDetailSection() {
  const { identityCard } = useArtistProfile();

  const personalFields = [
    { title: "Citizen ID", value: identityCard?.number || "-" },
    { title: "Full name", value: identityCard?.fullName || "-" },
    { title: "Date of Birth", value: identityCard?.dateOfBirth ? (() => { try { return format(new Date(identityCard!.dateOfBirth!), "yyyy-MM-dd"); } catch { return "-"; } })() : "-" },
    { title: "Gender", value: identityCard?.gender || "-" },
    { title: "Place of origin", value: identityCard?.placeOfOrigin || "-" },
    { title: "Place of residence", value: identityCard?.placeOfResidence?.addressLine || "-" },
    { title: "Date of expiration", value: identityCard?.validUntil ? (() => { try { return format(new Date(identityCard!.validUntil!), "yyyy-MM-dd"); } catch { return "-"; } })() : "-" },
  ];

  return (
    <div className="w-full ">
      <div className="flex items-end justify-between gap-x-3">
        <h2 className="text-xl font-bold">Personal Details</h2>
      </div>
      <div className="w-full mt-6 md:mt-12 md:mb-12">
        {personalFields.map((item) => (
          <DetailItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}
