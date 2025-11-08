import DetailItem from "../components/detail-item";

interface AccountDetailSectionProps {
  account: {
    readonly createdAt: string | undefined;
    readonly membershipStatus: string;
  };
}

const AccountDetailSection = ({ account }: AccountDetailSectionProps) => {
  const detailField = [
    { title: "Created date", value: account.createdAt || "-" },
    { title: "Membership status", value: account.membershipStatus || "-" },
  ];
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-x-3">
        <h2 className="text-xl font-bold">Account Details</h2>
      </div>
      <div className="mt-6 md:mt-12 md:mb-12">
        {detailField.map((item) => (
          <DetailItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
};

export default AccountDetailSection;
