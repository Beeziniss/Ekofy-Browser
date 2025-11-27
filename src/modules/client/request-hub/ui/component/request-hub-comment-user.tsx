"use client";

import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/format-number";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDownIcon, ChevronUpIcon, HeartIcon, SendIcon, MoreVertical, Edit, Trash2, Flag } from "lucide-react";
import React, { useState } from "react";
import RequestHubCommentReply from "./request-hub-comment-reply";
import { CommentThread, CommentType, ReportRelatedContentType } from "@/gql/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRequestHubCommentMutationOptions,
  updateRequestHubCommentMutationOptions,
  deleteRequestHubCommentMutationOptions,
} from "@/gql/options/client-mutation-options";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { useAuthDialog } from "../context/auth-dialog-context";
import { ReportDialog } from "@/modules/shared/ui/components/report-dialog";

interface RequestHubCommentUserProps {
  thread: Omit<CommentThread, "hasMoreReplies" | "lastActivity">;
  requestId: string;
  level?: number;
}

const RequestHubCommentUser = ({ thread, requestId, level = 0 }: RequestHubCommentUserProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const { showAuthDialog } = useAuthDialog();
  const comment = thread.rootComment;

  // Check if current user is the owner of this comment
  const isOwner = user?.userId === comment.commenterId;

  const { mutate: createReply, isPending } = useMutation({
    ...createRequestHubCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comments", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comment-replies", comment.id],
      });
      setReplyContent("");
      setShowReplyInput(false);
    },
  });

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    ...updateRequestHubCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comments", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comment-replies", comment.id],
      });
      setIsEditing(false);
      setEditContent("");
      toast.success("Comment updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update comment");
      console.error("Update comment error:", error);
    },
  });

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    ...deleteRequestHubCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comments", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comment-replies", comment.id],
      });
      setShowDeleteDialog(false);
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete comment");
      console.error("Delete comment error:", error);
    },
  });

  const handleShowReplyInput = () => {
    if (!isAuthenticated) {
      showAuthDialog("reply");
      return;
    }
    setShowReplyInput(!showReplyInput);
  };

  const handleCreateReply = () => {
    if (replyContent.trim() && !isPending) {
      createReply({
        targetId: requestId,
        commentType: CommentType.Request,
        content: replyContent.trim(),
        parentCommentId: comment.id,
      });
    }
  };

  const handleEditComment = () => {
    setEditContent(comment.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && !isUpdating) {
      updateComment({
        commentId: comment.id,
        content: editContent.trim(),
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const handleDeleteComment = () => {
    if (!isDeleting) {
      deleteComment(comment.id);
    }
  };

  return (
    <div className={`flex gap-x-3 ${level > 0 ? "ml-6 border-l-2 border-gray-700/50 pl-4" : ""}`}>
      <Avatar className="h-9 w-9 border border-gray-600/50">
        <AvatarImage
          src={comment.commenter?.listener?.avatarImage || comment.commenter?.artist?.avatarImage || undefined}
        />
        <AvatarFallback className="bg-gray-700 text-xs text-gray-300">
          {comment.commenter?.listener?.displayName.slice(0, 2) ||
            comment.commenter?.artist?.stageName.slice(0, 2) ||
            `User ${comment.commenterId.slice(-2)}`}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <span className="text-sm font-medium text-gray-200">
              {comment.commenter?.listener?.displayName ||
                comment.commenter?.artist?.stageName ||
                `User ${comment.commenterId.slice(-4)}`}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Actions dropdown */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-300">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 border-gray-600">
                {isOwner ? (
                  <>
                    <DropdownMenuItem
                      onClick={handleEditComment}
                      className="cursor-pointer text-xs text-gray-200 hover:bg-gray-700"
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="cursor-pointer text-xs text-red-400 hover:bg-gray-700 focus:text-red-400"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={() => setReportDialogOpen(true)}
                    className="cursor-pointer text-xs text-gray-200"
                  >
                    <Flag className="mr-2 h-3 w-3" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Comment Content - either display or edit mode */}
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit();
                } else if (e.key === "Escape") {
                  handleCancelEdit();
                }
              }}
              className="border-gray-600/50 bg-gray-700/50 text-sm text-gray-100"
              placeholder="Edit your comment..."
              disabled={isUpdating}
            />
            <div className="flex items-center gap-x-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || isUpdating}
                className="h-6 bg-purple-600 text-xs hover:bg-purple-700"
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="h-6 text-xs text-gray-400 hover:text-gray-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-gray-300">{comment.content}</p>
        )}

        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-1">
            <HeartIcon className="h-4 w-4 cursor-pointer text-gray-400 transition-colors hover:fill-red-400/20 hover:text-red-400" />
            <span className="text-xs text-gray-500">{formatNumber(0)}</span>
          </div>

          <Button
            variant={"ghost"}
            onClick={handleShowReplyInput}
            className="h-6 cursor-pointer px-2 text-xs text-gray-400 hover:text-gray-200"
          >
            Reply
          </Button>

          {/* Show replies button */}
          {(thread.replies.length > 0 || comment.replyCount > 0) && (
            <Button
              variant={"ghost"}
              onClick={() => setShowReplies(!showReplies)}
              className="flex h-6 cursor-pointer items-center gap-x-1 px-2 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            >
              {showReplies ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />}
              <span className="text-xs">
                {thread.totalReplies || comment.replyCount}{" "}
                {(thread.totalReplies || comment.replyCount) === 1 ? "reply" : "replies"}
              </span>
            </Button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-2 flex items-center gap-x-2">
            <Avatar className="h-7 w-7 border border-gray-600/50">
              <AvatarImage
                src={comment.commenter?.listener?.avatarImage || comment.commenter?.artist?.avatarImage || undefined}
              />
              <AvatarFallback className="bg-gray-700 text-xs text-gray-300">
                {comment.commenter?.fullName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="relative flex-1">
              <Input
                placeholder="Write a reply..."
                value={replyContent}
                autoFocus
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateReply();
                  }
                }}
                className="h-8 rounded-lg border-gray-600/50 bg-gray-700/50 px-3 py-2 pr-16 text-xs text-gray-100"
              />
              <Button
                onClick={handleCreateReply}
                disabled={!replyContent.trim() || isPending}
                size="sm"
                className="primary_gradient absolute top-1/2 right-0.5 h-6 -translate-y-1/2 px-2 hover:opacity-70"
              >
                <SendIcon className="mr-1 h-3 w-3 text-white" />
                <span className="text-xs text-white">{isPending ? "Posting..." : "Reply"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {showReplies && thread.replies && thread.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {thread.replies.map((reply, index) => (
              <RequestHubCommentReply
                key={`${reply.id}-${index}`}
                reply={reply}
                requestId={requestId}
                level={level + 1}
                rootCommentId={comment.id}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="border-gray-600 bg-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-100">Delete Comment</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to delete this comment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeleting}
                className="border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteComment}
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Report Dialog */}
        {comment.commenterId && (
          <ReportDialog
            contentType={ReportRelatedContentType.Comment}
            contentId={comment.id}
            reportedUserId={comment.commenterId}
            reportedUserName={
              comment.commenter?.listener?.displayName ||
              comment.commenter?.artist?.stageName ||
              `User ${comment.commenterId.slice(-4)}`
            }
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
          />
        )}
      </div>
    </div>
  );
};

export default RequestHubCommentUser;
