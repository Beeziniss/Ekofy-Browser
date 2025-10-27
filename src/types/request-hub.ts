export interface RequestHubItem {
  id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  category: string;
  tags: string[];
  applicationCount: number;
  postedTime: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    memberSince?: string;
    location?: string;
    jobsPosted?: number;
  };
  requirements?: string[];
  deliverables?: string[];
  timeline?: string[];
  skills?: string[];
}

export interface RequestHubComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  duration?: string;
}

export interface CreateRequestData {
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  category: string;
  tags: string[];
  requirements?: string[];
  deliverables?: string[];
  timeline?: string[];
  skills?: string[];
}

export interface UpdateRequestData extends CreateRequestData {
  id: string;
}

export type RequestHubMode = 'view' | 'create' | 'edit' | 'detail';