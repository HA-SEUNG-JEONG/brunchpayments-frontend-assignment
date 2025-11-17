interface DetailFieldProps {
  label: string;
  children: React.ReactNode;
}

const DetailField = ({ label, children }: DetailFieldProps) => {
  return (
    <>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <div className="mt-1">{children}</div>
    </>
  );
};

export default DetailField;
