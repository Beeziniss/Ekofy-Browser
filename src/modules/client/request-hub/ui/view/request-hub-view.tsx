"use client";

import { useState } from "react";
import { RequestHubLayout } from "../layout";
import { CreateRequestSection, ViewRequestSection } from "../section";
import { RequestDetailView } from "../component";
import { RequestHubItem, RequestHubMode, CreateRequestData } from "@/types/request-hub";

// Mock data theo định dạng mới
const mockRequests: RequestHubItem[] = [
  {
    id: "1",
    title: "Looking for a Smooth Jazz Saxophonist",
    description: "Need a professional saxophone player for a smooth jazz track. Must have experience in recording and ability to improvise. Looking for warm, soulful tones.",
    budget: { min: 200, max: 500 },
    deadline: "3 days",
    category: "Live Instruments",
    tags: ["Jazz", "Saxophone", "Recording"],
    applicationCount: 12,
    postedTime: "2024-10-25T10:00:00Z",
    author: {
      id: "user1",
      name: "Marcus Chen",
      avatar: "/api/placeholder/40/40",
      memberSince: "2022",
      location: "Los Angeles, CA",
      jobsPosted: 15
    },
    requirements: [
      "Experienced mixing engineer with a portfolio in indie/alternative rock",
      "Understanding of both analog and digital production techniques", 
      "Ability to enhance the emotional impact of each track",
      "Quick turnaround without compromising quality",
      "Open to creative suggestions while respecting the artistic vision"
    ],
    deliverables: [
      "Mixed tracks (stereo stems)",
      "Mastered tracks ready for distribution",
      "Up to 2 rounds of revisions per track",
      "Final masters in multiple formats (WAV, MP3, etc.)"
    ],
    timeline: [
      "Week 1-2: Mixing all tracks",
      "Week 3: Mastering and final revisions"
    ],
    skills: ["Mixing", "Mastering", "Audio Engineering", "Indie Rock", "Electronic"]
  },
  {
    id: "2", 
    title: "Mix & Master Hip-Hop EP",
    description: "Have a 5-track hip-hop EP that needs professional mixing and mastering. Looking for someone experienced with modern hip-hop production and can deliver radio-ready quality.",
    budget: { min: 500, max: 1200 },
    deadline: "2 weeks", 
    category: "Mixing & Mastering",
    tags: ["Hip-Hop", "Mixing", "Mastering"],
    applicationCount: 8,
    postedTime: "2024-10-24T14:30:00Z",
    author: {
      id: "user2",
      name: "DJ Rhythm",
      avatar: "/api/placeholder/40/40",
      memberSince: "2021",
      location: "Atlanta, GA", 
      jobsPosted: 8
    },
    requirements: [
      "Minimum 5 years of mixing experience",
      "Portfolio with similar genre work",
      "Professional DAW and plugins",
      "Fast and clear communication"
    ],
    deliverables: [
      "Mixed tracks (stereo stems)",
      "Mastered tracks ready for distribution",
      "Up to 2 rounds of revisions per track"
    ],
    timeline: [
      "Week 1-2: Mixing all tracks",
      "Week 3: Mastering and final revisions"
    ],
    skills: ["Hip-Hop", "Mixing", "Mastering", "Pro Tools", "Logic Pro"]
  },
  {
    id: "3",
    title: "Vocalist Needed for EDM Track", 
    description: "Searching for a versatile vocalist to feature on an upcoming EDM single. Should be comfortable with upbeat, energetic performances and have studio recording equipment.",
    budget: { min: 300, max: 800 },
    deadline: "1 week",
    category: "Vocals",
    tags: ["EDM", "Vocals", "Pop"],
    applicationCount: 24,
    postedTime: "2024-10-23T09:15:00Z",
    author: {
      id: "user3",
      name: "Sarah Williams",
      avatar: "/api/placeholder/40/40",
      memberSince: "2023",
      location: "Miami, FL",
      jobsPosted: 5
    },
    requirements: [
      "Strong vocal range and control",
      "Experience with electronic music",
      "Home studio setup",
      "Quick turnaround capability"
    ],
    deliverables: [
      "Lead vocal recording",
      "Harmony layers if needed",
      "Raw and processed stems"
    ],
    timeline: [
      "Day 1-3: Recording and initial delivery",
      "Day 4-7: Revisions and final delivery"
    ],
    skills: ["Vocals", "EDM", "Pop", "Studio Recording", "Harmonies"]
  }
];

export function RequestHubView() {
  const [mode, setMode] = useState<RequestHubMode>('view');
  const [requests, setRequests] = useState<RequestHubItem[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<RequestHubItem | null>(null);
  const [isLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Filter requests based on search
  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    request.description.toLowerCase().includes(searchValue.toLowerCase()) ||
    request.category.toLowerCase().includes(searchValue.toLowerCase()) ||
    request.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const handlePostRequest = () => {
    setMode('create');
  };

  const handleBrowseArtists = () => {
    // Navigate to artists page
    console.log('Browse artists');
  };

  const handleViewDetails = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setMode('detail');
    }
  };

  const handleApply = (id: string) => {
    console.log('Apply to request:', id);
    // Handle application logic
  };

  const handleSave = (id: string) => {
    console.log('Save request:', id);
    // Handle save/bookmark logic
  };

  const handleBackToList = () => {
    setMode('view');
    setSelectedRequest(null);
  };

  const handleContactClient = () => {
    console.log('Contact client');
    // Handle contact logic
  };

  const handleCreateSubmit = (data: CreateRequestData) => {
    const newRequest: RequestHubItem = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      budget: data.budget,
      deadline: data.deadline,
      category: data.category,
      tags: data.tags,
      applicationCount: 0,
      postedTime: new Date().toISOString(),
      author: {
        id: "current-user",
        name: "Current User", 
        avatar: "/api/placeholder/40/40",
        memberSince: "2024",
        location: "Your Location",
        jobsPosted: 1
      },
      requirements: data.requirements,
      deliverables: data.deliverables,
      timeline: data.timeline,
      skills: data.skills
    };
    
    setRequests(prev => [newRequest, ...prev]);
    setMode('view');
  };

  const handleCancel = () => {
    setMode('view');
  };

  const renderContent = () => {
    switch (mode) {
      case 'create':
        return (
          <CreateRequestSection 
            onSubmit={handleCreateSubmit}
            onCancel={handleCancel}
          />
        );
      case 'detail':
        return selectedRequest ? (
          <RequestDetailView
            request={selectedRequest}
            onBack={handleBackToList}
            onApply={() => handleApply(selectedRequest.id)}
            onContactClient={handleContactClient}
          />
        ) : null;
      case 'view':
      default:
        return (
          <RequestHubLayout
            onPostRequest={handlePostRequest}
            onBrowseArtists={handleBrowseArtists}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          >
            <ViewRequestSection
              requests={filteredRequests}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
              onApply={handleApply}
              onSave={handleSave}
            />
          </RequestHubLayout>
        );
    }
  };

  return <>{renderContent()}</>;
}