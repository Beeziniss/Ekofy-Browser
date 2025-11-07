import { graphql } from "@/gql";

export const GetArtistProfileQuery = graphql(`
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
        members {
          fullName
          email
          gender
          isLeader
          phoneNumber
        }
        isVerified
        createdAt
        user {
          status
        }
        identityCard {
          number
          fullName
          dateOfBirth
          gender
          placeOfOrigin
          validUntil
          placeOfResidence {
            addressLine
          }
        }
      }
    }
  }
`);
