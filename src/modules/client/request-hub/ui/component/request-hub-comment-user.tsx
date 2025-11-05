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
import {
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
  SendIcon,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import RequestHubCommentReply from "./request-hub-comment-reply";
import { CommentThread, CommentType } from "@/gql/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRequestHubCommentMutationOptions,
  updateRequestHubCommentMutationOptions,
  deleteRequestHubCommentMutationOptions,
} from "@/gql/options/client-mutation-options";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { useAuthDialog } from "../context/auth-dialog-context";

interface RequestHubCommentUserProps {
  thread: Omit<CommentThread, "hasMoreReplies" | "lastActivity">;
  requestId: string;
  level?: number;
}

const RequestHubCommentUser = ({
  thread,
  requestId,
  level = 0,
}: RequestHubCommentUserProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        commentType: CommentType.RequestHub,
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
    <div className={`flex gap-x-3 ${level > 0 ? "ml-6 pl-4 border-l-2 border-gray-700/50" : ""}`}>
      <Avatar className="w-9 h-9 border border-gray-600/50">
        <AvatarImage
          src={
            comment.commenter?.listener?.avatarImage ||
            comment.commenter?.artist?.avatarImage ||
            undefined
          }
        />
        <AvatarFallback className="bg-gray-700 text-gray-300 text-xs">
          {comment.commenter?.listener?.displayName.slice(0, 2) ||
            comment.commenter?.artist?.stageName.slice(0, 2) ||
            `User ${comment.commenterId.slice(-2)}`}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <span className="text-gray-200 text-sm font-medium">
              {comment.commenter?.listener?.displayName ||
                comment.commenter?.artist?.stageName ||
                `User ${comment.commenterId.slice(-4)}`}
            </span>
            <span className="text-gray-500 text-xs">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Actions dropdown for comment owner */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-300 h-6 w-6 p-0"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 bg-gray-800 border-gray-600">
                <DropdownMenuItem
                  onClick={handleEditComment}
                  className="cursor-pointer text-xs text-gray-200 hover:bg-gray-700"
                >
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="cursor-pointer text-xs text-red-400 focus:text-red-400 hover:bg-gray-700"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </DropdownMenuItem>
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
              className="bg-gray-700/50 border-gray-600/50 text-gray-100 text-sm"
              placeholder="Edit your comment..."
              disabled={isUpdating}
            />
            <div className="flex items-center gap-x-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || isUpdating}
                className="h-6 text-xs bg-purple-600 hover:bg-purple-700"
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
          <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
        )}

        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-1">
            <HeartIcon className="text-gray-400 hover:text-red-400 hover:fill-red-400/20 w-4 h-4 cursor-pointer transition-colors" />
            <span className="text-gray-500 text-xs">{formatNumber(0)}</span>
          </div>

          <Button
            variant={"ghost"}
            onClick={handleShowReplyInput}
            className="text-gray-400 hover:text-gray-200 cursor-pointer h-6 px-2 text-xs"
          >
            Reply
          </Button>

          {/* Show replies button */}
          {(thread.replies.length > 0 || comment.replyCount > 0) && (
            <Button
              variant={"ghost"}
              onClick={() => setShowReplies(!showReplies)}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 flex cursor-pointer items-center gap-x-1 h-6 px-2"
            >
              {showReplies ? (
                <ChevronUpIcon className="w-3 h-3" />
              ) : (
                <ChevronDownIcon className="w-3 h-3" />
              )}
              <span className="text-xs">
                {thread.totalReplies || comment.replyCount}{" "}
                {(thread.totalReplies || comment.replyCount) === 1
                  ? "reply"
                  : "replies"}
              </span>
            </Button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-2 flex items-center gap-x-2">
            <Avatar className="w-7 h-7 border border-gray-600/50">
              <AvatarImage
                src={
                  comment.commenter?.listener?.avatarImage ||
                  comment.commenter?.artist?.avatarImage ||
                  undefined
                }
              />
              <AvatarFallback className="bg-gray-700 text-gray-300 text-xs">
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
                className="bg-gray-700/50 border-gray-600/50 text-gray-100 h-8 rounded-lg px-3 py-2 pr-16 text-xs"
              />
              <Button
                onClick={handleCreateReply}
                disabled={!replyContent.trim() || isPending}
                size="sm"
                className="absolute right-0.5 top-1/2 -translate-y-1/2 primary_gradient hover:opacity-70 h-6 px-2 "
              >
                <SendIcon className="w-3 h-3 mr-1 text-white" />
                <span className="text-xs text-white">
                  {isPending ? "Posting..." : "Reply"}
                </span>
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
          <AlertDialogContent className="bg-gray-800 border-gray-600">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-100">Delete Comment</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting} className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteComment}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default RequestHubCommentUser;