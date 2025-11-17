import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatAmount(amount: string, currency: string): string {
  const numAmount = Number(amount);
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
