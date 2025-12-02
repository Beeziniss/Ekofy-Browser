import { execute } from '@/gql/execute';
import { ROYALTY_POLICIES_QUERY } from "@/modules/shared/queries/admin/royalty-policies-queries";
import { RoyaltyPolicyFilterInput, PolicyStatus, RoyaltyPoliciesQuery } from '../graphql';

type RoyaltyPolicy = NonNullable<
  NonNullable<RoyaltyPoliciesQuery["royaltyPolicies"]>["items"]
>[number];

export const royaltyPoliciesOptions = (skip: number, take: number, where?: RoyaltyPolicyFilterInput) => ({
  queryKey: ["royalty-policies", skip, take, where],
  queryFn: async () => {
    const result = await execute(ROYALTY_POLICIES_QUERY, { skip, take, where });
    return result.royaltyPolicies || {
      items: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Helper functions for royalty policy filtering
export const getActivePolicies = (policies: RoyaltyPolicy[]) => {
  return policies.filter((p) => p.status === PolicyStatus.Active);
};

export const getInactivePolicies = (policies: RoyaltyPolicy[]) => {
  return policies.filter((p) => p.status === PolicyStatus.Inactive);
};

export const getCurrentActiveVersion = (policies: RoyaltyPolicy[]): number | null => {
  const activePolicy = policies.find((p) => p.status === PolicyStatus.Active);
  return activePolicy ? Number(activePolicy.version) : null;
};

export const getAvailableInactiveVersions = (policies: RoyaltyPolicy[]): number[] => {
  const inactivePolicies = getInactivePolicies(policies);
  return Array.from(
    new Set(inactivePolicies.map((p) => Number(p.version)))
  ).sort((a, b) => b - a);
};

// Get available versions for downgrade (only versions lower than current active version)
export const getDowngradeAvailableVersions = (policies: RoyaltyPolicy[]): number[] => {
  const currentVersion = getCurrentActiveVersion(policies);
  if (currentVersion === null) return [];
  
  const inactivePolicies = getInactivePolicies(policies);
  return Array.from(
    new Set(
      inactivePolicies
        .map((p) => Number(p.version))
        .filter((v) => v < currentVersion) // Only versions lower than current
    )
  ).sort((a, b) => b - a);
};

// Get highest version number from all policies
export const getHighestVersion = (policies: RoyaltyPolicy[]): number | null => {
  if (policies.length === 0) return null;
  const versions = policies.map((p) => Number(p.version));
  return Math.max(...versions);
};

// Get lowest version number from all policies
export const getLowestVersion = (policies: RoyaltyPolicy[]): number | null => {
  if (policies.length === 0) return null;
  const versions = policies.map((p) => Number(p.version));
  return Math.min(...versions);
};

// Check if current active version is the latest
export const isCurrentVersionLatest = (policies: RoyaltyPolicy[]): boolean => {
  const currentVersion = getCurrentActiveVersion(policies);
  const highestVersion = getHighestVersion(policies);
  
  if (currentVersion === null || highestVersion === null) return false;
  return currentVersion === highestVersion;
};

// Check if current active version is the lowest
export const isCurrentVersionLowest = (policies: RoyaltyPolicy[]): boolean => {
  const currentVersion = getCurrentActiveVersion(policies);
  const lowestVersion = getLowestVersion(policies);
  
  if (currentVersion === null || lowestVersion === null) return false;
  return currentVersion === lowestVersion;
};

// Check if downgrade is available (has versions lower than current)
export const isDowngradeAvailable = (policies: RoyaltyPolicy[]): boolean => {
  const availableVersions = getDowngradeAvailableVersions(policies);
  return availableVersions.length > 0;
};