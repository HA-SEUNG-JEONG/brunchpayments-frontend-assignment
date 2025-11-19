import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import type { PaymentTransaction, CommonCode } from "@/lib/types";
import { StatsCards } from "@/components/StatsCards";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFilteredData } from "@/hooks/useFilteredData";
import { useDebounce } from "@/hooks/useDebounce";
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
  getCodeLabel,
  getPayTypeColor,
  getPayTypeLabel,
  cn
} from "@/lib/utils";
import { BASE_URL, fetchPaymentStatusCodes } from "@/lib/api";

export function TransactionsPage() {
  const [data, setData] = useState<PaymentTransaction[]>([]);
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 20;
  const observerTarget = useRef<HTMLDivElement>(null);

  // 공통 코드 상태
  const [paymentStatusCodes, setPaymentStatusCodes] = useState<CommonCode[]>(
    []
  );

  // 검색 및 필터 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payTypeFilter, setPayTypeFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 공통 코드 로드
  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        const statusCodes = await fetchPaymentStatusCodes();
        setPaymentStatusCodes(statusCodes);
      } catch (error) {
        console.error("결제 상태 코드를 불러오는데 실패했습니다.:", error);
      }
    };
    loadCommonCodes();
  }, []);

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

  // 필터링 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter, payTypeFilter, currencyFilter]);

  // 검색 및 필터링 로직 - 커스텀 훅 사용
  const filteredData = useFilteredData(
    data,
    debouncedSearchQuery,
    ["mchtCode", "paymentCode"],
    [
      { field: "status", value: statusFilter },
      { field: "payType", value: payTypeFilter },
      { field: "currency", value: currencyFilter }
    ]
  );

  // 현재 페이지에 표시할 항목 계산
  const displayedItems = isMobile
    ? filteredData.slice(0, currentPage * itemsPerPage)
    : filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 고유한 값들 추출 (필터 옵션용) - 데이터 로딩 후 불변이므로 useMemo 사용
  const uniqueStatuses = useMemo(
    () => Array.from(new Set(data.map((item) => item.status))),
    [data]
  );
  const uniquePayTypes = useMemo(
    () => Array.from(new Set(data.map((item) => item.payType))),
    [data]
  );
  const uniqueCurrencies = useMemo(
    () => Array.from(new Set(data.map((item) => item.currency))),
    [data]
  );

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPayTypeFilter("");
    setCurrencyFilter("");
  };

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
        <section aria-label="거래 통계">
          <StatsCards data={data} />
        </section>

        {/* 검색 및 필터 섹션 */}
        <section
          className="rounded-xl border-2 border-gray-200 bg-white shadow-xl p-6 mb-6"
          aria-label="검색 및 필터"
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  검색 및 필터
                </h2>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  초기화
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 검색 입력 */}
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
                    placeholder="가맹점 코드 또는 결제 코드"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* 결제 상태 필터 */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="transaction-status-filter"
                    className="text-sm font-medium text-gray-700"
                  >
                    결제 상태
                  </label>
                  <select
                    id="transaction-status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">전체</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {getCodeLabel(status, paymentStatusCodes)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 결제 수단 필터 */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="transaction-paytype-filter"
                    className="text-sm font-medium text-gray-700"
                  >
                    결제 수단
                  </label>
                  <select
                    id="transaction-paytype-filter"
                    value={payTypeFilter}
                    onChange={(e) => setPayTypeFilter(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">전체</option>
                    {uniquePayTypes.map((payType) => (
                      <option key={payType} value={payType}>
                        {getPayTypeLabel(payType)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 통화 필터 */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="transaction-currency-filter"
                    className="text-sm font-medium text-gray-700"
                  >
                    통화
                  </label>
                  <select
                    id="transaction-currency-filter"
                    value={currencyFilter}
                    onChange={(e) => setCurrencyFilter(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">전체</option>
                    {uniqueCurrencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 필터 결과 표시 */}
              <div className="text-base text-gray-600">
                {filteredData.length !== data.length && (
                  <span>
                    전체 {data.length.toLocaleString("ko-KR")}건 중{" "}
                    <span className="font-bold text-blue-600">
                      {filteredData.length.toLocaleString("ko-KR")}건
                    </span>{" "}
                    표시
                  </span>
                )}
              </div>
            </div>
          </form>
        </section>

        <section
          className="rounded-xl border-2 border-gray-200 bg-white shadow-xl"
          aria-label="거래 내역 테이블"
        >
          <header className="border-b-2 border-gray-200 bg-linear-to-r from-blue-500 to-purple-500 px-6 py-4 text-black">
            <h2 className="text-lg font-bold text-white">거래 내역</h2>
            <p className="mt-1 text-sm text-blue-100">
              총 {filteredData.length.toLocaleString("ko-KR")}건의 거래 내역
            </p>
          </header>
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
                      {formatAmount(item.amount, item.currency)}
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
          </Table>
        </section>

        {!isMobile && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg bg-white border-2 border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-gray-300"
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
              className="rounded-lg bg-white border-2 border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50 hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-gray-300"
            >
              다음
            </button>
          </div>
        )}

        {isMobile && displayedItems.length < filteredData.length && (
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
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
          거래내역 대시보드
        </h1>
        <p className="mb-8 text-gray-600">
          결제 거래 내역을 확인하고 관리할 수 있습니다.
        </p>

        {renderContent()}
      </div>
    </main>
  );
}
