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
import { CommentResponse, CommentType } from "@/gql/graphql";
import {
  createRequestHubCommentMutationOptions,
  updateRequestHubCommentMutationOptions,
  deleteRequestHubCommentMutationOptions,
} from "@/gql/options/client-mutation-options";
import { formatDistanceToNow } from "date-fns";
import { formatNumber } from "@/utils/format-number";
import { requestHubCommentRepliesOptions } from "@/gql/options/client-options";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, ChevronUpIcon, HeartIcon, SendIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { useAuthDialog } from "../context/auth-dialog-context";

// Component for handling replies that might have nested replies
interface RequestHubReplyCommentProps {
  reply: CommentResponse;
  requestId: string;
  level: number;
  rootCommentId?: string;
}

const RequestHubCommentReply = ({ reply, requestId, level, rootCommentId }: RequestHubReplyCommentProps) => {
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const { showAuthDialog } = useAuthDialog();

  // Check if current user is the owner of this reply
  const isOwner = user?.userId === reply.commenterId;

  // Check if this reply has nested replies
  const hasNestedReplies = reply.replyCount !== undefined && reply.replyCount > 0;

  // Fetch nested replies if this reply has replyCount > 0
  const { data: nestedReplies } = useQuery({
    ...requestHubCommentRepliesOptions(reply.id),
    enabled: showNestedReplies && hasNestedReplies,
  });

  const { mutate: createReply, isPending } = useMutation({
    ...createRequestHubCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comments", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comment-replies", reply.id],
      });
      setReplyContent("");
      setShowReplyInput(false);
    },
  });

  const handleShowReplyInput = () => {
    if (!isAuthenticated) {
      showAuthDialog("reply");
      return;
    }
    setShowReplyInput(!showReplyInput);
  };

  const { mutate: updateReply, isPending: isUpdating } = useMutation({
    ...updateRequestHubCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comments", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comment-replies", reply.id],
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
    ...deleteRequestHubCommentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comments", requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ["request-hub-comment-replies", reply.id],
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
        targetId: requestId,
        commentType: CommentType.Request,
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

  // Get user name from commenterId (hardcoded for now)
  // const getUserName = (commenterId: string) => {
  //   return `User ${commenterId.substring(0, 8)}`;
  // };

  return (
    <div className="ml-6 flex gap-x-3 border-l-2 border-gray-700/50 pl-4">
      <Avatar className="h-8 w-8 border border-gray-600/50">
        <AvatarImage
          src={reply.commenter?.listener?.avatarImage || reply.commenter?.artist?.avatarImage || undefined}
        />
        <AvatarFallback className="bg-gray-700 text-xs text-gray-300">
          {reply.commenter?.listener?.displayName.slice(0, 2) ||
            reply.commenter?.artist?.stageName.slice(0, 2) ||
            `User ${reply.commenterId.slice(-2)}`}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <span className="text-sm font-medium text-gray-200">
              {reply.commenter?.listener?.displayName ||
                reply.commenter?.artist?.stageName ||
                `User ${reply.commenterId.slice(-4)}`}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(reply.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Actions dropdown for reply owner */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-300">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 border-gray-600 bg-gray-800">
                <DropdownMenuItem
                  onClick={handleEditReply}
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
              className="border-gray-600/50 bg-gray-700/50 text-sm text-gray-100"
              placeholder="Edit your reply..."
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
          <p className="text-sm leading-relaxed text-gray-300">{reply.content}</p>
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

          {/* Show nested replies button */}
          {hasNestedReplies && (
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => setShowNestedReplies(!showNestedReplies)}
              className="flex h-6 cursor-pointer items-center gap-x-1 px-2 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            >
              {showNestedReplies ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />}
              <span className="text-xs">
                {reply.replyCount} {reply.replyCount === 1 ? "reply" : "replies"}
              </span>
            </Button>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-2 flex items-center gap-x-2">
            <Avatar className="h-7 w-7 border border-gray-600/50">
              <AvatarImage
                src={reply.commenter?.listener?.avatarImage || reply.commenter?.artist?.avatarImage || undefined}
              />
              <AvatarFallback className="bg-gray-700 text-xs text-gray-300">
                {reply.commenter?.fullName.slice(0, 2)}
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
                className="h-9 rounded-lg border-gray-600/50 bg-gray-700/50 px-3 py-2 pr-16 text-xs text-gray-100"
              />
              <Button
                onClick={handleCreateReply}
                disabled={!replyContent.trim() || isPending}
                size="sm"
                className="primary_gradient absolute top-1/2 right-0.5 -translate-y-1/2 hover:opacity-50"
              >
                <SendIcon className="mr-1 h-3 w-3 text-white" />
                <span className="text-xs text-white">{isPending ? "Posting..." : "Reply"}</span>
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
                <RequestHubCommentReply
                  key={`${nestedReply.id}-${index}`}
                  reply={nestedReply}
                  requestId={requestId}
                  level={level + 1}
                />
              ))}
            </div>
          )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="border-gray-600 bg-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-100">Delete Reply</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to delete this reply? This action cannot be undone.
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
                onClick={handleDeleteReply}
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700"
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

export default RequestHubCommentReply;
