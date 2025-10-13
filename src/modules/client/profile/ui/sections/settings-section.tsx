import React from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronRightIcon } from "lucide-react";

const SettingsSection = () => {
  return (
    <div className="pt-0 pb-6">
      <div className="flex items-end justify-between gap-x-3">
        <h2 className="text-xl font-bold">Settings & Privacy</h2>
      </div>
      <div className="flex flex-col gap-6 pt-8">
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Change password</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-8" />
          </ItemActions>
        </Item>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Deactivate account</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-8" />
          </ItemActions>
        </Item>
      </div>
    </div>
  );
};

export default SettingsSection;
