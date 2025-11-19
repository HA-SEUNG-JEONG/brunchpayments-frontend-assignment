import { useEffect, useState, useMemo } from "react";
import { Table } from "@/components/ui/table";
import { SearchInput } from "@/components/SearchInput";
import { FilterResultDisplay } from "@/components/FilterResultDisplay";
import { MerchantDetailModal } from "@/components/MerchantDetailModal";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { TableSkeleton } from "@/components/TableSkeleton";
import { MerchantStatusFilter } from "@/components/MerchantStatusFilter";
import { BizTypeFilter } from "@/components/BizTypeFilter";
import { MerchantsTableHeader } from "@/components/MerchantsTableHeader";
import { MerchantsTableBody } from "@/components/MerchantsTableBody";
import { useFilteredData } from "@/hooks/useFilteredData";
import { useDebounce } from "@/hooks/useDebounce";
import type { Merchant, CommonCode } from "@/lib/types";
import { BASE_URL, fetchMerchantStatusCodes } from "@/lib/api";

export function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMchtCode, setSelectedMchtCode] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 공통 코드 상태
  const [merchantStatusCodes, setMerchantStatusCodes] = useState<CommonCode[]>(
    []
  );

  // 검색 및 필터 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [bizTypeFilter, setBizTypeFilter] = useState("");

  // 검색어 디바운스 (300ms 지연)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 공통 코드 로드
  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        const statusCodes = await fetchMerchantStatusCodes();
        setMerchantStatusCodes(statusCodes);
      } catch (error) {
        console.error("가맹점 상태 코드를 불러오는데 실패했습니다.:", error);
      }
    };
    loadCommonCodes();
  }, []);

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

  // 검색 및 필터링 로직 - 커스텀 훅 사용
  const filteredMerchants = useFilteredData(
    merchants,
    debouncedSearchQuery,
    ["mchtCode", "mchtName"],
    [
      { field: "status", value: statusFilter },
      { field: "bizType", value: bizTypeFilter }
    ]
  );

  const handleRowClick = (mchtCode: string) => {
    setSelectedMchtCode(mchtCode);
    setModalOpen(true);
  };

  // 고유한 값들 추출 (필터 옵션용) - 데이터 로딩 후 불변이므로 useMemo 사용
  const uniqueStatuses = useMemo(
    () => Array.from(new Set(merchants.map((m) => m.status))),
    [merchants]
  );
  const uniqueBizTypes = useMemo(
    () => Array.from(new Set(merchants.map((m) => m.bizType))),
    [merchants]
  );

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setBizTypeFilter("");
  };

  const renderContent = () => {
    if (isLoading) {
      return <TableSkeleton rowCount={4} />;
    }

    if (error) {
      return <ErrorDisplay error={error} />;
    }

    return (
      <>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 검색 입력 */}
                <SearchInput
                  id="merchant-search"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="가맹점 코드 또는 가맹점명"
                />

                {/* 가맹점 상태 필터 */}
                <MerchantStatusFilter
                  value={statusFilter}
                  onChange={setStatusFilter}
                  statuses={uniqueStatuses}
                  merchantStatusCodes={merchantStatusCodes}
                />

                {/* 업종 필터 */}
                <BizTypeFilter
                  value={bizTypeFilter}
                  onChange={setBizTypeFilter}
                  bizTypes={uniqueBizTypes}
                />
              </div>

              {/* 필터 결과 표시 */}
              <FilterResultDisplay
                totalCount={merchants.length}
                filteredCount={filteredMerchants.length}
                unit="개"
              />
            </div>
          </form>
        </section>

        <section
          className="rounded-xl border-2 border-gray-200 bg-white shadow-xl"
          aria-label="가맹점 목록 테이블"
        >
          <header className="border-b-2 border-gray-200 px-6 py-4">
            <h2 className="text-lg font-bold text-black">가맹점 목록</h2>
            <p className="mt-1 text-sm text-black">
              총 {filteredMerchants.length.toLocaleString("ko-KR")}개의 가맹점
            </p>
          </header>
          <Table>
            <MerchantsTableHeader />
            <MerchantsTableBody
              merchants={filteredMerchants}
              merchantStatusCodes={merchantStatusCodes}
              onRowClick={handleRowClick}
              totalCount={merchants.length}
            />
          </Table>
        </section>
      </>
    );
  };

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
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
    </main>
  );
}
