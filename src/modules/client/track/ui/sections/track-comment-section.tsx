"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SendIcon, UserIcon } from "lucide-react";
import TrackCommentUser from "../components/track-comment-user";
import { useMutation, useQuery, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { createTrackCommentMutationOptions } from "@/gql/options/client-mutation-options";
import { CommentType, PopularityActionType } from "@/gql/graphql";
import { artistOptions, listenerOptions, trackCommentsOptions } from "@/gql/options/client-options";
import { useProcessTrackEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";
import { useState } from "react";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { useAuthAction } from "@/hooks/use-auth-action";
import { useAuthStore } from "@/store";

interface TrackCommentSectionProps {
  trackId: string;
}

const TrackCommentSection = ({ trackId }: TrackCommentSectionProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth } = useAuthAction();
  const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();

  const { data: artistData } = useQuery({
    ...artistOptions({
      userId: user?.userId || "",
      artistId: user?.artistId || "",
    }),
    enabled: isAuthenticated && !!user?.userId && !!user?.artistId,
  });
  const { data: listenerData } = useQuery({
    ...listenerOptions(user?.userId || "", user?.listenerId || ""),
    enabled: isAuthenticated && !!user?.userId && !!user?.listenerId,
  });

  const { data: commentsData } = useSuspenseQuery(trackCommentsOptions(trackId));
  const { mutate: createComment, isPending } = useMutation({
    ...createTrackCommentMutationOptions,
    onSuccess: () => {
      // Invalidate and refetch comments after successful creation
      queryClient.invalidateQueries({
        queryKey: ["track-comments", trackId],
      });
      // Track popularity for comment
      trackEngagementPopularity({
        trackId,
        actionType: PopularityActionType.Comment,
      });
    },
  });

  const handleCreateComment = (content: string) => {
    createComment({
      targetId: trackId,
      commentType: CommentType.Track,
      content,
    });
  };

  const handleSubmitComment = () => {
    executeWithAuth(() => {
      if (comment.trim() && !isPending) {
        handleCreateComment(comment.trim());
        setComment("");
      }
    }, "comment");
  };

  const getTotalCommentCount = () => {
    if (!commentsData?.threadedComments) return 0;

    const threads = commentsData.threadedComments.threads || [];
    return threads.reduce((total, thread) => {
      // Count root comment + all replies
      return total + 1 + (thread.totalReplies || 0);
    }, 0);
  };

  return (
    <div className="w-full space-y-8">
      {/* Track Comment Interaction */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-main-white text-lg font-bold">{getTotalCommentCount() || 0} Comments</span>

          {/* // TODO: refractor defaultValue and modify this sorting using api */}
          <Select defaultValue="sort-newest">
            <SelectTrigger className="!bg-main-card-bg w-fit border-none">
              <SelectValue placeholder="Select a sorting option" />
              {/* Sort by: Newest{" "}
                <ChevronDownIcon className="text-main-white size-6" /> */}
            </SelectTrigger>
            <SelectContent side="bottom" align="end">
              <SelectGroup>
                <SelectLabel>Options</SelectLabel>
                <SelectItem value="sort-newest">Sort by: Newest</SelectItem>
                <SelectItem value="sort-most-liked">Sort by: Most Liked</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-x-3">
          <Avatar className="size-12">
            <AvatarImage
              src={
                listenerData?.listeners?.items?.[0]?.avatarImage ||
                artistData?.artists?.items?.[0]?.avatarImage ||
                undefined
              }
            />
            <AvatarFallback>
              {listenerData?.listeners?.items?.[0]?.displayName.slice(0, 1) ||
                artistData?.artists?.items?.[0]?.stageName || <UserIcon className="size-6" />}
            </AvatarFallback>
          </Avatar>

          <div className="relative flex-1">
            <Input
              placeholder={isAuthenticated ? "Write a comment..." : "Sign in to comment..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
              onFocus={() => {
                if (!isAuthenticated) {
                  setShowWarningDialog(true);
                }
              }}
              className="bg-main-card-bg h-10 rounded-full border-white/30 px-3 py-2.5 pr-32"
            />

            <Button
              onClick={handleSubmitComment}
              disabled={!isAuthenticated || !comment.trim() || isPending}
              className="bg-main-white absolute top-0 right-0 h-10 rounded-tl-none rounded-tr-full rounded-br-full rounded-bl-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendIcon className="size-4" />
              <span className="text-sm">{isPending ? "Posting..." : "Comment"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Track Comments List */}
      <div className="flex flex-col gap-y-6">
        {commentsData.threadedComments.threads && commentsData.threadedComments.threads.length > 0 ? (
          commentsData.threadedComments.threads.map((thread, index) => (
            <TrackCommentUser
              key={`${thread.rootComment.id}-${index}`}
              thread={thread}
              trackId={trackId}
              listenerData={listenerData}
              artistData={artistData}
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">No comments yet. Be the first to comment!</div>
        )}
      </div>

      <WarningAuthDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        action={warningAction}
        trackName={trackName}
      />
    </div>
  );
};

export default TrackCommentSection;
