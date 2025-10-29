"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Heart, Reply, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  requestId: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
  onReplyComment: (commentId: string, content: string) => void;
  className?: string;
}

export function CommentSection({
  comments,
  onAddComment,
  onLikeComment,
  onReplyComment,
  className
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      const diffHours = Math.ceil(diffMinutes / 60);
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.ceil(diffMinutes / 1440);
      return `${diffDays}d ago`;
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReplyComment(commentId, replyContent.trim());
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={cn("space-y-3", isReply && "ml-8 border-l-2 pl-4")}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback className="bg-gray-700 text-gray-200 text-xs">
            {comment.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm text-white">
              {comment.author.name}
            </span>
            <span className="text-xs text-gray-400">
              {formatTimeAgo(comment.timestamp)}
            </span>
          </div>
          
          <p className="text-sm text-gray-300 leading-relaxed">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLikeComment(comment.id)}
              className="h-6 px-2 text-xs text-gray-400 hover:text-red-500"
            >
              <Heart 
                className={cn(
                  "h-3 w-3 mr-1", 
                  comment.isLiked ? "fill-current text-red-500" : ""
                )} 
              />
              {comment.likes}
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="h-6 px-2 text-xs text-gray-400 hover:text-blue-500"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1 text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Reply Input */}
      {replyingTo === comment.id && (
        <div className="ml-11 space-y-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="min-h-[60px] text-sm resize-none bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleSubmitReply(comment.id)}
              disabled={!replyContent.trim()}
              className="primary_gradient text-white text-xs"
            >
              <Send className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent("");
              }}
              className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("p-4 space-y-4 bg-gray-900/50", className)}>
      <h4 className="font-medium text-white">
        Comments ({comments.length})
      </h4>
      
      {/* Add New Comment */}
      <div className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px] resize-none bg-gray-800 border-gray-700 text-white placeholder-gray-400"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="primary_gradient text-white"
          >
            <Send className="h-4 w-4 mr-1" />
            Comment
          </Button>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}