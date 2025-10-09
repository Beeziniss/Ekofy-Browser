import React from "react";
import DetailItem from "@/modules/client/profile/ui/components/detail-item";

const accountFields = [
  { title: "Stage name", value: "A Nguyen" },
  { title: "Created date", value: "2024-01-15" },
  { title: "Membership status", value: "Active" },
  { title: "Account verification", value: "Verified" },
];

export default function ArtistAccountDetailSection() {
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
