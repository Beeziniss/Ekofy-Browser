"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { orderPackageDetailOptions } from "@/gql/options/client-options";
import { formatDate } from "date-fns";
import { formatCurrency } from "@/utils/format-currency";
import { Card, CardContent } from "@/components/ui/card";

interface OrderDetailSectionProps {
  orderId: string;
}

const OrderDetailSection = ({ orderId }: OrderDetailSectionProps) => {
  const { data: orderPackageDetail } = useSuspenseQuery(orderPackageDetailOptions(orderId));

  const orderPackageData = orderPackageDetail?.package[0];

  return (
    <div className="flex flex-col gap-y-4">
      <Card>
        <CardContent className="flex flex-col gap-y-3 rounded-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-main-purple text-2xl font-semibold">{orderPackageData?.packageName}</h3>
              <div className="mt-2 flex items-center gap-x-3">
                <div className="text-muted-foreground text-sm font-stretch-normal">
                  Order by <strong className="text-main-white">{orderPackageDetail?.client?.[0].displayName}</strong>
                </div>
                <div className="text-muted-foreground text-sm">
                  Date ordered {formatDate(new Date(orderPackageDetail?.createdAt || ""), "MMM dd, yyyy")}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-y-2">
              <div className="text-sm font-normal">Total price</div>
              <div className="text-main-purple text-xl font-semibold">{formatCurrency(orderPackageData?.amount)}</div>
            </div>
          </div>

          <div className="text-base">
            <span className="font-semibold">Duration:</span> {orderPackageData?.estimateDeliveryDays} day
            {orderPackageData?.estimateDeliveryDays !== 1 ? "s" : ""}
          </div>

          <div className="text-base">
            <div className="font-semibold">Package features</div>
            <ul className="flex list-disc flex-col pl-5">
              {orderPackageData?.serviceDetails?.map((detail, index) => (
                <li key={index} className="text-main-white/90 text-sm">
                  {detail.value}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="rounded-md">
          <h3 className="text-xl font-semibold">Requirements</h3>
          <div
            className="text-main-white/90 mt-2 text-sm whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: orderPackageDetail?.requirements || "No specific requirements provided.",
            }}
          ></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailSection;
