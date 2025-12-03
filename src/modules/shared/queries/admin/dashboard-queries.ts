import { graphql } from "@/gql";

export const PAYMENT_TRANSACTIONS = graphql(`
    query PaymentTransactions($skip: Int, $take: Int, $where: PaymentTransactionFilterInput, $order: [PaymentTransactionSortInput!]) {
        paymentTransactions(skip: $skip, take: $take, where: $where, order: $order) {
            totalCount
            items {
                id
                amount
                currency
                createdAt
                paymentStatus
                status
                stripePaymentMethod
                stripePaymentId
                stripeCheckoutSessionId
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
        }
    }
`);

export const PAYOUT_TRANSACTIONS = graphql(`
    query PayoutTransactions($skip: Int, $take: Int, $where: PayoutTransactionFilterInput, $order: [PayoutTransactionSortInput!]) {
        payoutTransactions(skip: $skip, take: $take, where: $where, order: $order) {
            totalCount
            items {
                id
                amount
                currency
                createdAt
                status
                stripePayoutId
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
        }
    }
`);

export const REFUND_TRANSACTIONS = graphql(`
    query RefundTransactions($skip: Int, $take: Int, $where: RefundTransactionFilterInput, $order: [RefundTransactionSortInput!]) {
        refundTransactions(skip: $skip, take: $take, where: $where, order: $order) {
            totalCount
            items {
                id
                amount
                currency
                createdAt
                status
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
        }
    }
`);

export const TOTAL_LISTENER = graphql(`
    query ListenerDashBoard($where: ListenerFilterInput, $order: [ListenerSortInput!]) {
        listeners(where: $where, order: $order) {
            totalCount
            items{
                createdAt
            }
        }
    }
`);

export const TOTAL_ARTIST = graphql(`
    query ArtistDashBoard($where: ArtistFilterInput, $order: [ArtistSortInput!]) {
        artists(where: $where, order: $order) {
            totalCount
            items{
                createdAt
            }
        }
    }
`);

export const TOTAL_TRACKS = graphql(`
    query TotalTracksDashBoard($where: TrackFilterInput, $order: [TrackSortInput!]) {
        tracks(where: $where, order: $order) {
            totalCount
            items{
                createdAt
            }
        }
    }
`);

export const INVOICE_DASHBOARD = graphql(`
    query InvoicesDashBoard($skip: Int, $take: Int, $where: InvoiceFilterInput, $order: [InvoiceSortInput!]) {
        invoices(skip: $skip, take: $take, where: $where, order: $order) {
            totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
         items {
            id
            paymentTransactionId
            paidAt
            oneOffSnapshot {
                packageName
                packageAmount
                packageCurrency
            }
            subscriptionSnapshot {
                subscriptionName
                subscriptionAmount
                subscriptionCurrency
                subscriptionTier
            }
            transaction{
                amount
                currency
                paymentStatus
                stripePaymentMethod
                createdAt
                }
            }
        }
    }
`);

export const INVOICE_DASHBOARD_DETAILS = graphql(`
    query InvoicesDetail($where: InvoiceFilterInput) {
    invoices(where: $where) {
        items {
            id
            userId
            paymentTransactionId
            fullName
            email
            country
            amount
            currency
            from
            to
            originContext
            paidAt
            oneOffSnapshot {
                packageName
                packageAmount
                packageCurrency
                estimateDeliveryDays
                packageDescription
                maxRevision
                artistPackageStatus
                duration
                platformFeePercentage
                artistFeePercentage
                oneOffType
                serviceDetails {
                    key
                    value
                }
            }
            subscriptionSnapshot {
                subscriptionName
                subscriptionDescription
                subscriptionCode
                subscriptionVersion
                subscriptionAmount
                subscriptionCurrency
                subscriptionTier
                subscriptionStatus
                stripeProductId
                stripeProductActive
                stripeProductName
                stripeProductImages
                stripeProductType
            }
            transaction {
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
                    id
                    userId
                    displayName
                }
                artist {
                    id
                    userId
                    stageName
                }
            }
        }
    }
}
`);

export const PLATFORM_REVENUE = graphql(`
    query PlatformRevenue($skip: Int, $take: Int, $where: PlatformRevenueFilterInput, $order: [PlatformRevenueSortInput!]) {
        platformRevenues(skip: $skip, take: $take, where: $where, order: $order) {
        items {
            subscriptionRevenue
            serviceRevenue
            grossRevenue
            royaltyPayoutAmount
            servicePayoutAmount
            refundAmount
            totalPayoutAmount
            grossDeductions
            commissionProfit
            netProfit
            currency
            createdAt
            updatedAt
        }
    }
}
`);

export const TRACK_DAILY_METRICS = graphql(`
    query TrackDailyMetrics ($where: TrackDailyMetricFilterInput) {
    trackDailyMetrics(where: $where) {
        items {
            createdAt
        }
        totalCount
    }
}
`);