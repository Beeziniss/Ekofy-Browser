"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Clock, Send, ChevronDown, ChevronUp, SquarePen } from "lucide-react";
import { RequestsQuery } from "@/gql/graphql";
import { userForRequestsOptions, requestHubCommentsOptions } from "@/gql/options/client-options";
import { RequestHubCommentSection } from "./";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { useAuthDialog } from "../context/auth-dialog-context";

type RequestItem = NonNullable<NonNullable<RequestsQuery['requests']>['items']>[0];

interface RequestCardProps {
  request: RequestItem;
  onViewDetails?: (id: string) => void;
  onApply?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
  onSave?: (id: string) => void;
  isOwner?: boolean;
}

export function RequestCard({ 
  request, 
  onViewDetails, 
  onApply,
  onEdit,
  className,
  isOwner = false
}: RequestCardProps) {
  const [showComments, setShowComments] = useState(false);
  
  // Get auth state and dialog
  const { isAuthenticated } = useAuthStore();
  const { showAuthDialog } = useAuthDialog();
  
  // Fetch user data for the request creator
  const { data: requestUser } = useQuery(userForRequestsOptions(request.requestUserId));
  
  // Fetch comment count for this request
  const { data: commentsData } = useQuery(requestHubCommentsOptions(request.id));
  
  // Calculate total comment count (including replies)
  const getTotalCommentCount = () => {
    if (!commentsData?.threadedComments) return 0;
    
    const threads = commentsData.threadedComments.threads || [];
    return threads.reduce((total, thread) => {
      // Count root comment + all replies
      return total + 1 + (thread.totalReplies || 0);
    }, 0);
  };

  const totalComments = getTotalCommentCount();
  
  // Format status from GraphQL enum to display text
  const formatStatus = (status: string) => {
    switch (status) {
      case 'Open':
        return 'Open';
      case 'Closed':
        return 'Closed';
      case 'Blocked':
        return 'Blocked';
      case 'Deleted':
        return 'Deleted';
      default:
        return status;
    }
  };

  // Get status color variant
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Open':
        return 'default';
      case 'Closed':
        return 'secondary';
      case 'Blocked':
        return 'destructive';
      case 'Deleted':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  
  const handleToggleComments = () => {
    // Anyone can view comments, no auth required
    setShowComments(!showComments);
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      showAuthDialog("apply", request.title);
      return;
    }
    onApply?.(request.id);
  };

  const handleEdit = () => {
    if (!isAuthenticated) {
      showAuthDialog("edit", request.title);
      return;
    }
    onEdit?.(request.id);
  };  const formatTimeAgo = (dateString: string) => {
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

  const formatBudget = (budget: { min: number; max: number }, currency: string) => {
    const formatCurrency = (amount: number) => {
      switch (currency.toUpperCase()) {
        case 'VND':
          return `${amount.toLocaleString()} VND`;
        case 'USD':
          return `$${amount.toLocaleString()}`;
        case 'EUR':
          return `€${amount.toLocaleString()}`;
        default:
          return `${amount.toLocaleString()} ${currency.toUpperCase()}`;
      }
    };

    if (budget.min === budget.max) {
      return formatCurrency(budget.min);
    }
    return `${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}`;
  };

  const formatDeadline = (deadline: string | Date) => {
    const date = typeof deadline === 'string' ? new Date(deadline) : deadline;
    return date.toLocaleDateString();
  };

  return (
    <Card className={cn("w-full hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        {/* Header with Avatar and Save Button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gray-200 text-gray-600">
                {requestUser?.fullName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-white">
                {requestUser?.fullName || `User ${request.requestUserId.slice(-4)}`}
              </h4>
              <p className="text-sm text-white">
                {formatTimeAgo(request.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 cursor-pointer hover:text-gray-300" 
            onClick={() => onViewDetails?.(request.id)}>
          {request.title}
        </h3>

        {/* Summary */}
        <p className="text-white mb-4 line-clamp-3 text-sm leading-relaxed">
          {request.summary}
        </p>

        {/* Status Badge */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant={getStatusVariant(request.status)}
            className="text-xs"
          >
            {formatStatus(request.status)}
          </Badge>
        </div>

        {/* Budget and Deadline */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center">
            <p className="text-white mr-1">Budget:</p>
            <p className="font-medium text-main-purple">
              {formatBudget(request.budget, request.currency)}
            </p>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-white mr-2" />
            <p className="text-white mr-1">Deadline:</p>
            <p className="font-medium text-main-purple">
              {formatDeadline(request.deadline)}
            </p>
          </div>
        </div>
        {/* Footer with Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleComments}
            className="flex items-center text-sm text-gray-500 hover:text-primary p-0"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            View Comments {totalComments > 0 && `(${totalComments})`}

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
            {isOwner && onEdit ? (
              <Button 
                size="sm"
                onClick={handleEdit}
                className="primary_gradient hover:opacity-65 text-white text-sm"
              >
                <SquarePen className="h-3 w-3 mr-1" />
                Edit
              </Button>
            ) : (
              <Button 
                size="sm"
                onClick={handleApply}
                className="primary_gradient hover:opacity-65 text-white text-sm"
              >
                <Send className="h-3 w-3 mr-1" />
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100">
          <RequestHubCommentSection
            requestId={request.id}
          />
        </div>
      )}
    </Card>
  );
}