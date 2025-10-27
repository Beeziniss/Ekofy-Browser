"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
//   Bookmark, 
  DollarSign, 
  Clock, 
  Calendar, 
  Tag, 
  MessageCircle,
  Send
} from "lucide-react";
import { RequestHubItem } from "@/types/request-hub";
import { cn } from "@/lib/utils";

interface RequestDetailViewProps {
  request: RequestHubItem;
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
  const formatBudget = (budget: { min: number; max: number }) => {
    return `$${budget.min.toLocaleString()}-$${budget.max.toLocaleString()}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
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
                <AvatarImage src={request.author.avatar} />
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {request.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{request.author.name}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>Posted {formatTimeAgo(request.postedTime)}</span>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {request.applicationCount} applications
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                
                {/* Project Details */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">## Project Details</h3>
                  <p className="text-white leading-relaxed mb-4">
                    {request.description}
                  </p>
                </div>

                {/* What I'm Looking For */}
                {request.requirements && request.requirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">### What I&apos;m Looking For:</h3>
                    <ul className="space-y-2">
                      {request.requirements.map((req, index) => (
                        <li key={index} className="flex items-start text-white">
                          <span className="mr-2 text-gray-400">-</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deliverables */}
                {request.deliverables && request.deliverables.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">### Deliverables:</h3>
                    <ul className="space-y-2">
                      {request.deliverables.map((deliverable, index) => (
                        <li key={index} className="flex items-start text-white">
                          <span className="mr-2 text-gray-400">-</span>
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Timeline */}
                {request.timeline && request.timeline.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">### Timeline:</h3>
                    <ul className="space-y-2">
                      {request.timeline.map((time, index) => (
                        <li key={index} className="flex items-start text-white ">
                          <span className="mr-2 text-gray-400">-</span>
                          <span>{time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-white italic">
                  Looking forward to working with a talented professional who can take this project to the next level!
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-white">Minimum 5 years of mixing experience</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-white">Portfolio with similar genre work</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-white">Professional DAW and plugins</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-white">Fast and clear communication</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Skills & Tags */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Skills & Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {request.skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About the Client */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">About the Client</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="font-medium text-white">{request.author.location || "Los Angeles, CA"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Member Since</p>
                    <p className="font-medium text-white">{request.author.memberSince || "2022"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Jobs Posted</p>
                    <p className="font-medium text-white">{request.author.jobsPosted || "15"}</p>
                  </div>
                </div>
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
                    {formatBudget(request.budget)}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-500">Deadline</span>
                      <span className="ml-auto font-medium">{request.deadline}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Tag className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-500">Category</span>
                      <span className="ml-auto font-medium">{request.category}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-500">Posted</span>
                      <span className="ml-auto font-medium">{formatTimeAgo(request.postedTime)}</span>
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