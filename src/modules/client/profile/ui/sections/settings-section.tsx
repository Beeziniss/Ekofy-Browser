import Link from "next/link";
import { ChevronRightIcon, LockIcon, LockOpenIcon } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";

const settingItewms = [
  {
    title: "Change password",
    // href: "/profile/change-password",
    href: "#",
    icon: LockIcon,
  },
  {
    title: "Deactivate account",
    // href: "/profile/deactivate-account",
    href: "#",
    icon: LockOpenIcon,
  },
];

const SettingsSection = () => {
  return (
    <div className="rounded-md bg-[#2a2a2a] pb-3">
      <div className="flex items-end p-4">
        <h2 className="text-xl font-bold">Settings & Privacy</h2>
      </div>
      <div className="flex flex-col">
        {settingItewms.map((item) => (
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

export default SettingsSection;
