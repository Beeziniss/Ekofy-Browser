import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CommentResponse, CommentType, ArtistQuery, ListenerQuery } from "@/gql/graphql";
import {
  createTrackCommentMutationOptions,
  updateTrackCommentMutationOptions,
  deleteTrackCommentMutationOptions,
} from "@/gql/options/client-mutation-options";
import { formatDistanceToNow } from "date-fns";
import { formatNumber } from "@/utils/format-number";
import { trackCommentRepliesOptions } from "@/gql/options/client-options";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, ChevronUpIcon, HeartIcon, SendIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { useAuthAction } from "@/hooks/use-auth-action";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";

// Component for handling replies that might have nested replies
interface ReplyCommentProps {
  reply: CommentResponse;
  trackId: string;
  level: number;
  rootCommentId?: string;
  listenerData?: ListenerQuery;
  artistData?: ArtistQuery;
}

const TrackCommentReply = ({ reply, trackId, level, rootCommentId, listenerData, artistData }: ReplyCommentProps) => {
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth } = useAuthAction();

  // Check if current user is the owner of this reply
  const isOwner = user?.userId === reply.commenterId;

  // Check if this reply has nested replies
  const hasNestedReplies = reply.replyCount !== undefined && reply.replyCount > 0;

  // Fetch nested replies if this reply has replyCount > 0
  const { data: nestedReplies } = useQuery({
    ...trackCommentRepliesOptions(reply.id),
    enabled: showNestedReplies && hasNestedReplies,
  });

  const { mutate: createReply, isPending } = useMutation({
    ...createTrackCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-comments", trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["track-comment-replies", reply.id],
      });
      setReplyContent("");
      setShowReplyInput(false);
    },
  });

  const { mutate: updateReply, isPending: isUpdating } = useMutation({
    ...updateTrackCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-comments", trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["track-comment-replies", reply.id],
      });
      setIsEditing(false);
      setEditContent("");
      toast.success("Reply updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update reply");
      console.error("Update reply error:", error);
    },
  });

  const { mutate: deleteReply, isPending: isDeleting } = useMutation({
    ...deleteTrackCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-comments", trackId],
      });
      queryClient.invalidateQueries({
        queryKey: ["track-comment-replies", reply.id],
      });
      setShowDeleteDialog(false);
      toast.success("Reply deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete reply");
      console.error("Delete reply error:", error);
    },
  });

  const handleCreateReply = () => {
    if (replyContent.trim() && !isPending) {
      createReply({
        targetId: trackId,
        commentType: CommentType.Track,
        content: replyContent.trim(),
        parentCommentId: rootCommentId,
      });
    }
  };

  const handleEditReply = () => {
    setEditContent(reply.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && !isUpdating) {
      updateReply({
        commentId: reply.id,
        content: editContent.trim(),
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const handleDeleteReply = () => {
    if (!isDeleting) {
      deleteReply(reply.id);
    }
  };

  return (
    <div className={`flex gap-x-3 ${level > 0 ? "ml-8" : ""}`}>
      <Avatar className="size-10">
        <AvatarImage
          src={reply.commenter?.listener?.avatarImage || reply.commenter?.artist?.avatarImage || undefined}
        />
        <AvatarFallback>{reply.commenter?.listener?.displayName.slice(0, 2) || reply.commenter?.artist?.stageName.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <span className="text-main-white text-sm font-semibold">
              {reply.commenter?.artist?.stageName || reply.commenter?.listener?.displayName}
            </span>
            <span className="text-main-grey text-xs">
              {formatDistanceToNow(new Date(reply.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Actions dropdown for reply owner */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-main-grey hover:text-main-white h-5 w-5 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEditReply} className="cursor-pointer text-xs">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="cursor-pointer text-xs text-red-500 focus:text-red-500"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Reply Content - either display or edit mode */}
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
              autoFocus
              className="bg-main-card-bg h-6 border-white/30 text-xs"
              placeholder="Edit your reply..."
              disabled={isUpdating}
            />
            <div className="flex items-center gap-x-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || isUpdating}
                className="h-5 px-2 text-xs"
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="h-5 px-2 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <span className="text-sm">{reply.content}</span>
        )}

        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <HeartIcon className="text-main-white hover:text-main-grey hover:fill-main-grey size-4 hover:cursor-pointer" />
            <span className="text-xs">{formatNumber(0)}</span>
          </div>

          <Button
            variant={"ghost"}
            onClick={() => executeWithAuth(() => setShowReplyInput(!showReplyInput), "comment")}
            className="text-main-white hover:text-main-grey h-6 cursor-pointer px-2 text-xs"
          >
            Reply
          </Button>

          {/* Show nested replies button */}
          {hasNestedReplies && (
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => setShowNestedReplies(!showNestedReplies)}
              className="text-main-purple hover:text-main-purple hover:bg-main-purple/20 flex h-6 cursor-pointer items-center gap-x-1 px-2"
            >
              {showNestedReplies ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />}
              <span className="text-xs">
                {reply.replyCount} {reply.replyCount === 1 ? "reply" : "replies"}
              </span>
            </Button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="flex items-center gap-x-2">
            <Avatar className="size-8">
              <AvatarImage
                src={
                  listenerData?.listeners?.items?.[0]?.avatarImage ||
                  artistData?.artists?.items?.[0]?.avatarImage ||
                  undefined
                }
              />
              <AvatarFallback>
                {listenerData?.listeners?.items?.[0]?.displayName?.slice(0, 1) ||
                  artistData?.artists?.items?.[0]?.stageName?.slice(0, 1) ||
                  "U"}
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
                className="bg-main-card-bg h-8 rounded-full border-white/30 px-2 py-1 pr-16 text-xs"
              />
              <Button
                onClick={handleCreateReply}
                disabled={!replyContent.trim() || isPending}
                size="sm"
                className="bg-main-white absolute top-0 right-0 h-8 rounded-tl-none rounded-tr-full rounded-br-full rounded-bl-none px-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SendIcon className="size-4" />
                <span className="text-xs">{isPending ? "Posting..." : "Reply"}</span>
              </Button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {showNestedReplies &&
          nestedReplies?.commentReplies?.replies &&
          nestedReplies.commentReplies.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {nestedReplies.commentReplies.replies.map((nestedReply, index) => (
                <TrackCommentReply
                  key={`${nestedReply.id}-${index}`}
                  reply={nestedReply}
                  trackId={trackId}
                  level={level + 1}
                  listenerData={listenerData}
                  artistData={artistData}
                />
              ))}
            </div>
          )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Reply</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this reply? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteReply}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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

export default TrackCommentReply;
