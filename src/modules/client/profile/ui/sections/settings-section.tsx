import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";

const settingItewms = [
  {
    title: "Change password",
    // href: "/profile/change-password",
    href: "#",
  },
  {
    title: "Deactivate account",
    // href: "/profile/deactivate-account",
    href: "#",
  },
];

const SettingsSection = () => {
  return (
    <div className="pt-0 pb-6">
      <div className="flex items-end justify-between gap-x-3">
        <h2 className="text-xl font-bold">Settings & Privacy</h2>
      </div>
      <div className="flex flex-col gap-6 pt-8">
        {settingItewms.map((item) => (
          <Item asChild variant="muted" key={item.title} size={"sm"}>
            <Link href={item.href} className="no-underline">
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

export default SettingsSection;
