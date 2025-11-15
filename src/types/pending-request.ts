export interface PendingRequestBudget {
  min: number;
  max: number;
}

export interface PendingRequestor {
  id: string;
  userId: string;
  displayName: string;
  email: string;
}

export interface PendingArtist {
  id: string;
  userId: string;
  stageName: string;
}

export interface PendingArtistPackage {
  artistId: string;
  id: string;
  packageName: string;
  amount: number;
  currency: string;
  maxRevision: number;
  estimateDeliveryDays: number;
}

export interface PendingRequestItem {
  id: string;
  requestUserId: string;
  artistId: string;
  packageId: string;
  title: string;
  requestCreatedTime: string;
  type: string;
  status: PendingRequestStatus;
  budget: PendingRequestBudget;
  postCreatedTime: string;
  currency: string;
  requestor: PendingRequestor;
  artist: PendingArtist;
  artistPackage: PendingArtistPackage;
}

export interface PendingRequestDetail extends PendingRequestItem {
  titleUnsigned: string;
  summary: string;
  summaryUnsigned: string;
  detailDescription: string;
  requirements?: string;
  updatedAt: string;
  deadline: string;
  notes?: string;
}

export interface PendingRequestListResponse {
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  items: PendingRequestItem[];
}

export enum PendingRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum PendingRequestType {
  CUSTOM = "CUSTOM",
  PACKAGE = "PACKAGE"
}

export interface ChangeRequestStatusInput {
  requestId: string;
  status: PendingRequestStatus;
  notes?: string;
}

export interface PendingRequestFilterInput {
  status?: PendingRequestStatus;
  type?: PendingRequestType;
  artistId?: string;
  requestUserId?: string;
  search?: string;
}