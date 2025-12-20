import { execute } from '@/gql/execute';
import { fingerprintConfidencePolicyQuery } from '@/modules/shared/queries/admin/fingerprint-query';

export const fingerprintConfidencePolicyOptions = () => ({
  queryKey: ['fingerprint-confidence-policy'],
  queryFn: async () => {
    const result = await execute(fingerprintConfidencePolicyQuery);
    return result.fingerprintConfidencePolicy || null;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

