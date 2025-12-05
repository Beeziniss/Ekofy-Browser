import { graphql } from "@/gql";

// Query for package orders list (table view) with filtering and pagination
export const PACKAGE_ORDERS_LIST_QUERY = graphql(`
  query PackageOrdersList(
    $take: Int
    $skip: Int
    $where: PackageOrderFilterInput
    $order: [PackageOrderSortInput!]
  ) {
    packageOrders(take: $take, skip: $skip, where: $where, order: $order) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        clientId
        providerId
        artistPackageId
        paymentTransactionId
        requirements
        status
        revisionCount
        duration
        freezedTime
        startedAt
        disputedAt
        completedAt
        isEscrowReleased
        platformFeePercentage
        artistFeePercentage
        createdAt
        package {
          id
          packageName
          amount
          estimateDeliveryDays
          maxRevision
        }
        client {
          id
          displayName
          avatarImage
        }
        provider {
          id
          stageName
          avatarImage
        }
        paymentTransaction {
          id
          amount
          currency
          paymentStatus
          status
          createdAt
        }
      }
    }
  }
`);

// Query for package order detail view
export const PACKAGE_ORDER_DETAIL_QUERY = graphql(`
  query PackageOrderDetail($where: PackageOrderFilterInput) {
    packageOrders(where: $where) {
    items {
      id
      clientId
      providerId
      artistPackageId
      paymentTransactionId
      requirements
      status
      revisionCount
      deliveries {
        deliveryFileUrl
        notes
        revisionNumber
        clientFeedback
        requestedAt
        deliveredAt
      }
      duration
      freezedTime
      startedAt
      disputedAt
      completedAt
      isEscrowReleased
      platformFeePercentage
      artistFeePercentage
      review {
        rating
        content
        createdAt
        updatedAt
      }
      createdAt
      package {
        id
        packageName
        amount
        estimateDeliveryDays
        maxRevision
        serviceDetails {
          value
        }
      }
      client {
        id
        displayName
        avatarImage
      }
      provider {
        id
        stageName
        avatarImage
      }
      paymentTransaction {
        id
        userId
        stripeCheckoutSessionId
        stripeSubscriptionId
        stripeInvoiceId
        stripePaymentId
        stripePaymentMethod
        amount
        currency
        paymentStatus
        status
        createdAt
        updatedAt
        listener {
          displayName
          id
          avatarImage
        }
        artist {
          id
          stageName
          avatarImage
                }
            }
        }
    }
  }
`);
