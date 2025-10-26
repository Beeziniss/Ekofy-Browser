"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Contact, AlertTriangle } from "lucide-react";
import { RequestHubItem } from "@/types/request-hub";
import Image from "next/image";

// Custom Send Icon component (giống hình 1)
const SendIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M2 21L23 12L2 3V10L17 12L2 14V21Z" 
      fill="currentColor"
    />
  </svg>
);

interface RequestCardProps {
  request: RequestHubItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onContact: (id: string) => void;
  onReport: (id: string) => void;
}

export function RequestCard({ request, onContact, onReport }: RequestCardProps) {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Handle comment submission
      console.log('Add comment:', newComment);
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full mb-6">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={request.author.avatar} />
              <AvatarFallback className="bg-purple-500 text-white">
                {request.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{request.author.name}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(request.createdAt)}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onContact(request.id)}>
                <Contact className="h-4 w-4 mr-2" />
                Contact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReport(request.id)}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">{request.title}</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            {request.description.split('•').filter(item => item.trim()).map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item.trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attachments */}
        {request.attachments && request.attachments.length > 0 && (
          <div className="mb-4 flex space-x-4">
            {request.attachments.map((attachment, index) => (
              <div key={index} className="relative">
                <Image 
                  src={attachment} 
                  alt={`Attachment ${index + 1}`}
                  width={256}
                  height={160}
                  className="w-64 h-40 object-cover rounded-lg border"
                />
              </div>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <div className="space-y-3">
          {request.comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback className="bg-purple-500 text-white text-xs">
                  {comment.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-[#3C3C3C] rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-white">{comment.author.name}</span>
                  {comment.duration && (
                    <span className="text-xs text-gray-400">{comment.duration}</span>
                  )}
                </div>
                <p className="text-sm text-white">{comment.content}</p>
              </div>
            </div>
          ))}

          {/* Add Comment */}
          <div className="flex items-center space-x-3 mt-4">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-purple-500 text-white text-xs">
                U
              </AvatarFallback>
            </Avatar>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type to comment"
              className="flex-1 rounded-full border-gray-300 h-10"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <Button 
              size="sm" 
              onClick={handleAddComment}
              className="h-8 w-8 p-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex-shrink-0"
            >
              <SendIcon className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}