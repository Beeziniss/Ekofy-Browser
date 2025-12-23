import { CouponLayout } from "../layouts/coupon-layout";
import { CouponSection } from "../sections";

export function CouponView() {
  return (
    <CouponLayout title="Coupon Management" description="View and manage discount coupons">
      <CouponSection />
    </CouponLayout>
  );
}

