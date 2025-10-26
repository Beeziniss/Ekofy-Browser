"use client";

import { useState } from "react";
import { RequestHubLayout } from "../layout";
import { CreateRequestSection, EditRequestSection, ViewRequestSection } from "../section";
import { RequestHubItem, RequestHubMode, CreateRequestData, UpdateRequestData } from "@/types/request-hub";

// Mock data for development
const mockRequests: RequestHubItem[] = [
  {
    id: "1",
    title: "Lorem ipsum dolor sit amet",
    description: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. • Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. • Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. • Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    duration: "3 days",
    attachments: [
      "/image-login.png",
      "/image-login.png"
    ],
    createdAt: "2024-11-23",
    author: {
      id: "user1",
      name: "DuyHoang",
      avatar: "/api/placeholder/40/40"
    },
    comments: [
      {
        id: "comment1",
        content: "This request is too easy, who want it?? I can do it in 2 days with AI =))",
        author: {
          id: "user2",
          name: "Do Tu",
          avatar: "/api/placeholder/32/32"
        },
        createdAt: "2024-11-23",
        duration: "2d"
      }
    ]
  },
  {
    id: "2",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    duration: "5 days",
    createdAt: "2024-11-26",
    author: {
      id: "user3",
      name: "PhucHoa",
      avatar: "/api/placeholder/40/40"
    },
    comments: []
  }
];

export function RequestHubView() {
  const [mode, setMode] = useState<RequestHubMode>('view');
  const [requests, setRequests] = useState<RequestHubItem[]>(mockRequests);
  const [editingRequest, setEditingRequest] = useState<RequestHubItem | null>(null);

  const handleCreateNew = () => {
    setMode('create');
  };

  const handleEdit = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setEditingRequest(request);
      setMode('edit');
    }
  };

  const handleCreateSubmit = (data: CreateRequestData) => {
    const newRequest: RequestHubItem = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      duration: data.duration,
      createdAt: new Date().toISOString(),
      author: {
        id: "current-user",
        name: "Current User",
        avatar: "/api/placeholder/40/40"
      },
      comments: []
    };
    
    setRequests(prev => [newRequest, ...prev]);
    setMode('view');
  };

  const handleUpdateSubmit = (data: UpdateRequestData) => {
    setRequests(prev => prev.map(request => 
      request.id === data.id 
        ? { ...request, title: data.title, description: data.description, duration: data.duration }
        : request
    ));
    setMode('view');
    setEditingRequest(null);
  };

  const handleDelete = (id: string) => {
    setRequests(prev => prev.filter(request => request.id !== id));
  };

  const handleContact = (id: string) => {
    console.log('Contact user for request:', id);
    // Implement contact functionality
  };

  const handleReport = (id: string) => {
    console.log('Report request:', id);
    // Implement report functionality
  };

  const handleCancel = () => {
    setMode('view');
    setEditingRequest(null);
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
      case 'edit':
        return editingRequest ? (
          <EditRequestSection
            initialData={{
              id: editingRequest.id,
              title: editingRequest.title,
              description: editingRequest.description,
              duration: editingRequest.duration
            }}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCancel}
          />
        ) : null;
      case 'view':
      default:
        return (
          <ViewRequestSection
            requests={requests}
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onContact={handleContact}
            onReport={handleReport}
          />
        );
    }
  };

  return (
    <RequestHubLayout>
      {renderContent()}
    </RequestHubLayout>
  );
}