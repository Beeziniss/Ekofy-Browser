"use client";

import React from "react";
import Link from "next/link";
import { ChevronRightIcon, ReceiptIcon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";

const ArtistActivitySection = () => {
  return (
    <div className="rounded-md bg-[#2a2a2a] pb-3">
      <div className="flex items-end p-4">
        <h2 className="text-xl font-bold">Billing & Payments</h2>
      </div>
      <div className="flex flex-col">
        <Item asChild variant="subscription" size={"sm"} className="rounded-none">
          <Link href="/artist/studio/profile/invoices" className="no-underline">
            <ItemMedia variant={"icon"}>
              <ReceiptIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Invoices</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-5" />
            </ItemActions>
          </Link>
        </Item>
      </div>
    </div>
  );
};

export default ArtistActivitySection;
