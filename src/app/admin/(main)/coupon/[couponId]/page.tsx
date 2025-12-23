import { CouponDetailView } from "@/modules/admin/coupon/ui/views/coupon-detail-view";

interface CouponDetailPageProps {
  params: Promise<{
    couponId: string;
  }>;
}
export default async function CouponDetailPage({ params }: CouponDetailPageProps) {
  const { couponId } = await params;
  return <CouponDetailView couponId={couponId} />;
}

