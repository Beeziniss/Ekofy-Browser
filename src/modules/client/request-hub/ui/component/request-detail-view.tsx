"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { userForRequestsOptions } from "@/gql/options/client-options";
import { 
  ArrowLeft, 
//   Bookmark, 
  DollarSign, 
  Clock, 
  Calendar, 
  MessageCircle,
  Send
} from "lucide-react";
import { RequestsQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";

type RequestItem = NonNullable<NonNullable<RequestsQuery['requests']>['items']>[0];

interface RequestDetailViewProps {
  request: RequestItem;
  onBack: () => void;
  onApply: () => void;
  onContactClient: () => void;
  className?: string;
}

export function RequestDetailView({ 
  request, 
  onBack, 
  onApply, 
  onContactClient,
  className 
}: RequestDetailViewProps) {
  
  // Fetch user data for the request creator
  const { data: requestUser } = useQuery(userForRequestsOptions(request.requestUserId));
  
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

  const formatTimeAgo = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const formatDeadline = (deadline: string | Date) => {
    const date = typeof deadline === 'string' ? new Date(deadline) : deadline;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("min-h-screen ", className)}>
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:opacity-75 transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Bookmark */}
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-white flex-1 mr-4">
                {request.title}
              </h1>
            </div>

            {/* Author and Post Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {requestUser?.fullName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">
                  {requestUser?.fullName || `User ${request.requestUserId.slice(-4)}`}
                </p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>Posted {formatTimeAgo(request.createdAt)}</span>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    View Comments
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                <p className="text-white leading-relaxed mb-4">
                  {request.summary}
                </p>
              </CardContent>
            </Card>

            {/* Detail Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Detailed Description</h2>
                <div className="text-white leading-relaxed prose prose-invert max-w-none"
                     dangerouslySetInnerHTML={{ __html: request.detailDescription }}
                />
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Request Status</h2>
                <Badge 
                  variant={getStatusVariant(request.status)}
                  className="text-sm px-3 py-1"
                >
                  {formatStatus(request.status)}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-20">
              {/* Budget */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center text-gray-500 mb-2">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm">Budget</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mb-4">
                    {formatBudget(request.budget, request.currency)}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-500">Deadline</span>
                      <span className="ml-auto font-medium">{formatDeadline(request.deadline)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-500">Posted</span>
                      <span className="ml-auto font-medium">{formatTimeAgo(request.createdAt)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={onApply}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={onContactClient}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Client
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}