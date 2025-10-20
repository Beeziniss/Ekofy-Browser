"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArtistMember } from "@/types/user-management";
interface ArtistTeamMembersProps {
  members: ArtistMember[];
}

export function ArtistTeamMembers({ members }: ArtistTeamMembersProps) {
  if (!members || members.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No team members found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member, index) => (
        <Card key={index} className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                {member.fullName?.charAt(0).toUpperCase() || 'M'}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">
                  {member.fullName || `Nguyen Van ${String.fromCharCode(65 + index)}`}
                  {member.isLeader && (
                    <span className="ml-2 text-red-400 text-sm">(Leader)</span>
                  )}
                </h4>
                <p className="text-gray-400 text-sm">
                  {member.email || "nguyenvana@gmail.com"} • {member.phoneNumber || "Phone Number"} • {member.gender || "Gender"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}