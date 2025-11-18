import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rowCount?: number;
  showHeader?: boolean;
}

export function TableSkeleton({ rowCount = 4, showHeader = true }: TableSkeletonProps) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white shadow-xl p-8">
      <div className="space-y-4">
        {showHeader && <Skeleton className="h-8 w-48" />}
        <div className="space-y-3">
          {Array.from({ length: rowCount }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

