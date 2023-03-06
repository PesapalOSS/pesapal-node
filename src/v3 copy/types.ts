import { SANDBOX_CREDENTIALS } from "./constants";

type SandboxCountry = keyof typeof SANDBOX_CREDENTIALS;

export type APIOpts =
  | {
      sandbox: SandboxCountry;
      consumer_key?: string;
      consumer_secret?: string;
      ipn_url: string;
    }
  | {
      sandbox: false;
      consumer_key: string;
      consumer_secret: string;
      ipn_url: string;
    };

export interface GeneralError {
  type: string;
  code: string;
  message: string;
}

export interface AuthReq {
  consumer_key: string;
  consumer_secret: string;
}

export interface AuthRes {
  token: string;
  expiryDate: Date;
  error?: GeneralError;
  status: string;
  message: string;
}

export interface IPNRegisterReq {
  url: string;
  ipn_notification_type: "GET" | "POST";
}

export interface IPNRegisterRes {
  url: string;
  created_date: Date;
  ipn_id: string;
  error?: GeneralError;
  status: string;
}

export type IPNGetEndpointsRes = IPNRegisterRes[];

export interface BillingAddress {
  email_address: string;
  phone_number?: string;
  country_code?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  line_1?: string;
  line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zip_code?: string;
}

export interface SubmitOrderReq {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  cancellation_url?: string;
  notification_id: string;
  billing_address: BillingAddress;
}

export interface SubmitOrderRes {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error?: GeneralError;
  status: string;
}

export interface RecurringOrderReq extends SubmitOrderReq {
  account_number: string;
}

export interface TransactionStatusReq {
  orderTrackingId: string;
}

export interface TransactionStatusRes {
  payment_method: string;
  amount: number;
  created_date: Date;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code: string;
  currency: string;
  error: GeneralError;
  status: string;
}
