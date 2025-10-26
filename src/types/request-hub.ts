export interface RequestHubItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  attachments?: string[];
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  comments: RequestHubComment[];
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
  duration: string;
  attachments?: File[];
}

export interface UpdateRequestData extends CreateRequestData {
  id: string;
}

export type RequestHubMode = 'view' | 'create' | 'edit';