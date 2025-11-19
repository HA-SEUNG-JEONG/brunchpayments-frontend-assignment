import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "검색어를 입력하세요"
}: SearchInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="transaction-search"
        className="text-sm font-medium text-gray-700"
      >
        검색
      </label>
      <Input
        id="transaction-search"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
}

