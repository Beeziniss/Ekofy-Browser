// Artist Registration Snapshot
export interface ArtistRegistrationSnapshot {
  UserId: string;
  Email: string;
  PasswordHash: string;
  FullName: string;
  BirthDate: string;
  Gender: string;
  PhoneNumber: string;
  StageName: string;
  StageNameUnsigned: string;
  ArtistType: string;
  AvatarImage: string | null;
  Members: Array<{
    FullName: string;
    Email: string;
    PhoneNumber: string;
    IsLeader: boolean;
    Gender: string;
  }>;
  LegalDocuments?: Array<{
    Name: string;
    DocumentUrl: string;
    DocumentType: string;
    Note: string;
  }>;
  IdentityCard: {
    Number: string;
    FullName: string;
    DateOfBirth: string;
    Gender: string;
    PlaceOfOrigin: string;
    Nationality: string;
    PlaceOfResidence: {
      Street: string;
      Ward: string;
      Province: string;
      OldDistrict: string | null;
      OldWard: string | null;
      OldProvince: string | null;
      AddressLine: string;
    };
    FrontImage: string;
    BackImage: string;
    ValidUntil: string;
  };
  RequestedAt: string;
}

// Track Upload Snapshot
export interface TrackUploadSnapshot {
  Id: string;
  Name: string;
  Description: string | null;
  Type: string;
  MainArtistIds: string[];
  FeaturedArtistIds: string[];
  CategoryIds: string[];
  Tags: string[];
  CoverImage: string;
  PreviewVideo: string | null;
  IsExplicit: boolean;
  Lyrics: string | null;
  ReleaseInfo: {
    IsReleased: boolean;
    ReleaseDate: string | null;
    ReleasedAt: string | null;
    ReleaseStatus: string;
  };
  LegalDocuments: Array<{
    Name: string;
    DocumentUrl: string;
    DocumentType: string;
    Note: string;
  }>;
  CreatedBy: string;
  RequestedAt: string;
}

// Work Upload Snapshot
export interface WorkUploadSnapshot {
  Id: string;
  Description: string | null;
  WorkSplits: Array<{
    UserId: string;
    ArtistRole: string;
    Percentage: number;
  }>;
}

// Recording Upload Snapshot
export interface RecordingUploadSnapshot {
  Id: string;
  Description: string | null;
  RecordingSplitRequests: Array<{
    UserId: string;
    ArtistRole: string;
    Percentage: number;
  }>;
}

// Dispute Resolution Snapshot
export interface DisputeResolutionSnapshot {
  // Package Order fields (flat structure from backend)
  PackageOrderId: string;
  PackageOrderStatus: string;
  PackageOrderAmount: number;
  DisputedReason: string | null;
  
  // Refund resolution fields
  RequestorPercentage: number;
  ArtistPercentage: number;
  RefundAmount: number;
  EscrowReleaseAmount: number;
  
  // Related IDs (need to fetch full data separately)
  ClientId: string;
  ProviderId: string;
}

// Union type for all snapshot types
export type ApprovalHistorySnapshot =
  | ArtistRegistrationSnapshot
  | TrackUploadSnapshot
  | WorkUploadSnapshot
  | RecordingUploadSnapshot
  | DisputeResolutionSnapshot;

export interface ApprovalHistoryItem {
  id: string;
  approvalType: "ARTIST_REGISTRATION" | "TRACK_UPLOAD" | "WORK_UPLOAD" | "RECORDING_UPLOAD" | "DISPUTE_RESOLUTION";
  actionByUserId: string;
  actionAt: string;
  action: "APPROVED" | "REJECTED" | "PENDING";
  notes?: string | null | undefined;
  snapshot: ApprovalHistorySnapshot;
  approvedBy: Array<{
    id: string;
    email: string;
    fullName: string;
    role: string;
  }>;
  targetId: string;
}

export interface ApprovalHistoriesResponse {
  approvalHistories: {
    totalCount: number;
    items: ApprovalHistoryItem[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface ApprovalHistoriesFilters {
  searchTerm: string;
  page: number;
  pageSize: number;
}
