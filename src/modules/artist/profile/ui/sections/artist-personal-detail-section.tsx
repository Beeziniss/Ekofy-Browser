import React from "react";
import DetailItem from "@/modules/client/profile/ui/components/detail-item";
import { useArtistProfile } from "../../hooks/use-artist-profile";
import { format } from "date-fns";
import type { UserGender } from "@/gql/graphql";

export default function ArtistPersonalDetailSection() {
  const { identityCard } = useArtistProfile();

  const genderLabel = (g?: UserGender | null): string => {
    switch (g) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      case "OTHER":
        return "Other";
      default:
        return "-";
    }
  };

  const safeFormat = (value?: string | null): string => {
    if (!value) return "-";
    try {
      return format(new Date(value), "dd-MM-yyyy");
    } catch {
      return "-";
    }
  };

  const personalFields = [
    { title: "Citizen ID", value: identityCard?.number || "-" },
    { title: "Full name", value: identityCard?.fullName || "-" },
    { title: "Date of Birth", value: safeFormat(identityCard?.dateOfBirth) },
    { title: "Gender", value: genderLabel(identityCard?.gender) },
    { title: "Place of origin", value: identityCard?.placeOfOrigin || "-" },
    { title: "Place of residence", value: identityCard?.placeOfResidence?.addressLine || "-" },
    { title: "Date of expiration", value: safeFormat(identityCard?.validUntil) },
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
