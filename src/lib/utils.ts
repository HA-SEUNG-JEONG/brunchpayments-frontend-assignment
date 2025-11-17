import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatAmount(amount: string, currency: string): string {
  const numAmount = Number(amount);
  if (isNaN(numAmount)) return `${amount} ${currency}`;
  const formatted = new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
  return `${formatted} ${currency}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "SUCCESS":
      return "bg-green-500 text-white";
    case "FAILED":
      return "bg-red-500 text-white";
    case "CANCELLED":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
}

export function getMerchantStatusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "INACTIVE":
      return "bg-gray-100 text-gray-800";
    case "READY":
      return "bg-yellow-100 text-yellow-800";
    case "CLOSED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getBizTypeLabel(bizType: string): string {
  const labels: Record<string, string> = {
    CAFE: "카페",
    SHOP: "쇼핑몰",
    MART: "마트",
    APP: "앱",
    TRAVEL: "여행",
    EDU: "교육",
    TEST: "테스트"
  };
  return labels[bizType] || bizType;
}

export function getPayTypeLabel(payType: string): string {
  const labels: Record<string, string> = {
    DEVICE: "단말기",
    MOBILE: "모바일",
    ONLINE: "온라인",
    BILLING: "자동결제",
    VACT: "가상계좌"
  };
  return labels[payType] || payType;
}
