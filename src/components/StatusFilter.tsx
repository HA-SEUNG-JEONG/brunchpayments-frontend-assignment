import type { CommonCode } from "@/lib/types";
import { getCodeLabel } from "@/lib/utils";

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  statuses: string[];
  paymentStatusCodes: CommonCode[];
}

export function StatusFilter({
  value,
  onChange,
  statuses,
  paymentStatusCodes
}: StatusFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="transaction-status-filter"
        className="text-sm font-medium text-gray-700"
      >
        결제 상태
      </label>
      <select
        id="transaction-status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">전체</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {getCodeLabel(status, paymentStatusCodes)}
          </option>
        ))}
      </select>
    </div>
  );
}
