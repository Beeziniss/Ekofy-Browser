
import React from "react";
import DetailItem from "../components/detail-item";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

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

const PersonalDetailSection = () => {
  return (
    <div className="w-full ">
      <div className="flex items-end gap-x-3 justify-between">
        <h2 className="text-xl font-bold">Personal Details</h2>
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          aria-label="Edit personal details"
          title="Edit personal details"
          onClick={() => console.log("Edit personal details clicked")}
        >
          <Pencil className="size-4" />
        </Button>
      </div>
      <div className="w-full mt-6 md:mt-12 md:mb-12">
        {detailField.map((item) => (
          <DetailItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
};

export default PersonalDetailSection;
