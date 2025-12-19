import { graphql } from '@/gql';

export const fingerprintConfidencePolicyQuery = graphql(`
    query FingerprintConfidencePolicy {
        fingerprintConfidencePolicy {
            id
            rejectThreshold
            manualReviewThreshold
        }
    }
`);