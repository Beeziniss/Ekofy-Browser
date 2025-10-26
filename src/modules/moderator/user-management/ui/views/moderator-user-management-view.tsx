import { graphql } from "@/gql";

export const ModeratorGetListUser = graphql(`
  query ModeratorUsersList($skip: Int, $take: Int, $where: UserFilterInput) {
    users(skip: $skip, take: $take, where: $where) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        email
        fullName
        gender
        birthDate
        role
        phoneNumber
        status
        isLinkedWithGoogle
        stripeCustomerId
        stripeAccountId
        lastLoginAt
        createdAt
        updatedAt
      }
    }
    artists {
      items {
        id
        userId
        stageName
        email
        artistType
        categoryIds
        biography
        followerCount
        popularity
        avatarImage
        bannerImage
        isVerified
        verifiedAt
        createdAt
        updatedAt
        members {
          fullName
          email
          phoneNumber
          isLeader
          gender
        }
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
      }
    }
    listeners {
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
        lastFollowers
        lastFollowings
        createdAt
        updatedAt
      }
    }
  }
`);

export const ModeratorGetAnalytics = graphql(`
  query ModeratorUsersListAnalytics(
    $skip: Int
    $take: Int
    $where: UserFilterInput
  ) {
    users(skip: $skip, take: $take, where: $where) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        email
        fullName
        gender
        birthDate
        role
        phoneNumber
        status
        isLinkedWithGoogle
        stripeCustomerId
        stripeAccountId
        lastLoginAt
        createdAt
        updatedAt
      }
    }
    artists {
      items {
        id
        userId
        stageName
        email
        artistType
        categoryIds
        biography
        followerCount
        popularity
        avatarImage
        bannerImage
        isVerified
        verifiedAt
        createdAt
        updatedAt
        members {
          fullName
          email
          phoneNumber
          isLeader
          gender
        }
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
      }
    }
    listeners {
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
        lastFollowers
        lastFollowings
        createdAt
        updatedAt
      }
    }
  }
`);
export const DeActiveUserMutation = graphql(`
  mutation banUser($targetUserId: String!) {
    banUser(targetUserId: $targetUserId)
  }
`);

export const ReActiveUserMutation = graphql(`
  mutation ReActiveUser($targetUserId: String!) {
    unbanUser(targetUserId: $targetUserId)
  }
`);

import { ModeratorUserManagementLayout } from "../layout";
import { ModeratorUserManagementSection } from "../section";

export function UserManagementModerator() {
  return (
    <ModeratorUserManagementLayout
      title="User Management"
      description="Stats updated daily"
    >
      <ModeratorUserManagementSection />
    </ModeratorUserManagementLayout>
  );
}
