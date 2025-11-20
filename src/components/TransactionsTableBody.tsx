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
        displayedItems.map((displayedItem) => (
          <TableRow key={displayedItem.paymentCode}>
            <TableCell className="font-mono text-sm text-gray-900">
              {displayedItem.paymentCode}
            </TableCell>
            <TableCell className="font-mono text-sm text-gray-900">
              {displayedItem.mchtCode}
            </TableCell>
            <TableCell className="font-bold text-gray-900">
              {formatAmount(displayedItem.amount)}
            </TableCell>
            <TableCell className="text-gray-900 font-medium">
              {displayedItem.currency}
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
                  getPayTypeColor(displayedItem.payType)
                )}
              >
                {getPayTypeLabel(displayedItem.payType)}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
                  getStatusColor(displayedItem.status)
                )}
              >
                {getCodeLabel(displayedItem.status, paymentStatusCodes)}
              </span>
            </TableCell>
            <TableCell className="text-sm text-gray-900">
              {formatDate(displayedItem.paymentAt)}
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  );
}
