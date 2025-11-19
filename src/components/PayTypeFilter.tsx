import { getPayTypeLabel } from "@/lib/utils";
import type { PayType } from "@/lib/types";

interface PayTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
  payTypes: PayType[];
}

export function PayTypeFilter({
  value,
  onChange,
  payTypes
}: PayTypeFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="transaction-paytype-filter"
        className="text-sm font-medium text-gray-700"
      >
        결제 수단
      </label>
      <select
        id="transaction-paytype-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">전체</option>
        {payTypes.map((payType) => (
          <option key={payType} value={payType}>
            {getPayTypeLabel(payType)}
          </option>
        ))}
      </select>
    </div>
  );
}
