import TeamMemberCard, { TeamMember } from "../components/team/member-card";

interface TeamTabProps {
  members?: Array<{
    fullName: string;
    email: string;
    isLeader?: boolean;
  }>;
}

export default function TeamTab({ members: rawMembers }: TeamTabProps) {
  const members: TeamMember[] = (rawMembers || []).map((m, idx) => ({
    id: idx,
    name: m.fullName,
    email: m.email,
    avatarUrl: "",
    isLeader: m.isLeader,
  }));

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-lg font-semibold">Team&#39;s member(s)</h2>
      <div className="space-y-3">
        {members.map((m) => (
          <TeamMemberCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}
