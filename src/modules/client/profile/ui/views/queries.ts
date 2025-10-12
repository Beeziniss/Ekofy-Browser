import type {
  ListenerFilterInput,
  TypedDocumentString,
  Scalars,
  UserGender,
  UserSubscriptionFilterInput,
  SubscriptionTier,
  SubscriptionStatus,
} from "@/gql/graphql";

// Raw typed query string to avoid relying on codegen's graphql() union at dev-time.
export const GetListenerProfileQuery = `
  query GetListenerProfile($where: ListenerFilterInput, $take: Int, $skip: Int) {
    listeners(where: $where, take: $take, skip: $skip) {
      items {
        id
        userId
        displayName
        email
        avatarImage
        bannerImage
        createdAt
        followerCount
        followingCount
        isVerified
        user {
          birthDate
          gender
        }
      }
    }
  }
` as unknown as TypedDocumentString<
  {
    listeners?: {
      items?: Array<
        | {
            id: string;
            userId: string;
            displayName: string;
            email: string;
            avatarImage?: string | null;
            bannerImage?: string | null;
            createdAt: Scalars['DateTime']['output'];
            followerCount: number;
            followingCount: number;
            isVerified: boolean;
            user?: { birthDate: Scalars['DateTime']['output']; gender: UserGender } | null;
          }
        | null
      > | null;
    } | null;
  },
  { where?: ListenerFilterInput; take?: number; skip?: number }
>;

// Active subscription for a user to derive membership status
export const GetUserActiveSubscriptionQuery = `
  query GetUserActiveSubscription($where: UserSubscriptionFilterInput, $take: Int, $skip: Int) {
    userSubscriptions(where: $where, take: $take, skip: $skip) {
      items {
        id
        isActive
        subscription {
          tier
          status
          name
        }
      }
    }
  }
` as unknown as TypedDocumentString<
  {
    userSubscriptions?: {
      items?: Array<
        | {
            id: string;
            isActive: boolean;
            subscription?: {
              tier: SubscriptionTier;
              status: SubscriptionStatus;
              name: string;
            } | null;
          }
        | null
      > | null;
    } | null;
  },
  { where?: UserSubscriptionFilterInput; take?: number; skip?: number }
>;
