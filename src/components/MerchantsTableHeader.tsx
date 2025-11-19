import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MerchantsTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-gray-100 hover:bg-gray-100">
        <TableHead className="font-bold text-gray-900">
          가맹점 코드
        </TableHead>
        <TableHead className="font-bold text-gray-900">
          가맹점명
        </TableHead>
        <TableHead className="font-bold text-gray-900">상태</TableHead>
        <TableHead className="font-bold text-gray-900">업종</TableHead>
      </TableRow>
    </TableHeader>
  );
}

