interface PageProps {
  params: Promise<{ orderId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { orderId } = await params;
  return <div>Page {orderId}</div>;
};

export default Page;
