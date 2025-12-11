"use client";

import { graphql } from "@/gql";
import { UserManagementLayout } from "../layouts";
import { UserDetailSection } from "../sections";

interface AdminUserDetailViewProps {
  userId: string;
}

export const GET_ARTISTS = graphql(`
  query AdminArtistsDetail($where: ArtistFilterInput) {
    artists(where: $where) {
      items {
        id
        userId
        stageName
        stageNameUnsigned
        email
        artistType
        members {
          fullName
          email
          phoneNumber
          isLeader
          gender
        }
        biography
        categoryIds
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
          frontImage
          backImage
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
          email
          id
          fullName
          gender
          birthDate
          role
          status
        }
      }
    }
  }
`);

export const AdminListenerDetail = graphql(`
  query AdminListenerDetail($where: ListenerFilterInput) {
    listeners(where: $where) {
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
        updatedAt
        user {
          gender
          birthDate
          role
          fullName
          status
        }
      }
    }
  }
`);

export function AdminUserDetailView({ userId }: AdminUserDetailViewProps) {
  return (
    <UserManagementLayout
      title="User Details"
      description="View detail user information and manage user status"
      showBackButton={true}
    >
      <UserDetailSection userId={userId} />
    </UserManagementLayout>
  );
}
