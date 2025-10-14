"use client";

import { graphql } from "@/gql";
import { ModeratorUserManagementLayout } from "../layout";
import { ModeratorUserDetailSection } from "../section";

interface ModeratorUserDetailViewProps {
  userId: string;
}
export const MODERATOR_ARTIST_DETAIL_QUERY = graphql(`
    query ModeratorArtistDetail($id: String) {
        artists(where: { userId: { eq: $id } }) {
            totalCount
            items {
                id
                userId
                stageName
                email
                artistType
                members {
                    fullName
                    email
                    phoneNumber
                    isLeader
                    gender
                }
                categoryIds
                biography
                followerCount
                popularity
                avatarImage
                bannerImage
                isVerified
                verifiedAt
                identityCard {
                    number
                    fullName
                    dateOfBirth
                    gender
                    placeOfOrigin
                    nationality
                    validUntil
                    placeOfResidence {
                        street
                        ward
                        province
                        oldDistrict
                        oldWard
                        oldProvince
                        addressLine
                    }
                }
                createdAt
                user {
                    fullName
                    role
                    phoneNumber
                }
            }
        }
    }
`);

export const MODERATOR_LISTENER_DETAIL_QUERY = graphql(`
    query ModeratorListenerDetail($id: String) {
        listeners(where: { userId: { eq: $id } }) {
            items {
                id
                userId
                displayName
                email
                avatarImage
                bannerImage
                isVerified
                verifiedAt
                followerCount
                followingCount
                createdAt
                restriction {
                    type
                    reason
                    restrictedAt
                    expired
                }
                user {
                    fullName
                }
            }
        }
    }
`);

export function ModeratorUserDetailView({ userId }: ModeratorUserDetailViewProps) {
  return (
    <ModeratorUserManagementLayout
      title="User Details"
      description="View detailed user information and manage user status"
      showBackButton={true}
    >
      <ModeratorUserDetailSection userId={userId} />
    </ModeratorUserManagementLayout>
  );
}