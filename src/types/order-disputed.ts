import { PackageOrderStatus } from "@/gql/graphql";

export interface PackageOrderItem {
  id: string;
  clientId: string;
  providerId: string;
  status: PackageOrderStatus;
  createdAt: string;
  disputedAt: string | null;
  package: Array<{
    packageName: string;
    amount: number;
    currency: string;
  }>;
  client: Array<{
    displayName: string;
    avatarImage: string | null;
  }>;
  provider: Array<{
    stageName: string;
    avatarImage: string | null;
  }>;
  paymentTransaction: Array<{
    amount: number;
    currency: string;
    paymentStatus: string;
  }>;
}

export interface PackageOrderDetail {
  id: string;
  status: PackageOrderStatus;
  requirements: string;
  revisionCount: number;
  duration: number;
  clientId: string;
  providerId: string;
  startedAt?: string | null;
  disputedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  freezedTime?: string | null;
  conversationId?: string | null;
  platformFeePercentage: number;
  artistFeePercentage: number;
  isEscrowReleased: boolean;
  package: Array<{
    id: string;
    packageName: string;
    amount: number;
    estimateDeliveryDays: number;
    maxRevision: number;
    serviceDetails: Array<{ value: string }>;
    currency: string;
  }>;
  client: Array<{
    id: string;
    displayName: string;
    avatarImage: string | null;
    email: string;
  }>;
  provider: Array<{
    id: string;
    stageName: string;
    avatarImage: string | null;
    email: string;
  }>;
  paymentTransaction: Array<{
    id: string;
    amount: number;
    currency: string;
    paymentStatus: string;
    stripePaymentId: string;
    createdAt: string;
  }>;
  deliveries?: Array<{
    deliveryFileUrl: string;
    notes: string;
    revisionNumber: number;
    clientFeedback: string | null;
    deliveredAt: string;
  }>;
  review?: {
    rating: number;
    content: string;
    createdAt: string;
  } | null;
}
