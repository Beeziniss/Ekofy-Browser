import { CouponDetailView } from "@/modules/admin/coupon/ui/views/coupon-detail-view";

interface CouponDetailPageProps {
  params: {
    couponId: string;
  };
}

export default function CouponDetailPage({ params }: CouponDetailPageProps) {
  return <CouponDetailView couponId={params.couponId} />;
}

