"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Users, Music } from "lucide-react";
import { TrackUploadRequest } from "@/types/approval-track";

interface ArtistsContributorsCardProps {
  track: TrackUploadRequest;
}

export function ArtistsContributorsCard({ track }: ArtistsContributorsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Artists & Contributors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Artists */}
        {track.mainArtists?.items && track.mainArtists.items.length > 0 && (
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-medium">
              <Music className="h-4 w-4" />
              Main Artists
            </h3>
            <div className="grid gap-3">
              {track.mainArtists.items.map((artist) => (
                <div key={artist.id} className="flex items-center gap-3 rounded-lg border-2 border-white p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={artist.avatarImage || undefined} alt={artist.stageName} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{artist.stageName}</p>
                    <p className="text-muted-foreground text-sm">{artist.email}</p>
                    <p className="text-muted-foreground text-xs">User ID: {artist.userId}</p>
                  </div>
                  <Badge variant="outline">{artist.artistType}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Artists */}
        {track.featuredArtists?.items && track.featuredArtists.items.length > 0 && (
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-medium">
              <Music className="h-4 w-4" />
              Featured Artists
            </h3>
            <div className="grid gap-3">
              {track.featuredArtists.items.map((artist) => (
                <div key={artist.id} className="bg-muted flex items-center gap-3 rounded-lg p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{artist.stageName}</p>
                    <p className="text-muted-foreground text-sm">{artist.email}</p>
                    <p className="text-muted-foreground text-xs">User ID: {artist.userId}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recording Users */}
        {track.recordingUsers?.items && track.recordingUsers.items.length > 0 && (
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-medium">
              <User className="h-4 w-4" />
              Recording Contributors
            </h3>
            <div className="grid gap-3">
              {track.recordingUsers.items.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-lg border-2 border-white p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    <div className="text-muted-foreground space-x-2 text-xs">
                      <span>Gender: {user.gender}</span>
                      {user.phoneNumber && <span>• Phone: {user.phoneNumber}</span>}
                    </div>
                  </div>
                  <Badge
                    className={`${user.status === "ACTIVE" ? "bg-green-700 text-white" : "bg-red-700 text-white"}`}
                  >
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Users */}
        {track.workUsers?.items && track.workUsers.items.length > 0 && (
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-medium">
              <User className="h-4 w-4" />
              Work Contributors
            </h3>
            <div className="grid gap-3">
              {track.workUsers.items.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-lg border-2 border-white p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    <div className="text-muted-foreground space-x-2 text-xs">
                      <span>Gender: {user.gender}</span>
                      {user.phoneNumber && <span>• Phone: {user.phoneNumber}</span>}
                    </div>
                  </div>
                  <Badge
                    className={`${user.status === "ACTIVE" ? "bg-green-700 text-white" : "bg-red-700 text-white"}`}
                  >
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
