"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { TrackUploadRequest } from "@/types/approval-track";

interface TrackDetailSidebarProps {
  track: TrackUploadRequest;
  onDownloadOriginal: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function TrackDetailSidebar({ 
  track, 
  onDownloadOriginal, 
  onApprove, 
  onReject, 
  isApproving = false, 
  isRejecting = false 
}: TrackDetailSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            Review Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Pending Review
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            This track is awaiting moderator approval
          </p>
        </CardContent>
      </Card>

      {/* Review Actions */}
      {(onApprove || onReject) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {onApprove && (
              <Button 
                className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                onClick={onApprove}
                disabled={isApproving || isRejecting}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isApproving ? "Approving..." : "Approve Track"}
              </Button>
            )}
            {onReject && (
              <Button 
                variant="outline"
                className="w-full justify-start text-red-600 border-red-600 hover:bg-red-50"
                onClick={onReject}
                disabled={isApproving || isRejecting}
              >
                <XCircle className="mr-2 h-4 w-4" />
                {isRejecting ? "Rejecting..." : "Reject Track"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onDownloadOriginal}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Original
          </Button>
          {track.track.legalDocuments && track.track.legalDocuments.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                const element = document.getElementById('legal-documents');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Legal Documents
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Track Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Track Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <span className="font-medium">Type: </span>
            <span className="text-muted-foreground">{track.track.type}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Explicit: </span>
            <span className={track.track.isExplicit ? "text-red-600" : "text-green-600"}>
              {track.track.isExplicit ? "Yes" : "No"}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Categories: </span>
            <span className="text-muted-foreground">
              {track.track.categoryIds?.length || 0} categories
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Main Artists: </span>
            <span className="text-muted-foreground">
              {track.track.mainArtistIds?.length || 0} artists
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Featured Artists: </span>
            <span className="text-muted-foreground">
              {track.track.featuredArtistIds?.length || 0} artists
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Release Info */}
      {track.track.releaseInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Release Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Status: </span>
              <span className={track.track.releaseInfo.isReleased ? "text-green-600" : "text-muted-foreground"}>
                {track.track.releaseInfo.isReleased ? "Released" : "Not Released"}
              </span>
            </div>
            {track.track.releaseInfo.releaseDate && (
              <div className="text-sm">
                <span className="font-medium">Release Date: </span>
                <span className="text-muted-foreground">
                  {new Date(track.track.releaseInfo.releaseDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {track.track.releaseInfo.releasedAt && (
              <div className="text-sm">
                <span className="font-medium">Released At: </span>
                <span className="text-muted-foreground">
                  {new Date(track.track.releaseInfo.releasedAt).toLocaleString()}
                </span>
              </div>
            )}
            {track.track.releaseInfo.releaseStatus && (
              <div className="text-sm">
                <span className="font-medium">Release Status: </span>
                <Badge variant="outline">{track.track.releaseInfo.releaseStatus}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Request Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Request Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Requested: </span>
            <span className="text-muted-foreground">
              {new Date(track.requestedAt).toLocaleString()}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Created by: </span>
            <span className="text-muted-foreground">{track.createdBy}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}