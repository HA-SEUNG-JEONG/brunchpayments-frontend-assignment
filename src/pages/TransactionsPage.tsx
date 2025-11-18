import { useEffect, useState, useRef, useCallback } from "react";
import type { PaymentTransaction } from "@/lib/types";
import { StatsCards } from "@/components/StatsCards";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  formatDate,
  formatAmount,
  getStatusColor,
  getPayTypeLabel,
  cn
} from "@/lib/utils";
import { BASE_URL } from "@/lib/api";

export function TransactionsPage() {
  const [data, setData] = useState<PaymentTransaction[]>([]);
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState<PaymentTransaction[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 20;
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/payments/list`);

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const { data } = await response.json();
        setData(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "거래 내역을 불러오는데 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isMobile) {
      setDisplayedItems(data.slice(0, currentPage * itemsPerPage));
    } else {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      setDisplayedItems(data.slice(start, end));
    }
  }, [data, currentPage, isMobile]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && isMobile && !isLoading) {
        setCurrentPage((prev) => prev + 1);
      }
    },
    [isMobile, isLoading]
  );

  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1
    });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleObserver, isMobile]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <TableSkeleton rowCount={4} />
        </div>
      );
    }

    if (error) {
      return <ErrorDisplay error={error} />;
    }

    return (
      <>
        <StatsCards data={data} />

        <div className="rounded-xl border-2 border-gray-200 bg-white shadow-xl">
          <div className="border-b-2 border-gray-200 bg-linear-to-r from-blue-500 to-purple-500 px-6 py-4 text-black">
            <h2 className="text-lg font-bold text-white">거래 내역</h2>
            <p className="mt-1 text-sm text-blue-100">
              총 {data.length.toLocaleString("ko-KR")}건의 거래 내역
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="font-bold text-gray-900">
                  결제코드
                </TableHead>
                <TableHead className="font-bold text-gray-900">
                  가맹점코드
                </TableHead>
                <TableHead className="font-bold text-gray-900">금액</TableHead>
                <TableHead className="font-bold text-gray-900">통화</TableHead>
                <TableHead className="font-bold text-gray-900">
                  결제수단
                </TableHead>
                <TableHead className="font-bold text-gray-900">상태</TableHead>
                <TableHead className="font-bold text-gray-900">
                  결제일시
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
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
                      {formatAmount(item.amount, item.currency)}
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      {item.currency}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {getPayTypeLabel(item.payType)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
                          getStatusColor(item.status)
                        )}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(item.paymentAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!isMobile && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border-2 border-blue-500 bg-blue-500 px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-blue-600 hover:shadow-lg disabled:border-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <div className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2.5">
              <span className="text-sm font-bold text-gray-900">
                {currentPage}
              </span>
              <span className="text-sm text-gray-600">/</span>
              <span className="text-sm font-bold text-gray-600">
                {totalPages}
              </span>
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border-2 border-blue-500 bg-blue-500 px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-blue-600 hover:shadow-lg disabled:border-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}

        {isMobile && displayedItems.length < data.length && (
          <div
            ref={observerTarget}
            className="flex items-center justify-center gap-2 py-6 text-center"
          >
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <div className="text-sm font-medium text-gray-600">
              더 불러오는 중...
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
          거래내역 대시보드
        </h1>
        <p className="mb-8 text-gray-600">
          결제 거래 내역을 확인하고 관리할 수 있습니다.
        </p>

        {renderContent()}
      </div>
    </div>
  );
}
