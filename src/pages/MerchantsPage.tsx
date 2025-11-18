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
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { TableSkeleton } from "@/components/TableSkeleton";
import { cn, getMerchantStatusColor, getBizTypeLabel } from "@/lib/utils";
import type { Merchant } from "@/lib/types";
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

  const renderContent = () => {
    if (isLoading) {
      return <TableSkeleton rowCount={4} />;
    }

    if (error) {
      return <ErrorDisplay error={error} />;
    }

    return (
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
              <TableHead className="font-bold text-gray-900">상태</TableHead>
              <TableHead className="font-bold text-gray-900">업종</TableHead>
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
    );
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

        {renderContent()}
      </div>

      <MerchantDetailModal
        mchtCode={selectedMchtCode}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
