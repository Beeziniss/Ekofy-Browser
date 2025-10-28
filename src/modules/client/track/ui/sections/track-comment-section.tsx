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
import { SendIcon } from "lucide-react";
import TrackCommentUser from "../components/track-comment-user";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createTrackCommentMutationOptions } from "@/gql/options/client-mutation-options";
import { ArtistQuery, CommentType, ListenerQuery } from "@/gql/graphql";
import { trackCommentsOptions } from "@/gql/options/client-options";
import { useState } from "react";

interface TrackCommentSectionProps {
  trackId: string;
  listenerData?: ListenerQuery;
  artistData?: ArtistQuery;
}

const TrackCommentSection = ({
  trackId,
  listenerData,
  artistData,
}: TrackCommentSectionProps) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const { data: commentsData } = useSuspenseQuery(
    trackCommentsOptions(trackId),
  );
  const { mutate: createComment, isPending } = useMutation({
    ...createTrackCommentMutationOptions,
    onSuccess: () => {
      // Invalidate and refetch comments after successful creation
      queryClient.invalidateQueries({
        queryKey: ["track-comments", trackId],
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
    if (comment.trim() && !isPending) {
      handleCreateComment(comment.trim());
      setComment("");
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Track Comment Interaction */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-main-white text-lg font-bold">
            {commentsData.threadedComments.totalThreads || 0} Threads
          </span>

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
                <SelectItem value="sort-most-liked">
                  Sort by: Most Liked
                </SelectItem>
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
                artistData?.artists?.items?.[0]?.stageName ||
                "Unknown"}
            </AvatarFallback>
          </Avatar>

          <div className="relative flex-1">
            <Input
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
              className="bg-main-card-bg h-10 rounded-full border-white/30 px-3 py-2.5 pr-32"
            />

            <Button
              onClick={handleSubmitComment}
              disabled={!comment.trim() || isPending}
              className="bg-main-white absolute top-0 right-0 h-10 rounded-tl-none rounded-tr-full rounded-br-full rounded-bl-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendIcon className="size-4" />
              <span className="text-sm">
                {isPending ? "Posting..." : "Comment"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Track Comments List */}
      <div className="flex flex-col gap-y-6">
        {commentsData.threadedComments.threads &&
        commentsData.threadedComments.threads.length > 0 ? (
          commentsData.threadedComments.threads.map((thread, index) => (
            <TrackCommentUser
              key={`${thread.rootComment.id}-${index}`}
              thread={thread}
              trackId={trackId}
            />
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackCommentSection;
