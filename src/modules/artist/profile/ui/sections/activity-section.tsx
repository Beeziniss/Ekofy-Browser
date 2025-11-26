"use client";

import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";

const ArtistActivitySection = () => {
  return (
    <div className="pt-0 ">
      <div className="flex items-end justify-between gap-x-3">
        <h2 className="text-xl font-bold">My Activity</h2>
      </div>
      <div className="flex flex-col gap-6 pt-8">
        
        <Item asChild variant="muted">
          <Link href="/artist/studio/profile/invoices" className="no-underline">
            <ItemContent>
              <ItemTitle>Invoices</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-8" />
            </ItemActions>
          </Link>
        </Item>
      </div>
    </div>
  );
};

export default ArtistActivitySection;
