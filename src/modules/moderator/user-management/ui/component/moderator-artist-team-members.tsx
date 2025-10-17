"use client";

import { ModeratorArtistMember } from "@/types";

interface ModeratorArtistTeamMembersProps {
  members: ModeratorArtistMember[];
}

export function ModeratorArtistTeamMembers({ members }: ModeratorArtistTeamMembersProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6">Team Members</h3>
      
      {members && members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] border rounded-xl p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {member.fullName?.charAt(0).toUpperCase() || "M"}
                  </span>
                </div>
                <h4 className="text-white font-semibold mb-2">
                  {member.fullName || "Unknown Member"}
                </h4>
                <p className="text-gray-400 mb-2">
                  {member.email || "No email provided"}
                </p>
                {member.isLeader && (
                  <span className="text-red-600 font-bold text-sm">
                    Leader
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No team members found</div>
          <p className="text-gray-500 text-sm">
            This artist doesn't have any registered team members.
          </p>
        </div>
      )}
    </div>
  );
}