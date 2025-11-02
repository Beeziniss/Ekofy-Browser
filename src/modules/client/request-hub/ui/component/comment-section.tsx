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
import { SendIcon, MessageSquare } from "lucide-react";
import RequestHubCommentUser from "./request-hub-comment-user";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { createRequestHubCommentMutationOptions } from "@/gql/options/client-mutation-options";
import { CommentType } from "@/gql/graphql";
import { requestHubCommentsOptions, userForRequestsOptions } from "@/gql/options/client-options";
import { useState } from "react";
import { useAuthStore } from "@/store";

interface RequestHubCommentSectionProps {
  requestId: string;
}

const RequestHubCommentSection = ({
  requestId,
}: RequestHubCommentSectionProps) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { user } = useAuthStore();

  // Fetch current user data for avatar and name
  const { data: currentUserData } = useQuery({
    ...userForRequestsOptions(user?.userId || ""),
    enabled: !!user?.userId,
  });

  const { data: commentsData } = useSuspenseQuery(
    requestHubCommentsOptions(requestId),
  );
  const { mutate: createComment, isPending } = useMutation({
    ...createRequestHubCommentMutationOptions,
    onSuccess: () => {
      // Invalidate and refetch comments after successful creation
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comments", requestId],
      });
    },
  });

  const handleCreateComment = (content: string) => {
    createComment({
      targetId: requestId,
      commentType: CommentType.RequestHub,
      content,
    });
  };

  const handleSubmitComment = () => {
    if (comment.trim() && !isPending) {
      handleCreateComment(comment.trim());
      setComment("");
    }
  };

  const getTotalCommentCount = () => {
    if (!commentsData?.threadedComments) return 0;
    
    const threads = commentsData.threadedComments.threads || [];
    return threads.reduce((total, thread) => {
      // Count root comment + all replies
      return total + 1 + (thread.totalReplies || 0);
    }, 0);
  };
  
  const totalComments = getTotalCommentCount();

  return (
    <div className="w-full space-y-6 p-4 rounded-lg border border-gray-700/50">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <span className="text-white text-lg font-semibold">
            {totalComments > 0 && `(${totalComments})`} Comments
          </span>
        </div>

        <Select defaultValue="sort-newest">
          <SelectTrigger className="w-[140px] bg-gray-800 border-gray-600 text-gray-200">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent side="bottom" align="end" className="bg-gray-800 border-gray-600">
            <SelectGroup>
              <SelectLabel className="text-gray-400">Sort Options</SelectLabel>
              <SelectItem value="sort-newest" className="text-gray-200 focus:bg-gray-700">Newest First</SelectItem>
              <SelectItem value="sort-most-liked" className="text-gray-200 focus:bg-gray-700">Most Liked</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Comment Input */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-700/30">
        <Avatar className="w-10 h-10 border-2 border-purple-500/30">
          <AvatarImage
            src={undefined}
            alt={currentUserData?.fullName || "User"}
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-medium">
            {currentUserData?.fullName?.slice(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="relative">
            <Input
              placeholder="Share your thoughts on this request..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
              className="bg-gray-700/50 border-gray-600/50 text-gray-100 placeholder-gray-400 rounded-lg px-4 py-3 pr-16 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
            />

            <Button
              onClick={handleSubmitComment}
              disabled={!comment.trim() || isPending}
              size="sm"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 primary_gradient hover:opacity-70 text-white border-0 px-3 py-1.5 disabled:cursor-not-allowed"
            >
              <SendIcon className="w-4 h-4 mr-1" />
              {isPending ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {commentsData.threadedComments.threads &&
        commentsData.threadedComments.threads.length > 0 ? (
          commentsData.threadedComments.threads.map((thread, index) => (
            <div key={`${thread.rootComment.id}-${index}`} className="rounded-lg p-4 border border-gray-700/30">
              <RequestHubCommentUser
                thread={thread}
                requestId={requestId}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium mb-2">No comments yet</p>
            <p className="text-gray-500 text-sm">Be the first to share your thoughts on this request!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestHubCommentSection;