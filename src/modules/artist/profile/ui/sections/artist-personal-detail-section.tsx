import React from "react";
import DetailItem from "@/modules/client/profile/ui/components/detail-item";

const personalFields = [
  { title: "Citizen ID", value: "012345678901" },
  { title: "Full name", value: "Nguyen Van A" },
  { title: "Phone number", value: "+84 901 234 567" },
  { title: "Date of Birth", value: "1999-10-10" },
  { title: "Gender", value: "Male" },
  { title: "Place of origin", value: "Da Nang, Vietnam" },
  { title: "Place of residence", value: "Ho Chi Minh City, Vietnam" },
  { title: "Date of expiration", value: "2030-10-10" },
];

export default function ArtistPersonalDetailSection() {
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
