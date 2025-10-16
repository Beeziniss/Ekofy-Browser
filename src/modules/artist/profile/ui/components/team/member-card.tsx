import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  avatarUrl?: string;
  isLeader?: boolean;
}

interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
}

export default function TeamMemberCard({ member, className }: TeamMemberCardProps) {
  const initials = getInitials(member.name);
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-25 w-25 md:h-24 md:w-24">
          {member.avatarUrl ? (
            <AvatarImage src={member.avatarUrl} alt={member.name} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold leading-7 md:text-lg flex items-center gap-2">
            {member.name}
            {member.isLeader ? (
              <span className="rounded-full bg-purple-600/20 text-purple-300 text-[10px] px-2 py-0.5 uppercase tracking-wide">
                Leader
              </span>
            ) : null}
          </p>
          <p className="truncate text-sm text-muted-foreground md:text-base">{member.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  const res = `${first}${last}`.toUpperCase();
  return res || "U";
}
