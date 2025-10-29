"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Clock, Send, ChevronDown, ChevronUp } from "lucide-react";
import { RequestHubItem } from "@/types/request-hub";
import { CommentSection } from "./comment-section";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: RequestHubItem;
  onViewDetails?: (id: string) => void;
  onApply?: (id: string) => void;
  className?: string;
}

export function RequestCard({ 
  request, 
  onViewDetails, 
  onApply,
  className 
}: RequestCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    {
      id: "1",
      author: {
        name: "Sarah Johnson",
        avatar: undefined
      },
      content: "This sounds like an interesting project! I have 8 years of experience with jazz saxophone and would love to discuss this opportunity.",
      timestamp: "2024-10-29T10:30:00Z",
      likes: 3,
      isLiked: false,
      replies: [
        {
          id: "1-1",
          author: {
            name: "Marcus Chen",
            avatar: undefined
          },
          content: "Thanks for your interest! Can you share some samples of your previous work?",
          timestamp: "2024-10-29T11:00:00Z",
          likes: 1,
          isLiked: false
        }
      ]
    },
    {
      id: "2",
      author: {
        name: "Mike Davis",
        avatar: undefined
      },
      content: "What's the timeline for this recording? I'm available next week.",
      timestamp: "2024-10-29T09:15:00Z",
      likes: 1,
      isLiked: true
    }
  ]);

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = (content: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: {
        name: "Current User", // This would come from auth context
        avatar: undefined
      },
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };
    setComments([...comments, newComment]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  const handleReplyComment = (commentId: string, content: string) => {
    const newReply = {
      id: `${commentId}-${Date.now()}`,
      author: {
        name: "Current User", // This would come from auth context
        avatar: undefined
      },
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    }));
  };

  const formatBudget = (budget: { min: number; max: number }) => {
    return `$${budget.min} - $${budget.max}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Card className={cn("w-full hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        {/* Header with Avatar and Save Button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.author.avatar} />
              <AvatarFallback className="bg-gray-200 text-gray-600">
                {request.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-white">{request.author.name}</h4>
              <p className="text-sm text-white">
                {formatTimeAgo(request.postedTime)}
              </p>
            </div>
          </div>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-8 w-8 p-0"
          >
            <Bookmark 
              className={cn("h-4 w-4", isSaved ? "fill-current text-blue-600" : "text-gray-400")} 
            />
          </Button> */}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 cursor-pointer hover:text-gray-300" 
            onClick={() => onViewDetails?.(request.id)}>
          {request.title}
        </h3>

        {/* Description */}
        <p className="text-white mb-4 line-clamp-3 text-sm leading-relaxed">
          {request.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {request.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Budget, Category, Deadline */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <p className="text-white mb-1">Budget</p>
            <p className="font-medium text-primary-gradient">
              {formatBudget(request.budget)}
            </p>
          </div>
          <div>
            <p className="text-white mb-1">Category</p>
            <p className="font-medium text-primary-gradient">{request.category}</p>
          </div>
          <div>
            <p className="text-white mb-1">
              <Clock className="h-3 w-3 inline mr-1" />
              Deadline
            </p>
            <p className="font-medium text-primary-gradient">{request.deadline}</p>
          </div>
        </div>

        {/* Footer with Applications Count and Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleComments}
            className="flex items-center text-sm text-gray-500 hover:text-primary p-0"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {request.applicationCount} applications
            {showComments ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails?.(request.id)}
              className="text-sm"
            >
              View Details
            </Button>
            <Button 
              size="sm"
              onClick={() => onApply?.(request.id)}
              className="primary_gradient hover:opacity-65 text-white text-sm"
            >
              <Send className="h-3 w-3 mr-1" />
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          <CommentSection
            requestId={request.id}
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onReplyComment={handleReplyComment}
          />
        </div>
      )}
    </Card>
  );
}