"use client";

import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";

const ActivitySection = () => {
  return (
    <div className="pt-0 ">
      <div className="flex items-end justify-between gap-x-3">
        <h2 className="text-xl font-bold">My Activity</h2>
      </div>
      <div className="flex flex-col gap-6 pt-8">
        <Item asChild variant="muted">
          <Link href="/profile/payment-history" className="no-underline">
            <ItemContent>
              <ItemTitle>Payment History</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-8" />
            </ItemActions>
          </Link>
        </Item>

        <Item asChild variant="muted">
          <Link href="/profile/invoices" className="no-underline">
            <ItemContent>
              <ItemTitle>Invoices</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-8" />
            </ItemActions>
          </Link>
        </Item>

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

export default ActivitySection;
