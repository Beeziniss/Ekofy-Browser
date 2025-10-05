
import React from "react";
import DetailItem from "../components/detail-item";

const detailField = [
  {
    title: "Likes",
    value: 1234
    
  },
  {
    title: "Comments",
    value: 567
    
  },
  {
    title: "Downloads",
    value: 890
   
  },
  {
    title: "Streams",
    value: 2345
   
  },
];

const AccountDetailSection = () => {
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
