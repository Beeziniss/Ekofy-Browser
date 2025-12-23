"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";
import { adminCouponByIdOptions, deprecateCouponMutationOptions } from "@/gql/options/admin-options";
import { CouponStatus } from "@/gql/graphql";
import { format } from "date-fns";
import { toast } from "sonner";

interface CouponDetailSectionProps {
  couponId: string;
}


export function CouponDetailSection({ couponId }: CouponDetailSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: coupon, isLoading, error } = useQuery(adminCouponByIdOptions(couponId));

  // Deprecate coupon mutation
  const { mutate: deprecateCoupon, isPending: isDeprecating } = useMutation({
    ...deprecateCouponMutationOptions,
    onSuccess: () => {
      toast.success("Coupon deprecated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      queryClient.invalidateQueries({ queryKey: ["admin-coupon", couponId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to deprecate coupon: ${error.message}`);
    },
  });

  const handleBack = () => {
    router.push("/admin/coupon");
  };

  const handleDeprecate = () => {
    if (confirm("Are you sure you want to deprecate this coupon?")) {
      deprecateCoupon([couponId]);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  if (error || !coupon) {
    return (
      <div className="text-red-500">
        Error loading coupon: {error?.message || "Coupon not found"}
      </div>
    );
  }

  const getStatusBadge = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.Active:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case CouponStatus.Deprecated:
        return <Badge variant="destructive">Deprecated</Badge>;
      case CouponStatus.Expired:
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>{coupon.name}</CardTitle>
                <CardDescription>Coupon Details</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {/* <Button variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button> */}
              {coupon.status === CouponStatus.Active && (
                <Button variant="destructive" onClick={handleDeprecate} disabled={isDeprecating}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeprecating ? "Deprecating..." : "Deprecate"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-400">Coupon Code</label>
              <p className="mt-1 font-mono text-lg bg-gray-800 px-3 py-2 rounded">{coupon.code}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Status</label>
              <div className="mt-1">{getStatusBadge(coupon.status)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Discount</label>
              <p className="mt-1 text-2xl font-bold">{coupon.percentOff}%</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Duration</label>
              <p className="mt-1 capitalize">{coupon.duration.replace(/_/g, " ")}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Purpose</label>
              <p className="mt-1 capitalize">{coupon.purpose.replace(/_/g, " ")}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Stripe Coupon ID</label>
              <p className="mt-1 font-mono text-sm text-gray-300">{coupon.stripeCouponId}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Created At</label>
              <p className="mt-1">{format(new Date(coupon.createdAt), "MMM dd, yyyy HH:mm")}</p>
            </div>

            {coupon.updatedAt && (
              <div>
                <label className="text-sm font-medium text-gray-400">Updated At</label>
                <p className="mt-1">{format(new Date(coupon.updatedAt), "MMM dd, yyyy HH:mm")}</p>
              </div>
            )}
          </div>

          {coupon.description && (
            <div>
              <label className="text-sm font-medium text-gray-400">Description</label>
              <p className="mt-1 text-gray-300">{coupon.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

