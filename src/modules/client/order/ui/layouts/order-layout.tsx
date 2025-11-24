import OrderNavigationMenu from "../components/order-navigation-menu";
import OrderDetailInfoSection from "../sections/order-detail-info-section";

interface OrderLayoutProps {
  children: React.ReactNode;
}

const OrderLayout = ({ children }: OrderLayoutProps) => {
  return (
    <div className="container mx-auto w-full px-6 pt-8 pb-10">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9 flex flex-col gap-y-3">
          <OrderNavigationMenu />
          <div>{children}</div>
        </div>
        <div className="col-span-3">
          <OrderDetailInfoSection />
        </div>
      </div>
    </div>
  );
};

export default OrderLayout;
