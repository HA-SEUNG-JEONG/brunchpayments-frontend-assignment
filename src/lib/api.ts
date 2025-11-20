import type { CommonCode } from "./types";

export const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

export async function fetchPaymentStatusCodes(): Promise<CommonCode[]> {
  const response = await fetch(`${BASE_URL}/common/payment-status/all`);
  if (!response.ok) {
    throw new Error(
      `결제 상태 코드를 불러오는데 실패했습니다.: ${response.status}`
    );
  }
  const { data } = await response.json();
  return data;
}

export async function fetchPaymentTypeCodes(): Promise<CommonCode[]> {
  const response = await fetch(`${BASE_URL}/common/paymemt-type/all`);
  if (!response.ok) {
    throw new Error(
      `결제 수단 코드를 불러오는데 실패했습니다.: ${response.status}`
    );
  }
  const { data } = await response.json();
  return data;
}

export async function fetchMerchantStatusCodes(): Promise<CommonCode[]> {
  const response = await fetch(`${BASE_URL}/common/mcht-status/all`);
  if (!response.ok) {
    throw new Error(
      `가맹점 상태 코드를 불러오는데 실패했습니다.: ${response.status}`
    );
  }
  const { data } = await response.json();
  return data;
}
