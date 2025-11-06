"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArtistMember } from "@/types/user-management";
interface ArtistTeamMembersProps {
  members: ArtistMember[];
}

export function ArtistTeamMembers({ members }: ArtistTeamMembersProps) {
  if (!members || members.length === 0) {
    return <div className="py-8 text-center text-gray-400">No team members found</div>;
  }

  return (
    <div className="space-y-4">
      {members.map((member, index) => (
        <Card key={index} className="border-gray-700 bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-xl font-bold text-white">
                {member.fullName?.charAt(0).toUpperCase() || "M"}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">
                  {member.fullName || `Nguyen Van ${String.fromCharCode(65 + index)}`}
                  {member.isLeader && <span className="ml-2 text-sm text-red-400">(Leader)</span>}
                </h4>
                <p className="text-sm text-gray-400">
                  {member.email || "nguyenvana@gmail.com"} • {member.phoneNumber || "Phone Number"} •{" "}
                  {member.gender || "Gender"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
