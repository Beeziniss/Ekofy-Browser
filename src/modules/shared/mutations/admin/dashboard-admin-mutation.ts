import { graphql } from "@/gql";

export const ComputePlatformTransactions = graphql(`
    mutation ComputePlatformRevenue {
        computePlatformRevenue {
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
`);

