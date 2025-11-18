export interface PaymentTransaction {
  paymentCode: string;
  mchtCode: string;
  amount: string;
  currency: string;
  payType: string;
  status: string;
  paymentAt: string;
}

export interface Merchant {
  mchtCode: string;
  mchtName: string;
  status: string;
  bizType: string;
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
