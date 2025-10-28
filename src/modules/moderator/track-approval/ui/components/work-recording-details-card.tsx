"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { FileText, Music2, Percent } from "lucide-react";
import { TrackUploadRequest } from "@/types/approval-track";

interface WorkRecordingDetailsCardProps {
  track: TrackUploadRequest;
}

export function WorkRecordingDetailsCard({ track }: WorkRecordingDetailsCardProps) {
  const hasWorkInfo = track.work?.description || (track.work?.workSplits && track.work.workSplits.length > 0);
  const hasRecordingInfo = track.recording?.description || (track.recording?.recordingSplitRequests && track.recording.recordingSplitRequests.length > 0);

  // Helper functions to get user names
  const getWorkUserName = (userId: string) => {
    const user = track.workUsers?.items?.find(user => user.id === userId);
    return user?.fullName || `User ID: ${userId}`;
  };

  const getRecordingUserName = (userId: string) => {
    const user = track.recordingUsers?.items?.find(user => user.id === userId);
    return user?.fullName || `User ID: ${userId}`;
  };

  if (!hasWorkInfo && !hasRecordingInfo) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Work & Recording Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Work Information */}
        {hasWorkInfo && (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Work Information
            </h3>
            
            {track.work?.description && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">{track.work.description}</p>
              </div>
            )}

            {track.work?.workSplits && track.work.workSplits.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Percent className="h-3 w-3" />
                  Work Splits
                </h4>
                <div className="space-y-2">
                  {track.work.workSplits.map((split, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{getWorkUserName(split.userId)}</p>
                        <Badge variant="outline" className="text-xs">{split.artistRole}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{split.percentage}%</p>
                        <Progress value={split.percentage} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {hasWorkInfo && hasRecordingInfo && <Separator />}

        {/* Recording Information */}
        {hasRecordingInfo && (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Music2 className="h-4 w-4" />
              Recording Information
            </h3>
            
            {track.recording?.description && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">{track.recording.description}</p>
              </div>
            )}

            {track.recording?.recordingSplitRequests && track.recording.recordingSplitRequests.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Percent className="h-3 w-3" />
                  Recording Split Requests
                </h4>
                <div className="space-y-2">
                  {track.recording.recordingSplitRequests.map((split, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{getRecordingUserName(split.userId)}</p>
                        <Badge variant="outline" className="text-xs">{split.artistRole}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{split.percentage}%</p>
                        <Progress value={split.percentage} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}