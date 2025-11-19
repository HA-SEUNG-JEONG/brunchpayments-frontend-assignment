import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="rounded-xl border-2 border-red-200 bg-red-50 p-8 text-center">
      <p className="text-base text-red-600 font-medium">
        {error || "데이터를 불러올 수 없습니다. 다시 시도해 주세요."}
      </p>
      <Button
        onClick={handleRetry}
        className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 cursor-pointer"
      >
        다시 시도
      </Button>
    </div>
  );
};
