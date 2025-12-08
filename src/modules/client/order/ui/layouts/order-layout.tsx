"use client";

import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OrderNavigationMenu from "../components/order-navigation-menu";
import OrderDetailInfoSection from "../sections/order-detail-info-section";

interface OrderLayoutProps {
  children: React.ReactNode;
}

const OrderLayout = ({ children }: OrderLayoutProps) => {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/unauthorized");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }
  return (
    <div className="container mx-auto w-full px-6 pt-8 pb-10">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <div className="flex flex-col gap-y-3">
            <OrderNavigationMenu />
            <div>{children}</div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="sticky top-20 shadow">
            <OrderDetailInfoSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderLayout;
