import type { BizType } from "@/lib/types";
import { getBizTypeLabel } from "@/lib/utils";

interface BizTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
  bizTypes: BizType[];
}

export function BizTypeFilter({
  value,
  onChange,
  bizTypes
}: BizTypeFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="merchant-biztype-filter"
        className="text-sm font-medium text-gray-700"
      >
        업종
      </label>
      <select
        id="merchant-biztype-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">전체</option>
        {bizTypes.map((bizType) => (
          <option key={bizType} value={bizType}>
            {getBizTypeLabel(bizType)}
          </option>
        ))}
      </select>
    </div>
  );
}
