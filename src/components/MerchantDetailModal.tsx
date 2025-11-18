import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

import {
  formatDate,
  getMerchantStatusColor,
  getBizTypeLabel
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { MerchantDetail } from "@/lib/types";
import DetailField from "./DetailField";
import { BASE_URL } from "@/lib/api";

interface MerchantDetailModalProps {
  mchtCode: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MerchantDetailModal({
  mchtCode,
  open,
  onOpenChange
}: MerchantDetailModalProps) {
  const [merchant, setMerchant] = useState<MerchantDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mchtCode || !open) {
      setMerchant(null);
      setError(null);
      return;
    }

    const fetchMerchantDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}/merchants/details/${mchtCode}`
        );

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const { data } = await response.json();
        setMerchant(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "가맹점 정보를 불러오는데 실패했습니다."
        );
        setMerchant(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantDetail();
  }, [mchtCode, open]);

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-8 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      );
    }

    if (!merchant) {
      return (
        <div className="py-8 text-center text-gray-500">
          가맹점 정보를 불러올 수 없습니다.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <DetailField label="가맹점 코드">
          <p className="text-base font-mono text-gray-900">
            {merchant.mchtCode}
          </p>
        </DetailField>

        <DetailField label="가맹점명">
          <p className="text-base font-semibold text-gray-900">
            {merchant.mchtName}
          </p>
        </DetailField>

        <DetailField label="상태">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${getMerchantStatusColor(
              merchant.status
            )}`}
          >
            {merchant.status}
          </span>
        </DetailField>

        <DetailField label="업종">
          <p className="text-base text-gray-900">
            {getBizTypeLabel(merchant.bizType)}
          </p>
        </DetailField>

        <DetailField label="사업자등록번호">
          <p className="text-base font-mono text-gray-900">{merchant.bizNo}</p>
        </DetailField>

        <DetailField label="주소">
          <p className="text-base text-gray-900">{merchant.address}</p>
        </DetailField>

        <DetailField label="전화번호">
          <p className="text-base text-gray-900">{merchant.phone}</p>
        </DetailField>

        <DetailField label="이메일">
          <p className="text-base text-gray-900">{merchant.email}</p>
        </DetailField>

        <DetailField label="등록일시">
          <p className="text-base text-gray-900">
            {formatDate(merchant.registeredAt)}
          </p>
        </DetailField>

        <DetailField label="수정일시">
          <p className="text-base text-gray-900">
            {formatDate(merchant.updatedAt)}
          </p>
        </DetailField>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>가맹점 상세 정보</DialogTitle>
          <DialogDescription>
            가맹점의 상세 정보를 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">{renderModalContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
