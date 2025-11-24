export interface RequestBudget {
  min: number;
  max: number;
}

export interface RequestHubItem {
  id: string;
  requestUserId: string;
  title: string;
  summary: string;
  detailDescription: string;
  budget: RequestBudget;
  deadline: Date;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
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
  summary: string;
  detailDescription: string;
  budget: RequestBudget;
  duration: number;
}

export interface UpdateRequestData {
  id: string;
  title: string;
  summary: string;
  detailDescription: string;
  budget: RequestBudget;
  duration: number;
  status?: RequestStatus;
}

export enum RequestStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface RequestCreatingRequestInput {
  title: string;
  summary: string;
  detailDescription: string;
  budget: RequestBudget;
  deadline: Date;
}

export interface RequestUpdatingRequestInput {
  id: string;
  title: string;
  summary: string;
  detailDescription: string;
  budget: RequestBudget;
  deadline: Date;
  status?: RequestStatus;
}

export type RequestHubMode = "view" | "create" | "edit" | "detail";
