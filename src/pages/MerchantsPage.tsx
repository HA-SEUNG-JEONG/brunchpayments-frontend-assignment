import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MerchantDetailModal } from "@/components/MerchantDetailModal";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { TableSkeleton } from "@/components/TableSkeleton";
import {
  cn,
  getMerchantStatusColor,
  getBizTypeLabel,
  getBizTypeColor,
  getCodeLabel
} from "@/lib/utils";
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
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="merchant-search"
                    className="text-sm font-medium text-gray-700"
                  >
                    검색
                  </label>
                  <Input
                    id="merchant-search"
                    type="text"
                    placeholder="가맹점 코드 또는 가맹점명"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* 가맹점 상태 필터 */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="merchant-status-filter"
                    className="text-sm font-medium text-gray-700"
                  >
                    가맹점 상태
                  </label>
                  <select
                    id="merchant-status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">전체</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {getCodeLabel(status, merchantStatusCodes)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 업종 필터 */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="merchant-biztype-filter"
                    className="text-sm font-medium text-gray-700"
                  >
                    업종
                  </label>
                  <select
                    id="merchant-biztype-filter"
                    value={bizTypeFilter}
                    onChange={(e) => setBizTypeFilter(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">전체</option>
                    {uniqueBizTypes.map((bizType) => (
                      <option key={bizType} value={bizType}>
                        {getBizTypeLabel(bizType)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 필터 결과 표시 */}
              <div className="text-base text-gray-600">
                {filteredMerchants.length !== merchants.length && (
                  <span>
                    전체 {merchants.length.toLocaleString("ko-KR")}개 중{" "}
                    <span className="font-bold text-blue-600">
                      {filteredMerchants.length.toLocaleString("ko-KR")}개
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
          aria-label="가맹점 목록 테이블"
        >
          <header className="border-b-2 border-gray-200 bg-linear-to-r from-blue-500 to-purple-500 px-6 py-4">
            <h2 className="text-lg font-bold text-white">가맹점 목록</h2>
            <p className="mt-1 text-sm text-blue-100">
              총 {filteredMerchants.length.toLocaleString("ko-KR")}개의 가맹점
            </p>
          </header>
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
              {filteredMerchants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-12 text-base text-gray-600"
                  >
                    {merchants.length === 0
                      ? "가맹점이 없습니다."
                      : "검색 결과가 없습니다."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMerchants.map((merchant) => (
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
          </Table>
        </section>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
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
