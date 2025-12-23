import { CouponLayout } from "../layouts/coupon-layout";
import { CouponDetailSection } from "../sections";

interface CouponDetailViewProps {
  couponId: string;
}

export function CouponDetailView({ couponId }: CouponDetailViewProps) {
  return (
    <CouponLayout title="Coupon Details" description="View coupon information">
      <CouponDetailSection couponId={couponId} />
    </CouponLayout>
  );
}

