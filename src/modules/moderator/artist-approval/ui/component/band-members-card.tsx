"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArtistMember } from "@/gql/graphql";

interface BandMembersCardProps {
  members: ArtistMember[];
}

export function BandMembersCard({ members }: BandMembersCardProps) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <Card className="transparent border-2 border-solid border-gray-400 bg-[#121212] text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Optional Artist type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="transparent rounded-lg border-2 border-solid border-gray-400 bg-[#121212] p-4">
          <h4 className="mb-4 font-semibold text-white">Artist Members</h4>

          {members.map((member, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="mb-3 flex items-center justify-between">
                <h5 className="font-medium text-white">
                  Member {index + 1}
                  {member.isLeader && <span className="ml-2 text-sm text-red-400">(Leader)</span>}
                </h5>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-300">Full name</label>
                  <Input
                    value={member.fullName}
                    readOnly
                    className="transparent border-2 border-solid border-gray-400 bg-[#121212] text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-300">Email</label>
                  <Input
                    value={member.email}
                    readOnly
                    className="transparent border-2 border-solid border-gray-400 bg-[#121212] text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-300">Phone Number</label>
                  <Input
                    value={member.phoneNumber}
                    readOnly
                    className="transparent border-2 border-solid border-gray-400 bg-[#121212] text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-300">Gender</label>
                  <Input
                    value={member.gender}
                    readOnly
                    className="transparent border-2 border-solid border-gray-400 bg-[#121212] text-white"
                  />
                </div>
              </div>

              {index < members.length - 1 && <div className="my-4 border-t border-gray-600"></div>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
