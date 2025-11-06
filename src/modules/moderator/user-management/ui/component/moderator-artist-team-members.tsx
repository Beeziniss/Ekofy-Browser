"use client";

import { ModeratorArtistMember } from "@/types";

interface ModeratorArtistTeamMembersProps {
  members: ModeratorArtistMember[];
}

export function ModeratorArtistTeamMembers({ members }: ModeratorArtistTeamMembersProps) {
  return (
    <div>
      <h3 className="mb-6 text-xl font-semibold text-white">Team Members</h3>

      {members && members.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div key={index} className="rounded-xl border bg-[#1A1A1A] p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <span className="text-lg font-bold text-white">
                    {member.fullName?.charAt(0).toUpperCase() || "M"}
                  </span>
                </div>
                <h4 className="mb-2 font-semibold text-white">{member.fullName || "Unknown Member"}</h4>
                <p className="mb-2 text-gray-400">{member.email || "No email provided"}</p>
                {member.isLeader && <span className="text-sm font-bold text-red-600">Leader</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">No team members found</div>
          <p className="text-sm text-gray-500">This artist doesn`t have any registered team members.</p>
        </div>
      )}
    </div>
  );
}
