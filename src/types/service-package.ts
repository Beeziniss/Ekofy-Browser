export enum ArtistPackageStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export interface ServiceDetail {
  key: string;
  value: string;
}

export interface ServicePackage {
  id: string;
  packageName: string;
  amount: number;
  currency: string;
  estimateDeliveryDays: number;
  description: string;
  serviceDetails: ServiceDetail[];
  updatedAt: string;
  createdAt: string;
  version: number;
  artistId: string;
  status: ArtistPackageStatus;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ArtistPackagesResponse {
  totalCount: number;
  items: ServicePackage[];
  pageInfo: PageInfo;
}

export interface ArtistPackagesDetailQuery {
  id: string;
  packageName: string;
  amount: number;
  currency: string;
  estimateDeliveryDays: number;
  description: string;
  serviceDetails: ServiceDetail[];
  status: ArtistPackageStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArtistPackageRequest {
  artistId: string;
  amount: number;
  packageName: string;
  description: string;
  estimateDeliveryDays: number;
  serviceDetails: ServiceDetail[];
}

export interface UpdateArtistPackageRequest {
  id: string;
  packageName: string;
  description: string;
}

export interface DeleteArtistPackageRequest {
  artistPackageId: string;
}

export interface ChangeArtistPackageStatusRequest {
  artistPackageId: string;
  status: ArtistPackageStatus;
}

export interface ApproveArtistPackageRequest {
  changeArtistPackageStatus: ChangeArtistPackageStatusRequest;
}
