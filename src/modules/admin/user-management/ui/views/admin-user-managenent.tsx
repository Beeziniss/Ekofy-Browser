import { graphql } from "@/gql";
import { UserManagementLayout } from "../layout";
import { UserManagementSection } from "../section";

export const AdminGetListUser = graphql(`
  query UsersList($skip: Int, $take: Int, $where: UserFilterInput) {
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

export const AdminGetStatistics = graphql(`
  query UsersStatistic($skip: Int, $take: Int, $where: UserFilterInput) {
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
  }
`);

export const CreateModeratorMutation = graphql(`
  mutation CreateModerator(
    $createModeratorRequest: CreateModeratorRequestInput!
  ) {
    createModerator(createModeratorRequest: $createModeratorRequest)
  }
`);

export const DeActiveUserMutation = graphql(`
  mutation banUser($targetUserId: String!) {
    banUser(targetUserId: $targetUserId)
  }
`);

export const ReActiveUserMutation = graphql(`
  mutation ReActiveUser($targetUserId: String!) {
    reActiveUser(targetUserId: $targetUserId)
  }
`);

export function AdminUserManagement() {
  return (
    <UserManagementLayout>
      <UserManagementSection />
    </UserManagementLayout>
  );
}
