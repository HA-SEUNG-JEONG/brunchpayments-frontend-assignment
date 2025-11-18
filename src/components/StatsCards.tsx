import type { PaymentTransaction } from "@/lib/types";
import { formatAmount } from "@/lib/utils";
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Ban,
  DollarSign
} from "lucide-react";

interface StatsCardsProps {
  data: PaymentTransaction[];
}

const getStatusCounts = (data: PaymentTransaction[]) => {
  return data.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
    return counts;
  }, {});
};

const getCurrencyGroups = (data: PaymentTransaction[]) => {
  return data.reduce<Record<string, number>>((groups, item) => {
    if (!groups[item.currency]) {
      groups[item.currency] = 0;
    }
    groups[item.currency] += Number(item.amount);
    return groups;
  }, {});
};

export function StatsCards({ data }: StatsCardsProps) {
  const statusCounts = getStatusCounts(data);
  const currencyGroups = getCurrencyGroups(data);

  const stats = [
    {
      title: "총 거래 건수",
      value: data.length.toLocaleString("ko-KR"),
      unit: "건",
      icon: TrendingUp,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      cardBg: "bg-blue-50",
      valueColor: "text-blue-700"
    },
    {
      title: "성공",
      value: statusCounts.SUCCESS || 0,
      unit: "건",
      icon: CheckCircle2,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      cardBg: "bg-green-50",
      valueColor: "text-green-700"
    },
    {
      title: "실패",
      value: statusCounts.FAILED || 0,
      unit: "건",
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      cardBg: "bg-red-50",
      valueColor: "text-red-700"
    },
    {
      title: "취소",
      value: statusCounts.CANCELLED || 0,
      unit: "건",
      icon: Ban,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
      cardBg: "bg-gray-50",
      valueColor: "text-gray-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <article
            key={stat.title}
            className={`group relative overflow-hidden rounded-xl border-2 ${stat.cardBg} border-gray-200 p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {stat.title}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <div
                    className={`text-3xl font-bold tracking-tight ${stat.valueColor}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">
                    {stat.unit}
                  </div>
                </div>
              </div>
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </article>
        );
      })}
      {Object.entries(currencyGroups).map(([currency, amount]) => (
        <article
          key={currency}
          className="group relative overflow-hidden rounded-xl border-2 bg-yellow-50 border-yellow-200 p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                총 거래액 ({currency})
              </h3>
              <div className="text-lg font-bold tracking-tight text-yellow-800">
                {formatAmount(amount.toString(), currency)}
              </div>
            </div>
            <div className="shrink-0 rounded-lg bg-yellow-100 p-3">
              <DollarSign className="h-6 w-6 text-yellow-700" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
