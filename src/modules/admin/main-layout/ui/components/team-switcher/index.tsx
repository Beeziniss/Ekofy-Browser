"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

interface TeamSwitcherProps {
  team: {
    name: string;
    logo: string;
    role: string;
  };
}

export function TeamSwitcher({ team }: TeamSwitcherProps) {
  const router = useRouter();

  const onNavigate = () => {
    router.push("/admin");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={onNavigate}
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Image src={team.logo} alt="Ekofy Logo" width={32} height={32} />

          <div className="flex h-6 items-center gap-x-2">
            <div className="truncate text-base font-bold">{team.name}</div>

            <Separator orientation="vertical" className="bg-main-white !h-5" />

            <div className="truncate text-sm font-medium">{team.role}</div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
