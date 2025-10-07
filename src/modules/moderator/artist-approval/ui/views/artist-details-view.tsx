"use client";

import { graphql } from "@/gql";
import { ArtistDetailsLayout } from "../layout";
import { ArtistDetailsSection } from "../section";

interface ArtistDetailsViewProps {
  userId: string;
}

export const GetArtistDetailsQuery = graphql(`
  query Artists($skip: Int, $take: Int, $where: ArtistFilterInput!) {
    artists(skip: $skip, take: $take, where: $where) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        userId
        stageName
        email
        artistType
        isVerified
        verifiedAt
        createdAt
        updatedAt
        user {
          status
          gender
          phoneNumber
        }
        members {
          fullName
          email
          phoneNumber
          isLeader
          gender
        }
        avatarImage
        bannerImage
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
      }
    }
  }
`);

export function ArtistDetailsView({ userId }: ArtistDetailsViewProps) {
  return (
    <ArtistDetailsLayout
      title="Artist information"
      description="Review artist details and approve or reject the application"
    >
      <ArtistDetailsSection userId={userId} />
    </ArtistDetailsLayout>
  );
}
