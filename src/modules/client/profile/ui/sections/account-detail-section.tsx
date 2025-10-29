
import React from "react";
import DetailItem from "../components/detail-item";
import { useClientProfile } from "../../hooks/use-client-profile";

const AccountDetailSection = () => {
  const { account } = useClientProfile();
  const detailField = [
    { title: "Created date", value: account.createdAt || "-" },
    { title: "Membership status", value: account.membershipStatus || "-" },
  ];
  return (
    <div className="w-full ">
      <div className="flex items-end gap-x-3 justify-between">
        <h2 className="text-xl font-bold">Account Details</h2>
      </div>
      <div className="mt-6 md:mt-12 md:mb-12">
        {detailField.map((item) => (
          <DetailItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
};

export default AccountDetailSection;
