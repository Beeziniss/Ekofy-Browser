"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { orderPackageDetailOptions } from "@/gql/options/client-options";

interface OrderSubmissionSectionProps {
  orderId: string;
}

const OrderSubmissionSection = ({ orderId }: OrderSubmissionSectionProps) => {
  const { data: orderPackageDetail } = useSuspenseQuery(orderPackageDetailOptions(orderId));

  console.log(orderPackageDetail);

  return (
    <div className="bg-main-grey-1 flex flex-col rounded-md p-4">
      <h3 className="text-xl font-semibold">Order Submission</h3>
    </div>
  );
};

export default OrderSubmissionSection;
