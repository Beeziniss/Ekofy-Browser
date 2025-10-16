"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArtistMember, UserGender } from "@/gql/graphql";

interface BandMembersCardProps {
  members: ArtistMember[];
}

export function BandMembersCard({ members }: BandMembersCardProps) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <Card className="bg-[#121212] border-gray-400 border-2 border-solid transparent text-white">
      <CardHeader>
        <CardTitle className="text-white text-lg font-semibold">Optional Artist type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-[#121212] border border-gray-400 border-2 border-solid transparent rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4">Artist Members</h4>
          
          {members.map((member, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-medium">
                  Member {index + 1}
                  {member.isLeader && (
                    <span className="ml-2 text-red-400 text-sm">(Leader)</span>
                  )}
                </h5>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Full name</label>
                  <Input 
                    value={member.fullName} 
                    readOnly 
                    className="bg-[#121212] border-gray-400 border-2 border-solid transparent text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Email</label>
                  <Input 
                    value={member.email} 
                    readOnly 
                    className="bg-[#121212] border-gray-400 border-2 border-solid transparent text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Phone Number</label>
                  <Input 
                    value={member.phoneNumber} 
                    readOnly 
                    className="bg-[#121212] border-gray-400 border-2 border-solid transparent text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Gender</label>
                  <Input 
                    value={member.gender} 
                    readOnly 
                    className="bg-[#121212] border-gray-400 border-2 border-solid transparent text-white"
                  />
                </div>
              </div>
              
              {index < members.length - 1 && (
                <div className="border-t border-gray-600 my-4"></div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}