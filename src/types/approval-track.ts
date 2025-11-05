// Types for Track Approval System

// Base User type for list view (limited fields)
export interface UserBasic {
  __typename?: "User";
  id: string;
  email: string;
  fullName: string;
  gender: string;
  birthDate: string;
}

// Extended User type for detail view (full fields)  
export interface UserDetailed extends UserBasic {
  phoneNumber?: string | null;
  status: string;
}

// List view Track Upload Request (used in table)
export interface TrackUploadRequestListItem {
  id: string;
  track: {
    id: string;
    name: string;
    description?: string | null;
    type: string;
    mainArtistIds: string[];
    featuredArtistIds: string[];
    coverImage?: string | null;
    isExplicit?: boolean;
    tags?: string[];
    categoryIds?: string[];
    lyrics?: string | null;
    previewVideo?: string | null;
    createdBy: string;
    requestedAt: string;
    releaseInfo?: {
      isRelease: boolean;
      releaseDate?: string | null;
      releasedAt?: string | null;
      releaseStatus?: string | null;
    };
    legalDocuments?: Array<{
      name: string;
      documentUrl: string;
      documentType: string;
      note?: string | null;
    }>;
  };
  requestedAt: string;
  createdBy: string;
  mainArtists?: {
    __typename?: "MainArtistsCollectionSegment";
    items?: Array<{
      __typename?: "Artist";
      id: string;
      userId: string;
      stageName: string;
      stageNameUnsigned: string;
      email: string;
      artistType: string;
      avatarImage?: string | null;
    }> | null;
  } | null;
  featuredArtists?: {
    __typename?: "FeaturedArtistsCollectionSegment";
    items?: Array<{
      __typename?: "Artist";
      id: string;
      userId: string;
      stageName: string;
      stageNameUnsigned: string;
      email: string;
    }> | null;
  } | null;
  recordingUsers?: {
    __typename?: "RecordingUsersCollectionSegment";
    items?: UserBasic[] | null;
  } | null;
  workUsers?: {
    __typename?: "WorkUsersCollectionSegment";
    items?: UserBasic[] | null;
  } | null;
  work?: {
    id: string;
    description?: string | null;
  };
  recording?: {
    id: string;
    description?: string | null;
  };
}

// Detail view Track Upload Request (used in detail page)
export interface TrackUploadRequest {
  id: string;
  track: {
    id: string;
    name: string;
    description?: string | null;
    type: string;
    mainArtistIds: string[];
    featuredArtistIds: string[];
    coverImage?: string | null;
    isExplicit?: boolean;
    tags?: string[];
    categoryIds?: string[];
    lyrics?: string | null;
    previewVideo?: string | null;
    createdBy: string;
    requestedAt: string;
    releaseInfo?: {
      isRelease: boolean;
      releaseDate?: string | null;
      releasedAt?: string | null;
      releaseStatus?: string | null;
    };
    legalDocuments?: Array<{
      name: string;
      documentUrl: string;
      documentType: string;
      note?: string | null;
    }>;
  };
  requestedAt: string; // GraphQL DateTime type as string
  createdBy: string;
  mainArtists?: {
    __typename?: "MainArtistsCollectionSegment";
    items?: Array<{
      __typename?: "Artist";
      id: string;
      userId: string;
      stageName: string;
      stageNameUnsigned: string;
      email: string;
      artistType: string;
        avatarImage?: string | null;
      members?: Array<{
        fullName: string;
        email: string;
        phoneNumber: string;
        isLeader: boolean;
        gender: string;
      }>;
    }> | null;
  } | null;
  featuredArtists?: {
    __typename?: "FeaturedArtistsCollectionSegment";
    items?: Array<{
      __typename?: "Artist";
      id: string;
      userId: string;
      stageName: string;
      stageNameUnsigned: string;
      email: string;
      artistType?: string;
      avatarImage?: string | null;
    }> | null;
  } | null;
  recordingUsers?: {
    __typename?: "RecordingUsersCollectionSegment";
    items?: UserDetailed[] | null;
  } | null;
  workUsers?: {
    __typename?: "WorkUsersCollectionSegment";
    items?: UserDetailed[] | null;
  } | null;
  work?: {
    id: string;
    description?: string | null;
    workSplits?: Array<{
      userId: string;
      artistRole: string;
      percentage: number;
    }> | null;
  };
  recording?: {
    id: string;
    description?: string | null;
    recordingSplitRequests?: Array<{
      userId: string;
      artistRole: string;
      percentage: number;
    }> | null;
  };
}

export interface TrackUploadRequestsResponse {
  totalCount: number;
  items: TrackUploadRequestListItem[];
}

export interface TrackApprovalTableProps {
  data: TrackUploadRequestListItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onViewDetail: (uploadId: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchTerm: string;
  isLoading: boolean;
  error?: Error | null;
}

export interface TrackApprovalRequest {
  trackId: string;
  reason?: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
}

export interface AudioPlayerProps {
  uploadId: string;
  className?: string;
}

export interface TrackDetailViewProps {
  uploadId: string;
}