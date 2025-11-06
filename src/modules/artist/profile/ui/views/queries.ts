import type { ArtistFilterInput, TypedDocumentString, UserGender, UserStatus } from "@/gql/graphql";

export const GetArtistProfileQuery = `
  query GetArtistProfile($where: ArtistFilterInput, $take: Int, $skip: Int) {
    artists(where: $where, take: $take, skip: $skip) {
      items {
        id
        userId
        stageName
        email
        artistType
        avatarImage
        bannerImage
        biography
        members { fullName email gender isLeader phoneNumber }
        isVerified
        createdAt
        user { status }
        identityCard {
          number
          fullName
          dateOfBirth
          gender
          placeOfOrigin
          validUntil
          placeOfResidence { addressLine }
        }
      }
    }
  }
` as unknown as TypedDocumentString<
  {
    artists?: {
      items?: Array<{
        id: string;
        userId: string;
        stageName: string;
        email: string;
        artistType: string;
        avatarImage?: string | null;
        bannerImage?: string | null;
        biography?: string | null;
        members: Array<{ fullName: string; email: string; gender: UserGender; isLeader: boolean; phoneNumber: string }>;
        isVerified: boolean;
        createdAt: string;
        user?: { status: UserStatus } | null;
        identityCard?: {
          number?: string | null;
          fullName?: string | null;
          dateOfBirth?: string | null;
          gender?: UserGender | null;
          placeOfOrigin?: string | null;
          validUntil?: string | null;
          placeOfResidence?: { addressLine?: string | null } | null;
        } | null;
      } | null> | null;
    } | null;
  },
  { where?: ArtistFilterInput; take?: number; skip?: number }
>;

export const UpdateArtistProfileMutation = `
  mutation UpdateArtistProfile($updateArtistRequest: UpdateArtistRequestInput!) {
    updateArtistProfile(updateArtistRequest: $updateArtistRequest)
  }
` as unknown as TypedDocumentString<
  { updateArtistProfile: boolean },
  { updateArtistRequest: { biography?: string | null; avatarImage?: string | null; bannerImage?: string | null } }
>;
