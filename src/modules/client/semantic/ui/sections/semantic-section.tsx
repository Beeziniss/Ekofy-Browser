"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  trackSemanticOptions,
  userActiveSubscriptionOptions,
  trackSongCatcherOptions,
  trackSongCatcherRecordingOptions,
} from "@/gql/options/client-options";
import { Input } from "@/components/ui/input";
import { Search, Lock, Mic, FileMusic } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import SemanticTrackItem from "@/modules/client/semantic/ui/components/semantic-track-item";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuthStore } from "@/store";
import { SubscriptionTier } from "@/gql/graphql";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AudioRecorderDialog from "@/modules/client/semantic/ui/components/audio-recorder-dialog";
import AudioUploadDialog from "@/modules/client/semantic/ui/components/audio-upload-dialog";
import SongMatchResultDialog from "@/modules/client/semantic/ui/components/song-match-result-dialog";

const SemanticSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();

  // Check user subscription
  const { data: activeSubscription, isLoading: isLoadingSubscription } = useQuery({
    ...userActiveSubscriptionOptions(user?.userId || ""),
    enabled: isAuthenticated && !!user?.userId,
  });

  const hasAccess =
    activeSubscription?.subscription?.[0]?.tier === SubscriptionTier.Premium ||
    activeSubscription?.subscription?.[0]?.tier === SubscriptionTier.Pro;

  // Initialize search term from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Song identification states
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [songMatchResult, setSongMatchResult] = useState<{
    trackId?: string | null;
    trackName?: string | null;
    artistName?: string | null;
    trackMatchStartsAt?: number | null;
    trackMatchEndsAt?: number | null;
  } | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [identificationError, setIdentificationError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecordedAudio, setIsRecordedAudio] = useState(false);

  // Song catcher query for recorded audio
  const { data: recordedSongCatcherData, isFetching: isRecordedSongCatcherFetching } = useQuery({
    ...trackSongCatcherRecordingOptions(audioFile!),
    enabled: !!audioFile && isRecordedAudio,
  });

  // Song catcher query for uploaded audio
  const { data: uploadedSongCatcherData, isFetching: isUploadedSongCatcherFetching } = useQuery({
    ...trackSongCatcherOptions(audioFile!),
    enabled: !!audioFile && !isRecordedAudio,
  });

  // Combine the data and fetching states
  const isSongCatcherFetching = isRecordedSongCatcherFetching || isUploadedSongCatcherFetching;

  // Handle song catcher result
  useEffect(() => {
    if (!isSongCatcherFetching && audioFile) {
      // Get the correct data field based on whether it's recorded or uploaded
      const results = isRecordedAudio
        ? recordedSongCatcherData?.queryTracksForRecording
        : uploadedSongCatcherData?.queryTracks;

      if (results && results.length > 0) {
        // Take the first (best) match from the array
        setSongMatchResult(results[0]);
        setIsResultOpen(true);
      } else {
        setSongMatchResult(null);
        setIsResultOpen(true);
      }

      // Reset states
      setAudioFile(null);
      setIsRecorderOpen(false);
      setIsUploadOpen(false);
    }
  }, [recordedSongCatcherData, uploadedSongCatcherData, isSongCatcherFetching, audioFile, isRecordedAudio]);

  const { data, isLoading, error } = useQuery({
    ...trackSemanticOptions(debouncedSearchTerm),
    enabled: hasAccess, // Only fetch if user has access
  });

  const tracks = data || [];

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle audio file identification from recording
  const handleRecordedAudioIdentification = (file: File) => {
    setIdentificationError(null);
    setSongMatchResult(null);
    setIsRecordedAudio(true);
    setAudioFile(file);
  };

  // Handle audio file identification from upload
  const handleUploadedAudioIdentification = (file: File) => {
    setIdentificationError(null);
    setSongMatchResult(null);
    setIsRecordedAudio(false);
    setAudioFile(file);
  };

  // Update URL when debounced search term changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchTerm) {
      params.set("q", debouncedSearchTerm);
    } else {
      params.delete("q");
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearchTerm, pathname, router, searchParams]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoadingSubscription) {
      router.push("/");
    }
  }, [isAuthenticated, isLoadingSubscription, router]);

  // Show loading state while checking subscription
  if (isLoadingSubscription) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="bg-main-purple size-2 animate-bounce rounded-full" style={{ animationDelay: "0s" }} />
          <div className="bg-main-purple size-2 animate-bounce rounded-full" style={{ animationDelay: "0.1s" }} />
          <div className="bg-main-purple size-2 animate-bounce rounded-full" style={{ animationDelay: "0.2s" }} />
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have Premium or Pro subscription
  if (isAuthenticated && !hasAccess) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-8 text-center">
        <Lock className="text-main-purple mb-6 size-20" />
        <h2 className="text-main-white mb-4 text-3xl font-bold">Premium Feature</h2>
        <p className="text-main-grey mb-8 text-lg">
          Smart Search is an exclusive feature available only for Premium and Pro subscribers.
        </p>
        <p className="text-main-grey mb-8">
          Upgrade your subscription to unlock AI-powered natural language search and discover music like never before.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="default" size="lg">
            <Link href="/subscription">Upgrade to Premium</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tracks by natural language (e.g., 'sad songs about love', 'upbeat workout music')..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-main-dark-bg border-main-grey text-main-white placeholder:text-main-grey focus-visible:ring-main-purple h-12 rounded-full border pr-4 pl-11"
            />
          </div>

          {/* Audio Identification Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsRecorderOpen(true)}
            disabled={isSongCatcherFetching}
            className="border-main-grey hover:bg-main-purple/20 hover:border-main-purple text-main-grey hover:text-main-purple size-12 shrink-0 rounded-full"
            title="Record audio to identify song"
          >
            <Mic className="size-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsUploadOpen(true)}
            disabled={isSongCatcherFetching}
            className="border-main-grey hover:bg-main-purple/20 hover:border-main-purple text-main-grey hover:text-main-purple size-12 shrink-0 rounded-full"
            title="Upload audio file to identify song"
          >
            <FileMusic className="size-5" />
          </Button>
        </div>
      </div>

      {/* Results Header */}
      {/* {debouncedSearchTerm && (
        <div className="mb-4">
          <h2 className="text-main-white text-xl font-semibold">
            {isLoading ? (
              "Searching..."
            ) : tracks.length > 0 ? (
              <>
                Found {tracks.length}+ playlist{tracks.length !== 1 ? "s" : ""}, {tracks.length}+ track
                {tracks.length !== 1 ? "s" : ""}, {tracks.length}+ people
              </>
            ) : (
              "No results found"
            )}
          </h2>
        </div>
      )} */}

      {/* Track List */}
      <div className="space-y-4">
        {isLoading && debouncedSearchTerm && (
          <div className="text-main-grey flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="bg-main-purple size-2 animate-bounce rounded-full" style={{ animationDelay: "0s" }} />
              <div className="bg-main-purple size-2 animate-bounce rounded-full" style={{ animationDelay: "0.1s" }} />
              <div className="bg-main-purple size-2 animate-bounce rounded-full" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}

        {error && (
          <div className="text-main-grey flex items-center justify-center py-12">
            <p>Error loading tracks. Please try again.</p>
          </div>
        )}

        {!isLoading && debouncedSearchTerm && tracks.length === 0 && (
          <div className="text-main-grey flex flex-col items-center justify-center py-12">
            <p className="mb-2 text-lg">No tracks found for &quot;{debouncedSearchTerm}&quot;</p>
            <p className="text-sm">Try different keywords or phrases</p>
          </div>
        )}

        {!isLoading &&
          tracks.length > 0 &&
          tracks.map((track) => <SemanticTrackItem key={track.id} track={track} allTracks={tracks} />)}
      </div>

      {/* Empty State */}
      {!debouncedSearchTerm && (
        <div className="text-main-grey flex flex-col items-center justify-center py-20">
          <Search className="mb-4 size-16 opacity-20" />
          <p className="mb-2 text-lg font-semibold">Start searching for tracks</p>
          <p className="text-sm">Use natural language to describe the music you&apos;re looking for</p>
        </div>
      )}

      {/* Dialogs */}
      <AudioRecorderDialog
        open={isRecorderOpen}
        onOpenChange={setIsRecorderOpen}
        onRecordingComplete={handleRecordedAudioIdentification}
      />

      <AudioUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onFileSelect={handleUploadedAudioIdentification}
        isProcessing={isSongCatcherFetching}
      />

      <SongMatchResultDialog
        open={isResultOpen}
        onOpenChange={setIsResultOpen}
        result={songMatchResult}
        error={identificationError}
      />
    </div>
  );
};

export default SemanticSection;
