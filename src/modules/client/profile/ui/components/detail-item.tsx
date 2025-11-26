interface DetailItemProps {
  title: string;
  value: string | number;
}

const DetailItem = ({ title, value }: DetailItemProps) => {
  return (
    <div className="mb-6">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
        <div className="w-full md:w-1/3">
          <label className="text-main-white text-base font-semibold">{title}</label>
        </div>
        <div className="w-full md:flex-1">
          <p className="text-main-white relative w-full rounded-md border border-white/30 bg-[#1A1A1A] px-4 py-3 text-sm shadow-md">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailItem;
