import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="rounded-xl border-2 border-red-200 bg-red-50 p-8 text-center">
      <p className="text-red-600 font-medium">{error}</p>
      <Button
        onClick={handleRetry}
        className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 cursor-pointer"
      >
        다시 시도
      </Button>
    </div>
  );
}
