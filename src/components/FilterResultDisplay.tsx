interface FilterResultDisplayProps {
  totalCount: number;
  filteredCount: number;
}

export function FilterResultDisplay({
  totalCount,
  filteredCount
}: FilterResultDisplayProps) {
  if (filteredCount === totalCount) {
    return null;
  }

  return (
    <div className="text-base text-gray-600">
      <span>
        전체 {totalCount.toLocaleString("ko-KR")}건 중{" "}
        <span className="font-bold text-blue-600">
          {filteredCount.toLocaleString("ko-KR")}건
        </span>{" "}
        표시
      </span>
    </div>
  );
}

