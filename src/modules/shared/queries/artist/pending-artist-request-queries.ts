import { graphql } from "@/gql";

export const GET_PENDING_ARTIST_REQUEST = graphql(`
    query GetPendingArtistRequest($skip: Int!, $take: Int!, $where: RequestFilterInput) {
      requests (skip: $skip, take: $take, where: $where) {
        totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        items {
            id
            requestUserId
            artistId
            packageId
            title
            requestCreatedTime
            type
            status
            budget {
                min
                max
            }
            postCreatedTime
            currency
            requestor {
                id
                userId
                displayName
            }
            artist {
                id
                stageName
                userId
            }
            artistPackage {
                artistId
                id
                packageName
            }
        }
      }
    }
`);

export const GET_PENDING_ARTIST_REQUEST_DETAILS = graphql(`
    query RequestPendingDetailById($where: RequestFilterInput) {
      requests(where: $where) {
      totalCount
        items {
            id
            requestUserId
            artistId
            packageId
            title
            titleUnsigned
            summary
            summaryUnsigned
            detailDescription
            requirements
            postCreatedTime
            updatedAt
            type
            currency
            deadline
            status
            requestCreatedTime
            notes
            requestor {
                id
                userId
                displayName
                email
            }
            artist {
                id
                userId
                stageName
            }
            artistPackage {
                id
                artistId
                packageName
                amount
                currency
                maxRevision
                estimateDeliveryDays
            }
            budget {
                min
                max
            }
        }
    }
}
`);
