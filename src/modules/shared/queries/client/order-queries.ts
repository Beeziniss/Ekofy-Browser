import { graphql } from "@/gql";

export const OrderPackageQuery = graphql(`
  query OrderPackage($where: PackageOrderFilterInput, $take: Int, $skip: Int) {
    packageOrders(where: $where, take: $take, skip: $skip, order: { createdAt: DESC }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
      items {
        id
        status
        clientId
        providerId
        artistPackageId
        createdAt
        revisionCount
        duration
        startedAt
        freezedTime
        disputedReason
        requirements
        deliveries {
          notes
          revisionNumber
          deliveredAt
          deliveryFileUrl
          clientFeedback
        }
        package {
          id
          amount
          packageName
          estimateDeliveryDays
          maxRevision
          serviceDetails {
            value
          }
        }
        client {
          displayName
          avatarImage
        }
        provider {
          avatarImage
          stageName
          email
        }
      }
    }
  }
`);
