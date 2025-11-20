import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import type { PaymentTransaction, CommonCode } from "@/lib/types";
import { StatsCards } from "@/components/StatsCards";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { TableSkeleton } from "@/components/TableSkeleton";
import { StatusFilter } from "@/components/StatusFilter";
import { PayTypeFilter } from "@/components/PayTypeFilter";
import { CurrencyFilter } from "@/components/CurrencyFilter";
import { FilterResultDisplay } from "@/components/FilterResultDisplay";
import { SearchInput } from "@/components/SearchInput";
import { TransactionsTableHeader } from "@/components/TransactionsTableHeader";
import { TransactionsTableBody } from "@/components/TransactionsTableBody";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useFilteredData } from "@/hooks/useFilteredData";
import { useDebounce } from "@/hooks/useDebounce";
import { Table } from "@/components/ui/table";
import {
  fetchPaymentStatusCodes,
  fetchPaymentTypeCodes,
  fetchPaymentsList
} from "@/lib/api";

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
  const [paymentTypeCodes, setPaymentTypeCodes] = useState<CommonCode[]>([]);

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
        const [statusCodes, typeCodes] = await Promise.all([
          fetchPaymentStatusCodes(),
          fetchPaymentTypeCodes()
        ]);
        setPaymentStatusCodes(statusCodes);
        setPaymentTypeCodes(typeCodes);
      } catch (error) {
        console.error("공통 코드를 불러오는데 실패했습니다.:", error);
      }
    };
    loadCommonCodes();
  }, []);

  useEffect(() => {
    const loadPaymentsList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPaymentsList();
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
    loadPaymentsList();
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

  // 고유한 값들 추출 (필터 옵션용)
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 검색 입력 */}
                <SearchInput
                  id="transaction-search"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="가맹점 코드 또는 결제 코드"
                />

                {/* 결제 상태 필터 */}
                <StatusFilter
                  value={statusFilter}
                  onChange={setStatusFilter}
                  statuses={uniqueStatuses}
                  paymentStatusCodes={paymentStatusCodes}
                />

                {/* 결제 수단 필터 */}
                <PayTypeFilter
                  value={payTypeFilter}
                  onChange={setPayTypeFilter}
                  payTypes={uniquePayTypes}
                  paymentTypeCodes={paymentTypeCodes}
                />

                {/* 통화 필터 */}
                <CurrencyFilter
                  value={currencyFilter}
                  onChange={setCurrencyFilter}
                  currencies={uniqueCurrencies}
                />
              </div>

              {/* 필터 결과 표시 */}
              <FilterResultDisplay
                totalCount={data.length}
                filteredCount={filteredData.length}
              />
            </div>
          </form>
        </section>

        <section
          className="rounded-xl border-2 border-gray-200 bg-white shadow-xl"
          aria-label="거래 내역 테이블"
        >
          <header className="border-b-2 border-gray-200 px-6 py-4 text-black">
            <h2 className="text-lg font-bold text-black">거래 내역</h2>
            <p className="mt-1 text-sm text-black">
              총 {filteredData.length.toLocaleString("ko-KR")}건의 거래 내역
            </p>
          </header>
          <Table>
            <TransactionsTableHeader />
            <TransactionsTableBody
              displayedItems={displayedItems}
              paymentStatusCodes={paymentStatusCodes}
            />
          </Table>
        </section>

        {!isMobile && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
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
