// Types for Track Approval System
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
      isReleased: boolean;
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
    }> | null;
  } | null;
  recordingUsers?: {
    __typename?: "RecordingUsersCollectionSegment";
    items?: Array<{
      __typename?: "User";
      id: string;
      email: string;
      fullName: string;
      gender: string;
      birthDate: string;
    }> | null;
  } | null;
  workUsers?: {
    __typename?: "WorkUsersCollectionSegment";
    items?: Array<{
      __typename?: "User";
      id: string;
      email: string;
      fullName: string;
      gender: string;
      birthDate: string;
    }> | null;
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

export interface TrackUploadRequestsResponse {
  totalCount: number;
  items: TrackUploadRequest[];
}

export interface TrackApprovalTableProps {
  data: TrackUploadRequest[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onViewDetail: (trackId: string) => void;
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
  trackId: string;
  className?: string;
}

export interface TrackDetailViewProps {
  trackId: string;
}