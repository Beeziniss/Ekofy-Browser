import TeamMemberCard, { TeamMember } from "../components/team/member-card";

export default function TeamTab() {
  const members: TeamMember[] = [
    { id: 1, name: "Alice Nguyen", email: "alice@example.com", avatarUrl: "" },
    { id: 2, name: "Bob Tran", email: "bob@example.com", avatarUrl: "" },
  ];

  return (
    <div className="py-4 space-y-4">
  <h2 className="text-lg font-semibold">Team&#39;s member(s)</h2>
      <div className="space-y-3">
        {members.map((m) => (
          <TeamMemberCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}
