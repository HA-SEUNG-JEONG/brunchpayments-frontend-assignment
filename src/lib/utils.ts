import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  CommonCode,
  TransactionStatus,
  MerchantStatus,
  BizType,
  PayType
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TRANSACTION_STATUS_COLORS = {
  SUCCESS: "bg-green-500 text-white",
  FAILED: "bg-red-500 text-white",
  CANCELLED: "bg-gray-500 text-white"
};

const TRANSACTION_STATUS_DEFAULT_COLOR = "bg-gray-400 text-white";

const MERCHANT_STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  READY: "bg-yellow-100 text-yellow-800",
  CLOSED: "bg-red-100 text-red-800"
};

const MERCHANT_STATUS_DEFAULT_COLOR = "bg-gray-100 text-gray-800";

const BIZ_TYPE_LABELS = {
  CAFE: "카페",
  SHOP: "쇼핑몰",
  MART: "마트",
  APP: "앱",
  TRAVEL: "여행",
  EDU: "교육",
  TEST: "테스트"
};

const BIZ_TYPE_COLORS = {
  CAFE: "bg-amber-100 text-amber-800",
  SHOP: "bg-pink-100 text-pink-800",
  MART: "bg-cyan-100 text-cyan-800",
  APP: "bg-indigo-100 text-indigo-800",
  TRAVEL: "bg-sky-100 text-sky-800",
  EDU: "bg-violet-100 text-violet-800",
  TEST: "bg-slate-100 text-slate-800"
};

const BIZ_TYPE_DEFAULT_COLOR = "bg-gray-100 text-gray-800";

const PAY_TYPE_LABELS = {
  ONLINE: "온라인",
  DEVICE: "단말기",
  MOBILE: "모바일",
  VACT: "가상계좌",
  BILLING: "정기결제"
};

const PAY_TYPE_COLORS = {
  DEVICE: "bg-blue-500 text-white",
  MOBILE: "bg-purple-500 text-white",
  ONLINE: "bg-green-500 text-white",
  BILLING: "bg-orange-500 text-white",
  VACT: "bg-teal-500 text-white"
};

const PAY_TYPE_DEFAULT_COLOR = "bg-gray-500 text-white";

export function getCodeLabel(code: string, codeList: CommonCode[]) {
  const found = codeList.find((c) => c.code === code);
  return found?.description || code;
}

export function formatDate(dateString: string) {
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

export function formatAmount(amount: string) {
  const numAmount = Number(amount);
  if (isNaN(numAmount)) return amount;
  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
}

export function getStatusColor(status: TransactionStatus) {
  return TRANSACTION_STATUS_COLORS[status] || TRANSACTION_STATUS_DEFAULT_COLOR;
}

export function getMerchantStatusColor(status: MerchantStatus) {
  return MERCHANT_STATUS_COLORS[status] || MERCHANT_STATUS_DEFAULT_COLOR;
}

export function getBizTypeLabel(bizType: BizType) {
  return BIZ_TYPE_LABELS[bizType] || bizType;
}

export function getBizTypeColor(bizType: BizType) {
  return BIZ_TYPE_COLORS[bizType] || BIZ_TYPE_DEFAULT_COLOR;
}

export function getPayTypeLabel(payType: PayType) {
  return PAY_TYPE_LABELS[payType] || payType;
}

export function getPayTypeColor(payType: PayType) {
  return PAY_TYPE_COLORS[payType] || PAY_TYPE_DEFAULT_COLOR;
}
