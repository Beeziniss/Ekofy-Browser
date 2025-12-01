"use client";

import { useState } from "react";
import { ArrowLeftIcon, PencilIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TrackDetailInfoSection from "../sections/track-detail-info-section";
import TrackMetadataFormSection from "../sections/track-metadata-form-section";

interface TrackDetailViewProps {
  trackId: string;
}

const TrackDetailView = ({ trackId }: TrackDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full space-y-6 px-4 py-8">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/artist/studio/tracks"
          className="text-main-white hover:text-main-purple group border-b-main-white hover:border-b-main-purple flex w-fit items-center gap-x-2 border-b text-sm"
        >
          <ArrowLeftIcon className="text-main-white group-hover:text-main-purple size-4" />
          Back to Tracks
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/artist/studio/tracks/insights/${trackId}`}>
            <Button variant="outline" size="sm">
              <EyeIcon className="mr-2 size-4" />
              View Insights
            </Button>
          </Link>

          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <PencilIcon className="mr-2 size-4" />
              Edit Metadata
            </Button>
          )}
        </div>
      </div>

      {/* Track Info Section */}
      <TrackDetailInfoSection trackId={trackId} />

      {/* Metadata Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Track Metadata</h3>
            {isEditing && <Badge variant="secondary">Editing Mode</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <TrackMetadataFormSection
              trackId={trackId}
              onCancel={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
            />
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              <PencilIcon className="mx-auto mb-4 size-12 opacity-50" />
              <p className="mb-2 text-lg">Ready to update your track?</p>
              <p className="mb-4 text-sm">
                Edit categories, tags, and description to help listeners discover your music.
              </p>
              <Button onClick={() => setIsEditing(true)}>
                <PencilIcon className="mr-2 size-4" />
                Start Editing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackDetailView;
