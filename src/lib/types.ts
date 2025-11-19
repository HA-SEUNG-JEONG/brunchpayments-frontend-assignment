export type MerchantStatus = "ACTIVE" | "INACTIVE" | "READY" | "CLOSED";
export type BizType =
  | "CAFE"
  | "SHOP"
  | "MART"
  | "APP"
  | "TRAVEL"
  | "EDU"
  | "TEST";
export type TransactionStatus = "SUCCESS" | "FAILED" | "CANCELLED";
export type PayType = "ONLINE" | "DEVICE" | "MOBILE" | "VACT" | "BILLING";

export interface PaymentTransaction {
  paymentCode: string;
  mchtCode: string;
  amount: string;
  currency: string;
  payType: PayType;
  status: TransactionStatus;
  paymentAt: string;
}

export interface Merchant {
  mchtCode: string;
  mchtName: string;
  status: MerchantStatus;
  bizType: BizType;
}

export interface MerchantDetail extends Merchant {
  bizNo: string;
  address: string;
  phone: string;
  email: string;
  registeredAt: string;
  updatedAt: string;
}

export interface CommonCode {
  code: string;
  description: string;
}
