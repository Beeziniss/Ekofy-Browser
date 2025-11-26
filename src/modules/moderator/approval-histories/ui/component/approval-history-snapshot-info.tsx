"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Eye } from "lucide-react";
import { format } from "date-fns";
import { ApprovalHistorySnapshot } from "@/types";
import Image from "next/image";

interface ApprovalHistorySnapshotInfoProps {
  snapshot: ApprovalHistorySnapshot;
}

export const ApprovalHistorySnapshotInfo = ({ snapshot }: ApprovalHistorySnapshotInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Artist Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="font-medium">Full Name:</label>
            <p className="text-muted-foreground text-sm">{snapshot.FullName}</p>
          </div>
          <div>
            <label className="font-medium">Email:</label>
            <p className="text-muted-foreground text-sm">{snapshot.Email}</p>
          </div>
          <div>
            <label className="font-medium">Stage Name:</label>
            <p className="text-muted-foreground text-sm">{snapshot.StageName}</p>
          </div>
          <div>
            <label className="font-medium">Artist Type:</label>
            <p className="text-muted-foreground text-sm">{snapshot.ArtistType}</p>
          </div>
          <div>
            <label className="font-medium">Phone Number:</label>
            <p className="text-muted-foreground text-sm">{snapshot.PhoneNumber}</p>
          </div>
          <div>
            <label className="font-medium">Gender:</label>
            <p className="text-muted-foreground text-sm">{snapshot.Gender}</p>
          </div>
          <div>
            <label className="font-medium">Birth Date:</label>
            <p className="text-muted-foreground text-sm">{format(new Date(snapshot.BirthDate), "MMM dd, yyyy")}</p>
          </div>
          <div>
            <label className="font-medium">Requested At:</label>
            <p className="text-muted-foreground text-sm">
              {format(new Date(snapshot.RequestedAt), "MMM dd, yyyy HH:mm:ss")}
            </p>
          </div>
        </div>

        <Separator />

        {/* Members */}
        <div>
          <h4 className="mb-3 font-medium">Members</h4>
          <div className="grid gap-3">
            {snapshot.Members.map((member, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium">Name:</span>
                    <p className="text-muted-foreground text-sm">{member.FullName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p className="text-muted-foreground text-sm">{member.Email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Phone:</span>
                    <p className="text-muted-foreground text-sm">{member.PhoneNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Role:</span>
                    <Badge variant={member.IsLeader ? "default" : "secondary"} className="ml-2">
                      {member.IsLeader ? "Leader" : "Member"}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Identity Card */}
        <div>
          <h4 className="mb-3 font-medium">Identity Card Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="font-medium">ID Number:</label>
              <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.Number}</p>
            </div>
            <div>
              <label className="font-medium">Full Name:</label>
              <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.FullName}</p>
            </div>
            <div>
              <label className="font-medium">Date of Birth:</label>
              <p className="text-muted-foreground text-sm">
                {format(new Date(snapshot.IdentityCard.DateOfBirth), "MMM dd, yyyy")}
              </p>
            </div>
            <div>
              <label className="font-medium">Gender:</label>
              <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.Gender}</p>
            </div>
            <div>
              <label className="font-medium">Nationality:</label>
              <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.Nationality}</p>
            </div>
            <div>
              <label className="font-medium">Place of Origin:</label>
              <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.PlaceOfOrigin}</p>
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Address:</label>
              <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.PlaceOfResidence.AddressLine}</p>
            </div>
            <div>
              <label className="font-medium">Valid Until:</label>
              <p className="text-muted-foreground text-sm">
                {format(new Date(snapshot.IdentityCard.ValidUntil), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* Identity Card Images */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="font-medium">Front Image:</label>
              <div className="mt-2 rounded-lg border p-2">
                <Image
                  src={snapshot.IdentityCard.FrontImage}
                  alt="ID Front"
                  width={400}
                  height={300}
                  className="h-80 w-full rounded object-cover"
                />
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <a href={snapshot.IdentityCard.FrontImage} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    View Full Size
                  </a>
                </Button>
              </div>
            </div>
            <div>
              <label className="font-medium">Back Image:</label>
              <div className="mt-2 rounded-lg border p-2">
                <Image
                  src={snapshot.IdentityCard.BackImage}
                  alt="ID Back"
                  width={400}
                  height={300}
                  className="h-80 w-full rounded object-cover"
                />
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <a href={snapshot.IdentityCard.BackImage} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    View Full Size
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
