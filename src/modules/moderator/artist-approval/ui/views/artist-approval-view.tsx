"use client";

import { graphql } from "@/gql";
import { ArtistApprovalLayout } from "../layout";
import { ArtistApprovalSection } from "../section";

// export const GetArtistsListQuery = graphql(`
//   query Artists($skip: Int, $take: Int, $where: ArtistFilterInput!) {
//     artists(skip: $skip, take: $take, where: $where) {
//       totalCount
//       pageInfo {
//         hasNextPage
//         hasPreviousPage
//       }
//       items {
//         id
//         userId
//         stageName
//         email
//         artistType
//         isVerified
//         verifiedAt
//         createdAt
//         updatedAt
//         user {
//           status
//           gender
//           phoneNumber
//         }
//         members {
//           fullName
//           email
//           phoneNumber
//           isLeader
//           gender
//         }
//         avatarImage
//         bannerImage
//         identityCard {
//           number
//           fullName
//           dateOfBirth
//           gender
//           placeOfOrigin
//           nationality
//           frontImage
//           backImage
//           validUntil
//           placeOfResidence {
//             street
//             ward
//             province
//             oldDistrict
//             oldWard
//             oldProvince
//             addressLine
//           }
//         }
//       }
//     }
//   }
export const PendingArtistRegistrationsQuery = graphql(`
  query PendingArtistRegistrationsView($pageNumber: Int!, $pageSize: Int!) {
    pendingArtistRegistrations(pageNumber: $pageNumber, pageSize: $pageSize) {
      email
      fullName
      stageName
      artistType
      gender
      birthDate
      phoneNumber
      avatarImage
      id
    }
  }
`);

export function ArtistApprovalView() {
  return (
    <ArtistApprovalLayout
      title="Approval Center"
      description="Manage artist registration requests and approvals"
    >
      <ArtistApprovalSection />
    </ArtistApprovalLayout>
  );
}
