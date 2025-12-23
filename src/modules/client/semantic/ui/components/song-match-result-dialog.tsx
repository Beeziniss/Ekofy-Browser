"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Music, X, ExternalLink } from "lucide-react";
import Link from "next/link";

interface SongMatchResult {
  trackId?: string | null;
  trackName?: string | null;
  artistId?: string | null;
  artistName?: string | null;
  queryCoverage?: number | null;
  trackCoverage?: number | null;
  minConfidence?: number | null;
}

interface SongMatchResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: SongMatchResult | null;
  error?: string | null;
}

const SongMatchResultDialog = ({ open, onOpenChange, result, error }: SongMatchResultDialogProps) => {
  const isMatch = result && result.trackId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-main-dark-bg border-main-grey max-w-md">
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

                {/* Song Details */}
                <div className="bg-main-grey/10 space-y-3 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-main-purple/20 flex size-12 shrink-0 items-center justify-center rounded-lg">
                      <Music className="text-main-purple size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-main-grey text-xs">Track Name</p>
                      <p className="text-main-white truncate font-semibold">{result.trackName || "Unknown"}</p>
                    </div>
                  </div>

                  {result.artistName && (
                    <div className="border-main-grey/30 border-t pt-3">
                      <p className="text-main-grey mb-1 text-xs">Artist</p>
                      <p className="text-main-white font-medium">{result.artistName}</p>
                    </div>
                  )}
                </div>

                {/* Confidence Metrics */}
                {(result.queryCoverage !== null || result.trackCoverage !== null || result.minConfidence !== null) && (
                  <div className="bg-main-grey/10 space-y-2 rounded-lg p-4">
                    <p className="text-main-white mb-2 text-sm font-medium">Match Quality</p>
                    <div className="space-y-2 text-xs">
                      {result.queryCoverage !== null && result.queryCoverage !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-main-grey">Query Coverage</span>
                          <span className="text-main-white font-medium">
                            {(result.queryCoverage * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                      {result.trackCoverage !== null && result.trackCoverage !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-main-grey">Track Coverage</span>
                          <span className="text-main-white font-medium">
                            {(result.trackCoverage * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                      {result.minConfidence !== null && result.minConfidence !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-main-grey">Confidence</span>
                          <span className="text-main-white font-medium">
                            {(result.minConfidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
                    Close
                  </Button>
                  {result.trackId && (
                    <Button asChild className="bg-main-purple hover:bg-main-purple/90 flex-1 gap-2">
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
