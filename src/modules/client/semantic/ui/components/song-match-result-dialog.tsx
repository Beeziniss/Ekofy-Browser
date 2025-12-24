"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Music, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { trackDetailOptions } from "@/gql/options/client-options";
import Image from "next/image";

// Helper function to format seconds to MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

interface SongMatchResult {
  trackId?: string | null;
  trackName?: string | null;
  artistName?: string | null;
  trackMatchStartsAt?: number | null;
  trackMatchEndsAt?: number | null;
}

interface SongMatchResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: SongMatchResult | null;
  error?: string | null;
}

const SongMatchResultDialog = ({ open, onOpenChange, result, error }: SongMatchResultDialogProps) => {
  const isMatch = result && result.trackId;

  // Fetch track details if we have a trackId
  const { data: trackData } = useQuery({
    ...trackDetailOptions(result?.trackId || ""),
    enabled: !!result?.trackId && open,
  });

  const trackDetail = trackData?.tracks?.items?.[0];
  const coverImage = trackDetail?.coverImage;
  const categories = trackDetail?.categories?.items || [];
  const mainArtists = trackDetail?.mainArtists?.items || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-main-white/30 w-full sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-main-white text-2xl">Song Identification Result</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <X className="mt-0.5 size-5 shrink-0 text-red-500" />
                <div>
                  <p className="mb-1 font-medium text-red-500">Error</p>
                  <p className="text-main-grey text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!error && isMatch && (
            <>
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="bg-main-purple/20 flex size-20 items-center justify-center rounded-full">
                  <Check className="text-main-purple size-10" />
                </div>
              </div>

              {/* Match Info */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-main-white mb-1 text-xl font-bold">Match Found!</h3>
                  <p className="text-main-grey text-sm">We identified your song</p>
                </div>

                {/* Cover Image and Song Details */}
                <div className="bg-main-grey/10 space-y-3 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Cover Image */}
                    {coverImage ? (
                      <div className="relative size-36 shrink-0 overflow-hidden rounded-lg">
                        <Image src={coverImage} alt={result.trackName || "Track cover"} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="bg-main-purple/20 flex size-36 shrink-0 items-center justify-center rounded-lg">
                        <Music className="text-main-purple size-12" />
                      </div>
                    )}

                    {/* Track Info */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div>
                        <p className="text-main-grey text-xs">Track Name</p>
                        <p className="text-main-white text-lg font-semibold">{result.trackName || "Unknown"}</p>
                      </div>

                      {result.artistName && (
                        <div>
                          <p className="text-main-grey text-xs">Artist</p>
                          <p className="text-main-white font-medium">{result.artistName}</p>
                        </div>
                      )}

                      {/* Display additional artists if available from track detail */}
                      {mainArtists.length > 0 && !result.artistName && (
                        <div>
                          <p className="text-main-grey text-xs">Artist{mainArtists.length > 1 ? "s" : ""}</p>
                          <p className="text-main-white font-medium">
                            {mainArtists.map((artist) => artist.stageName).join(", ")}
                          </p>
                        </div>
                      )}

                      {/* Categories */}
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {categories.slice(0, 3).map((category) => (
                            <span
                              key={category.id}
                              className="bg-main-purple/20 text-main-purple rounded-full px-2 py-0.5 text-xs"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stream/Favorite Count */}
                  {trackDetail && (
                    <div className="border-main-grey/30 flex gap-4 border-t pt-3 text-xs">
                      {trackDetail.streamCount !== undefined && (
                        <div>
                          <span className="text-main-grey">Streams: </span>
                          <span className="text-main-white font-medium">
                            {trackDetail.streamCount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {trackDetail.favoriteCount !== undefined && (
                        <div>
                          <span className="text-main-grey">Favorites: </span>
                          <span className="text-main-white font-medium">
                            {trackDetail.favoriteCount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Track Match Timing */}
                {result.trackMatchStartsAt !== null && result.trackMatchStartsAt !== undefined && (
                  <div className="bg-main-grey/10 space-y-2 rounded-lg p-4">
                    <p className="text-main-white mb-2 text-sm font-medium">Match Position</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-main-grey">Starts At</span>
                        <span className="text-main-white font-medium">{formatTime(result.trackMatchStartsAt)}</span>
                      </div>
                      {result.trackMatchEndsAt !== null && result.trackMatchEndsAt !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-main-grey">Ends At</span>
                          <span className="text-main-white font-medium">{formatTime(result.trackMatchEndsAt)}</span>
                        </div>
                      )}
                      {result.trackMatchEndsAt !== null && result.trackMatchEndsAt !== undefined && (
                        <div className="border-main-grey/30 mt-2 border-t pt-2">
                          <div className="flex justify-between">
                            <span className="text-main-grey">Duration</span>
                            <span className="text-main-purple font-medium">
                              {formatTime(result.trackMatchEndsAt - result.trackMatchStartsAt)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-main-grey mt-3 text-xs italic">
                      Your audio matches this track from {formatTime(result.trackMatchStartsAt)}
                      {result.trackMatchEndsAt !== null && result.trackMatchEndsAt !== undefined && (
                        <> to {formatTime(result.trackMatchEndsAt)}</>
                      )}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
                    Close
                  </Button>
                  {result.trackId && (
                    <Button asChild className="bg-main-purple hover:bg-main-purple/90 text-main-white flex-1 gap-2">
                      <Link href={`/track/${result.trackId}`}>
                        View Track
                        <ExternalLink className="size-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {!error && !isMatch && (
            <>
              {/* No Match Icon */}
              <div className="flex justify-center">
                <div className="bg-main-grey/20 flex size-20 items-center justify-center rounded-full">
                  <X className="text-main-grey size-10" />
                </div>
              </div>

              <div className="space-y-4 text-center">
                <div>
                  <h3 className="text-main-white mb-2 text-xl font-bold">No Match Found</h3>
                  <p className="text-main-grey text-sm">We couldn&apos;t identify the song from the audio provided.</p>
                </div>

                <div className="bg-main-grey/10 rounded-lg p-4 text-left">
                  <p className="text-main-grey mb-2 text-xs font-medium">Suggestions:</p>
                  <ul className="text-main-grey list-inside list-disc space-y-1 text-xs">
                    <li>Try recording a longer sample (15-30 seconds)</li>
                    <li>Ensure the audio quality is clear</li>
                    <li>Reduce background noise if possible</li>
                    <li>Make sure the song is in our database</li>
                  </ul>
                </div>

                <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SongMatchResultDialog;
