import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Merchant, CommonCode } from "@/lib/types";
import {
  cn,
  getMerchantStatusColor,
  getBizTypeLabel,
  getBizTypeColor,
  getCodeLabel
} from "@/lib/utils";

interface MerchantsTableBodyProps {
  merchants: Merchant[];
  merchantStatusCodes: CommonCode[];
  onRowClick: (mchtCode: string) => void;
  totalCount: number;
}

export function MerchantsTableBody({
  merchants,
  merchantStatusCodes,
  onRowClick,
  totalCount
}: MerchantsTableBodyProps) {
  return (
    <TableBody>
      {merchants.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={4}
            className="text-center py-12 text-base text-gray-600"
          >
            {totalCount === 0
              ? "가맹점이 없습니다."
              : "검색 결과가 없습니다."}
          </TableCell>
        </TableRow>
      ) : (
        merchants.map((merchant) => (
          <TableRow
            key={merchant.mchtCode}
            onClick={() => onRowClick(merchant.mchtCode)}
            className="transition-colors cursor-pointer"
          >
            <TableCell className="font-mono text-sm text-gray-900">
              {merchant.mchtCode}
            </TableCell>
            <TableCell className="font-semibold text-gray-900">
              {merchant.mchtName}
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
                  getMerchantStatusColor(merchant.status)
                )}
              >
                {getCodeLabel(merchant.status, merchantStatusCodes)}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
                  getBizTypeColor(merchant.bizType)
                )}
              >
                {getBizTypeLabel(merchant.bizType)}
              </span>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  );
}

