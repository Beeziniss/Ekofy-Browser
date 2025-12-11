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
import { SendIcon, MessageSquare, UserIcon } from "lucide-react";
import RequestHubCommentUser from "./request-hub-comment-user";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createRequestHubCommentMutationOptions } from "@/gql/options/client-mutation-options";
import { CommentType } from "@/gql/graphql";
import { artistOptions, listenerOptions, requestHubCommentsOptions } from "@/gql/options/client-options";
import { useState } from "react";
import { useAuthStore } from "@/store";
import { useAuthDialog } from "../context/auth-dialog-context";

interface RequestHubCommentSectionProps {
  requestId: string;
}

const RequestHubCommentSection = ({ requestId }: RequestHubCommentSectionProps) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { user, isAuthenticated } = useAuthStore();
  const { showAuthDialog } = useAuthDialog();

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

  // Always fetch comments - no auth required to view
  const { data: commentsData } = useQuery(requestHubCommentsOptions(requestId));
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
      commentType: CommentType.Request,
      content,
    });
  };

  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      showAuthDialog("comment");
      return;
    }

    if (comment.trim() && !isPending) {
      handleCreateComment(comment.trim());
      setComment("");
    }
  };

  const handleInputClick = () => {
    if (!isAuthenticated) {
      showAuthDialog("comment");
    }
  };

  const getTotalCommentCount = () => {
    if (!commentsData?.threadedComments) return 0;

    const threads = commentsData.threadedComments.threads || [];
    return threads.reduce((total: number, thread: { totalReplies?: number }) => {
      // Count root comment + all replies
      return total + 1 + (thread.totalReplies || 0);
    }, 0);
  };

  const totalComments = getTotalCommentCount();

  return (
    <div className="w-full space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-400" />
          <span className="text-lg font-semibold text-white">{totalComments > 0 && `(${totalComments})`} Comments</span>
        </div>

        <Select defaultValue="sort-newest">
          <SelectTrigger className="w-[140px] border-gray-600 bg-gray-800 text-gray-200">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent side="bottom" align="end" className="border-gray-600">
            <SelectGroup>
              <SelectLabel className="text-gray-400">Sort Options</SelectLabel>
              <SelectItem value="sort-newest" className="text-gray-200 focus:bg-gray-700">
                Newest First
              </SelectItem>
              <SelectItem value="sort-most-liked" className="text-gray-200 focus:bg-gray-700">
                Most Liked
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Comment Input */}
      <div className="flex items-start gap-3 rounded-lg border border-gray-700/30 p-4">
        <Avatar className="h-10 w-10 border-2 border-purple-500/30">
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

        <div className="flex-1 space-y-3">
          <div className="relative">
            <Input
              placeholder={isAuthenticated ? "Share your thoughts on this request..." : "Sign in to comment..."}
              value={comment}
              onChange={(e) => {
                if (!isAuthenticated) {
                  showAuthDialog("comment");
                  return;
                }
                setComment(e.target.value);
              }}
              onClick={handleInputClick}
              onKeyDown={(e) => {
                if (!isAuthenticated) {
                  showAuthDialog("comment");
                  return;
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
              readOnly={!isAuthenticated}
              className="rounded-lg border-gray-600/50 bg-gray-700/50 px-4 py-3 pr-16 text-gray-100 placeholder-gray-400 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
            />

            <Button
              onClick={isAuthenticated ? handleSubmitComment : handleInputClick}
              disabled={isAuthenticated && (!comment.trim() || isPending)}
              size="sm"
              className={`absolute top-1/2 right-0.5 -translate-y-1/2 border-0 px-3 py-1.5 ${
                isAuthenticated
                  ? "primary_gradient text-white hover:opacity-70 disabled:cursor-not-allowed"
                  : "primary_gradient text-white hover:opacity-70"
              }`}
            >
              <SendIcon className="mr-1 h-4 w-4" />
              {isAuthenticated ? (isPending ? "Posting..." : "Comment") : "Sign In"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {commentsData?.threadedComments?.threads && commentsData.threadedComments.threads.length > 0 ? (
          commentsData.threadedComments.threads.map((thread, index) => (
            <div key={`${thread.rootComment.id}-${index}`} className="rounded-lg border border-gray-700/30 p-4">
              <RequestHubCommentUser 
              thread={thread} 
              requestId={requestId} 
              listenerData={listenerData}
              artistData={artistData}
              />
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-500" />
            <p className="mb-2 text-lg font-medium text-gray-400">No comments yet</p>
            <p className="text-sm text-gray-500">Be the first to share your thoughts on this request!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestHubCommentSection;
