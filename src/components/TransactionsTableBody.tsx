import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { PaymentTransaction, CommonCode } from "@/lib/types";
import {
  formatDate,
  formatAmount,
  getStatusColor,
  getCodeLabel,
  getPayTypeColor,
  getPayTypeLabel,
  cn
} from "@/lib/utils";

interface TransactionsTableBodyProps {
  displayedItems: PaymentTransaction[];
  paymentStatusCodes: CommonCode[];
}

export function TransactionsTableBody({
  displayedItems,
  paymentStatusCodes
}: TransactionsTableBodyProps) {
  return (
    <TableBody>
      {displayedItems.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={7}
            className="text-center py-12 text-base text-gray-600"
          >
            거래내역이 없습니다.
          </TableCell>
        </TableRow>
      ) : (
        displayedItems.map((item, index) => (
          <TableRow
            key={item.paymentCode}
            className={cn(
              "transition-colors",
              index % 2 === 0 ? "bg-white" : "bg-gray-50",
              "hover:bg-blue-50"
            )}
          >
            <TableCell className="font-mono text-sm text-gray-900">
              {item.paymentCode}
            </TableCell>
            <TableCell className="font-mono text-sm text-gray-900">
              {item.mchtCode}
            </TableCell>
            <TableCell className="font-bold text-gray-900">
              {formatAmount(item.amount)}
            </TableCell>
            <TableCell className="text-gray-900 font-medium">
              {item.currency}
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
                  getPayTypeColor(item.payType)
                )}
              >
                {getPayTypeLabel(item.payType)}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
                  getStatusColor(item.status)
                )}
              >
                {getCodeLabel(item.status, paymentStatusCodes)}
              </span>
            </TableCell>
            <TableCell className="text-sm text-gray-900">
              {formatDate(item.paymentAt)}
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  );
}

