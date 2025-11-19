import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CommonCode } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCodeLabel(code: string, codeList: CommonCode[]): string {
  const found = codeList.find((c) => c.code === code);
  return found?.description || code;
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
  return `${formatted}`;
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

export function getBizTypeColor(bizType: string): string {
  switch (bizType) {
    case "CAFE":
      return "bg-amber-100 text-amber-800";
    case "SHOP":
      return "bg-pink-100 text-pink-800";
    case "MART":
      return "bg-cyan-100 text-cyan-800";
    case "APP":
      return "bg-indigo-100 text-indigo-800";
    case "TRAVEL":
      return "bg-sky-100 text-sky-800";
    case "EDU":
      return "bg-violet-100 text-violet-800";
    case "TEST":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getPayTypeLabel(payType: string): string {
  const labels: Record<string, string> = {
    ONLINE: "온라인",
    DEVICE: "단말기",
    MOBILE: "모바일",
    VACT: "가상계좌",
    BILLING: "정기결제"
  };
  return labels[payType] || payType;
}

export function getPayTypeColor(payType: string): string {
  switch (payType) {
    case "DEVICE":
      return "bg-blue-500 text-white";
    case "MOBILE":
      return "bg-purple-500 text-white";
    case "ONLINE":
      return "bg-green-500 text-white";
    case "BILLING":
      return "bg-orange-500 text-white";
    case "VACT":
      return "bg-teal-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}
