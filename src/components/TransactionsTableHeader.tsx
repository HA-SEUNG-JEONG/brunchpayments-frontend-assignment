import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TransactionsTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-gray-100 hover:bg-gray-100">
        <TableHead className="font-bold text-gray-900">결제코드</TableHead>
        <TableHead className="font-bold text-gray-900">가맹점코드</TableHead>
        <TableHead className="font-bold text-gray-900">금액</TableHead>
        <TableHead className="font-bold text-gray-900">통화</TableHead>
        <TableHead className="font-bold text-gray-900">결제수단</TableHead>
        <TableHead className="font-bold text-gray-900">상태</TableHead>
        <TableHead className="font-bold text-gray-900">결제일시</TableHead>
      </TableRow>
    </TableHeader>
  );
}

