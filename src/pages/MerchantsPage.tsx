import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MerchantDetailModal } from "@/components/MerchantDetailModal";
import { cn, getMerchantStatusColor, getBizTypeLabel } from "@/lib/utils";
import type { Merchant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/api";

export function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMchtCode, setSelectedMchtCode] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchMerchants = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/merchants/list`);

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const { data } = await response.json();
        setMerchants(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "가맹점 목록을 불러오는데 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  const handleRowClick = (mchtCode: string) => {
    setSelectedMchtCode(mchtCode);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
          가맹점 조회
        </h1>
        <p className="mb-8 text-gray-600">
          등록된 가맹점 목록을 확인하고 상세 정보를 조회할 수 있습니다.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <div className="text-sm font-medium text-gray-600">
                데이터를 불러오는 중...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 cursor-pointer"
            >
              다시 시도
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-gray-200 bg-white shadow-xl">
            <div className="border-b-2 border-gray-200 bg-linear-to-r from-blue-500 to-purple-500 px-6 py-4">
              <h2 className="text-lg font-bold text-white">가맹점 목록</h2>
              <p className="mt-1 text-sm text-blue-100">
                총 {merchants.length.toLocaleString("ko-KR")}개의 가맹점
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                  <TableHead className="font-bold text-gray-900">
                    가맹점 코드
                  </TableHead>
                  <TableHead className="font-bold text-gray-900">
                    가맹점명
                  </TableHead>
                  <TableHead className="font-bold text-gray-900">
                    상태
                  </TableHead>
                  <TableHead className="font-bold text-gray-900">
                    업종
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchants.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-gray-500"
                    >
                      가맹점이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  merchants.map((merchant) => (
                    <TableRow
                      key={merchant.mchtCode}
                      onClick={() => handleRowClick(merchant.mchtCode)}
                      className={cn(
                        "transition-colors cursor-pointer",
                        merchant.mchtCode.charCodeAt(0) % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50",
                        "hover:bg-blue-50"
                      )}
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
                          {merchant.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {getBizTypeLabel(merchant.bizType)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <MerchantDetailModal
        mchtCode={selectedMchtCode}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
