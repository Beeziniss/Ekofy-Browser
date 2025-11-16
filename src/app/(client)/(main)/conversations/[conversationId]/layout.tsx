import ConversationDetailLayout from "@/modules/client/conversation/ui/layouts/conversation-detail-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <ConversationDetailLayout>{children}</ConversationDetailLayout>;
};

export default Layout;
