export interface ApprovalHistorySnapshot {
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

export interface ApprovalHistoryItem {
  id: string;
  approvalType: string;
  actionByUserId: string;
  actionAt: string;
  action: string;
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
