import { graphql } from "@/gql";

// Query to get all conversation messages for order dispute review
// Using cursor-based pagination (before/after) to load more messages
export const ORDER_CONVERSATION_MESSAGES_QUERY = graphql(`
  query OrderConversationMessages($where: MessageFilterInput, $last: Int, $before: String, $first: Int, $after: String) {
    messages(where: $where, last: $last, before: $before, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          conversationId
          senderId
          receiverId
          isRead
          text
          sentAt
          deletedForIds
          senderProfileMessages {
            avatar
            nickname
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`);

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
          currency
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
      conversationId
      requirements
      status
      revisionCount
      disputedReason
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
        currency
      }
      client {
        id
        displayName
        avatarImage
        email
      }
      provider {
        id
        stageName
        avatarImage
        email
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

export const ORDER_PACKAGE_REQUEST_QUERY = graphql(`
  query OrderPackageRequest($where: RequestFilterInput) {
    requests(where: $where) {
      items {
            id
            orderId
            title
            summary
            detailDescription
            requirements
        }
    }
}
`);