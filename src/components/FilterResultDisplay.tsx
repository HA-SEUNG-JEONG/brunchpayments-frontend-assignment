interface FilterResultDisplayProps {
  totalCount: number;
  filteredCount: number;
  unit?: string;
}

export function FilterResultDisplay({
  totalCount,
  filteredCount,
  unit = "건"
}: FilterResultDisplayProps) {
  if (filteredCount === totalCount) {
    return null;
  }

  return (
    <div className="text-base text-gray-600">
      <span>
        전체 {totalCount.toLocaleString("ko-KR")}
        {unit} 중{" "}
        <span className="font-bold text-blue-600">
          {filteredCount.toLocaleString("ko-KR")}
        </span>
        {unit}
      </span>
    </div>
  );
}
