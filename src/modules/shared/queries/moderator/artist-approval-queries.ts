import { graphql } from "@/gql";

export const PendingArtistRegistrationsQuery = graphql(`
  query PendingArtistRegistrationsList($pageNumber: Int!, $pageSize: Int!) {
    pendingArtistRegistrations(pageNumber: $pageNumber, pageSize: $pageSize) {
      totalCount
      items {
        email
        fullName
        stageName
        stageNameUnsigned
        artistType
        gender
        birthDate
        phoneNumber
        avatarImage
        id
        requestedAt
      }
    }
  }
`)

export const PendingArtistRegistrationsDetailQuery = graphql(`
  query PendingArtistRegistrationById($artistRegistrationId: String!) {
    pendingArtistRegistrationById(artistRegistrationId: $artistRegistrationId) {
      email
      fullName
      stageName
      artistType
      gender
      birthDate
      phoneNumber
      avatarImage
      id
      members {
        fullName
        email
        phoneNumber
        isLeader
        gender
      }
      requestedAt
      timeToLive
      identityCardNumber
      identityCardDateOfBirth
      identityCardFullName
      placeOfOrigin
      placeOfResidence
      frontImageUrl
      backImageUrl
    }
  }
`)