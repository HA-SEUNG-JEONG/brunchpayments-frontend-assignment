interface DetailFieldProps {
  label: string;
  children: React.ReactNode;
}

export const DetailField = ({ label, children }: DetailFieldProps) => {
  return (
    <>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">{children}</div>
    </>
  );
};
