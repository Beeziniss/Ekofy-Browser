import { graphql } from "@/gql";

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
        user {
          fullName
          birthDate
          gender
          phoneNumber
        }
      }
    }
  }
`);

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
  query ModeratorUsersListAnalytics($skip: Int, $take: Int, $where: UserFilterInput) {
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
