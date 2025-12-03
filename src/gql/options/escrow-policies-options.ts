import { execute } from '@/gql/execute';
import { EXCROW_COMMISSION_POLICIES } from "@/modules/shared/queries/admin/escrow-policies-queries";
import { EscrowCommissionPolicyFilterInput, PolicyStatus, EscrowCommissionPoliciesQuery } from '../graphql';

type EscrowCommissionPolicy = NonNullable<
  NonNullable<EscrowCommissionPoliciesQuery["escrowCommissionPolicies"]>["items"]
>[number];

export const escrowPoliciesOptions = (skip: number, take: number, where?: EscrowCommissionPolicyFilterInput) => ({
  queryKey: ["escrow-policies", skip, take, where],
  queryFn: async () => {
    const result = await execute(EXCROW_COMMISSION_POLICIES, { skip, take, where });
    return result.escrowCommissionPolicies || {
      items: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Helper functions for escrow policy filtering
export const getActivePolicies = (policies: EscrowCommissionPolicy[]) => {
  return policies.filter((p) => p.status === PolicyStatus.Active);
};

export const getInactivePolicies = (policies: EscrowCommissionPolicy[]) => {
  return policies.filter((p) => p.status === PolicyStatus.Inactive);
};

export const getCurrentActiveVersion = (policies: EscrowCommissionPolicy[]): number | null => {
  const activePolicy = policies.find((p) => p.status === PolicyStatus.Active);
  return activePolicy ? Number(activePolicy.version) : null;
};

export const getAvailableInactiveVersions = (policies: EscrowCommissionPolicy[]): number[] => {
  const inactivePolicies = getInactivePolicies(policies);
  return Array.from(
    new Set(inactivePolicies.map((p) => Number(p.version)))
  ).sort((a, b) => b - a);
};

// Get available versions for downgrade (only versions lower than current active version)
export const getDowngradeAvailableVersions = (policies: EscrowCommissionPolicy[]): number[] => {
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
export const getHighestVersion = (policies: EscrowCommissionPolicy[]): number | null => {
  if (policies.length === 0) return null;
  const versions = policies.map((p) => Number(p.version));
  return Math.max(...versions);
};

// Get lowest version number from all policies
export const getLowestVersion = (policies: EscrowCommissionPolicy[]): number | null => {
  if (policies.length === 0) return null;
  const versions = policies.map((p) => Number(p.version));
  return Math.min(...versions);
};

// Check if current active version is the latest
export const isCurrentVersionLatest = (policies: EscrowCommissionPolicy[]): boolean => {
  const currentVersion = getCurrentActiveVersion(policies);
  const highestVersion = getHighestVersion(policies);
  
  if (currentVersion === null || highestVersion === null) return false;
  return currentVersion === highestVersion;
};

// Check if current active version is the lowest
export const isCurrentVersionLowest = (policies: EscrowCommissionPolicy[]): boolean => {
  const currentVersion = getCurrentActiveVersion(policies);
  const lowestVersion = getLowestVersion(policies);
  
  if (currentVersion === null || lowestVersion === null) return false;
  return currentVersion === lowestVersion;
};

// Check if downgrade is available (has versions lower than current)
export const isDowngradeAvailable = (policies: EscrowCommissionPolicy[]): boolean => {
  const availableVersions = getDowngradeAvailableVersions(policies);
  return availableVersions.length > 0;
};
