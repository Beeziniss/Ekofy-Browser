import React from "react";
import Link from "next/link";
import { ChevronRightIcon, ReceiptTextIcon, ClipboardListIcon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";

interface ActivitySectionProps {
  userId?: string;
}

const OrderSection = ({ userId }: ActivitySectionProps) => {
  const activityItems = [
    {
      title: "Request History",
      href: "/profile/my-requests",
      icon: ClipboardListIcon,
    },
    {
      title: "Order History",
      href: `/activities/conversation/${userId}`,
      icon: ReceiptTextIcon,
    },
  ];

  return (
    <div className="rounded-md bg-[#2a2a2a] pb-3">
      <div className="flex items-end p-4">
        <h2 className="text-xl font-bold">My Orders</h2>
      </div>
      <div className="flex flex-col">
        {activityItems.map((item) => (
          <Item asChild variant="subscription" key={item.title} size={"sm"} className="rounded-none">
            <Link href={item.href} className="no-underline">
              <ItemMedia variant={"icon"}>
                <item.icon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon className="size-5" />
              </ItemActions>
            </Link>
          </Item>
        ))}
      </div>
    </div>
  );
};

export default OrderSection;
