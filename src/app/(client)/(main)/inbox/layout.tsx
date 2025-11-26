import ConversationLayout from "@/modules/client/conversation/ui/layouts/conversation-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <ConversationLayout>{children}</ConversationLayout>;
};

export default Layout;
