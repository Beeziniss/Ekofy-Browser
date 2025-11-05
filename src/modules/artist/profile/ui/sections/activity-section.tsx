"use client";

import React from "react";
import { ChevronRightIcon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";

const ArtistActivitySection = () => {
  return (
    <div className="pt-0 ">
      <div className="flex items-end justify-between gap-x-3">
        <h2 className="text-xl font-bold">My Activity</h2>
      </div>
      <div className="flex flex-col gap-6 pt-8">
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Order History</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-8" />
          </ItemActions>
        </Item>
      </div>
    </div>
  );
};

export default ArtistActivitySection;
