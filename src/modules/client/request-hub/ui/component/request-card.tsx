"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Bookmark, Clock, Send } from "lucide-react";
import { RequestHubItem } from "@/types/request-hub";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: RequestHubItem;
  onViewDetails?: (id: string) => void;
  onApply?: (id: string) => void;
  onSave?: (id: string) => void;
  className?: string;
}

export function RequestCard({ 
  request, 
  onViewDetails, 
  onApply, 
  onSave,
  className 
}: RequestCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(request.id);
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
          <div className="flex items-center text-sm text-gray-500">
            <MessageCircle className="h-4 w-4 mr-1" />
            {request.applicationCount} applications
          </div>
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
    </Card>
  );
}