interface CurrencyFilterProps {
  value: string;
  onChange: (value: string) => void;
  currencies: string[];
}

export function CurrencyFilter({
  value,
  onChange,
  currencies
}: CurrencyFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="transaction-currency-filter"
        className="text-sm font-medium text-gray-700"
      >
        통화
      </label>
      <select
        id="transaction-currency-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">전체</option>
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}

