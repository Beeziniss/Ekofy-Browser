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
import TrackCommentReply from "./track-comment-reply";
import { CommentThread, CommentType, ReportRelatedContentType } from "@/gql/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTrackCommentMutationOptions,
  updateTrackCommentMutationOptions,
  deleteTrackCommentMutationOptions,
} from "@/gql/options/client-mutation-options";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { useAuthAction } from "@/hooks/use-auth-action";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { ReportDialog } from "@/modules/shared/ui/components/report-dialog";

interface TrackCommentUserProps {
  thread: Omit<CommentThread, "hasMoreReplies" | "lastActivity">;
  trackId: string;
  level?: number;
}

const TrackCommentUser = ({ thread, trackId, level = 0 }: TrackCommentUserProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth } = useAuthAction();
  const comment = thread.rootComment;

  // Check if current user is the owner of this comment
  const isOwner = user?.userId === comment.commenterId;

  const { mutate: createReply, isPending } = useMutation({
    ...createTrackCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-comments", trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["track-comment-replies", comment.id],
      });
      setReplyContent("");
      setShowReplyInput(false);
    },
  });

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    ...updateTrackCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-comments", trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["track-comment-replies", comment.id],
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
    ...deleteTrackCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-comments", trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["track-comment-replies", comment.id],
      });
      setShowDeleteDialog(false);
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete comment");
      console.error("Delete comment error:", error);
    },
  });

  const handleCreateReply = () => {
    if (replyContent.trim() && !isPending) {
      createReply({
        targetId: trackId,
        commentType: CommentType.Track,
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
    <div className={`flex gap-x-3 ${level > 0 ? "ml-8" : ""}`}>
      <Avatar className="size-12">
        <AvatarImage
          src={comment.commenter?.listener?.avatarImage || comment.commenter?.artist?.avatarImage || undefined}
        />
        <AvatarFallback>{comment.commenter?.fullName.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <span className="text-main-white text-base font-semibold">
              {comment.commenter?.artist?.stageName || comment.commenter?.listener?.displayName}
            </span>
            <span className="text-main-grey text-sm">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Actions dropdown */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-main-grey hover:text-main-white h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {isOwner ? (
                  <>
                    <DropdownMenuItem onClick={handleEditComment} className="cursor-pointer text-sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="cursor-pointer text-sm text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={() => setReportDialogOpen(true)}
                    className="cursor-pointer text-sm"
                  >
                    <Flag className="mr-2 h-4 w-4" />
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
              className="bg-main-card-bg border-white/30 text-sm"
              placeholder="Edit your comment..."
              disabled={isUpdating}
            />
            <div className="flex items-center gap-x-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || isUpdating}
                className="h-7 text-xs"
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <span className="text-sm">{comment.content}</span>
        )}

        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <HeartIcon className="text-main-white hover:text-main-grey hover:fill-main-grey size-5 hover:cursor-pointer" />
            <span>{formatNumber(0)}</span>
          </div>

          <Button
            variant={"ghost"}
            onClick={() => executeWithAuth(() => setShowReplyInput(!showReplyInput), "comment")}
            className="text-main-white hover:text-main-grey cursor-pointer"
          >
            Reply
          </Button>

          {/* Show replies button */}
          {(thread.replies.length > 0 || comment.replyCount > 0) && (
            <Button
              variant={"ghost"}
              onClick={() => setShowReplies(!showReplies)}
              className="text-main-purple hover:text-main-purple hover:bg-main-purple/20 flex cursor-pointer items-center gap-x-2"
            >
              {showReplies ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
              <span className="text-sm">
                {thread.totalReplies || comment.replyCount}{" "}
                {(thread.totalReplies || comment.replyCount) === 1 ? "reply" : "replies"}
              </span>
            </Button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-3 flex items-center gap-x-3">
            <Avatar className="size-10">
              <AvatarImage
                src={comment.commenter?.listener?.avatarImage || comment.commenter?.artist?.avatarImage || undefined}
              />
              <AvatarFallback>{comment.commenter?.fullName.slice(0, 2)}</AvatarFallback>
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
                className="bg-main-card-bg h-8 rounded-full border-white/30 px-3 py-2 pr-20"
              />
              <Button
                onClick={handleCreateReply}
                disabled={!replyContent.trim() || isPending}
                size="sm"
                className="bg-main-white absolute top-0 right-0 h-8 rounded-tl-none rounded-tr-full rounded-br-full rounded-bl-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SendIcon className="size-4" />
                <span className="text-xs">{isPending ? "Posting..." : "Reply"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {showReplies && thread.replies && thread.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {thread.replies.map((reply, index) => (
              <TrackCommentReply
                key={`${reply.id}-${index}`}
                reply={reply}
                trackId={trackId}
                level={level + 1}
                rootCommentId={comment.id}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Comment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this comment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteComment}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600"
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

        <WarningAuthDialog
          open={showWarningDialog}
          onOpenChange={setShowWarningDialog}
          action={warningAction}
          trackName={trackName}
        />
      </div>
    </div>
  );
};

export default TrackCommentUser;
