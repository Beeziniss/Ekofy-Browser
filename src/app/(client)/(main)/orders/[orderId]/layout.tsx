import OrderLayout from "@/modules/client/order/ui/layouts/order-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <OrderLayout>{children}</OrderLayout>;
};

export default Layout;
