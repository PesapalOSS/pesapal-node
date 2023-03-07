import { SANDBOX_CREDENTIALS } from ".";

type SandboxCountry = keyof typeof SANDBOX_CREDENTIALS;

export type PesapalConfig =
  | {
      sandbox: SandboxCountry;
      consumer_key?: string;
      consumer_secret?: string;
      ipn: string;
    }
  | {
      sandbox: false;
      consumer_key: string;
      consumer_secret: string;
      ipn: string;
    };

export interface GeneralError {
  type: string;
  code: string;
  message: string;
}

export interface APICredentials {
  token: string;
  expiryDate: Date;
}

export interface UserCredentials {
  consumer_key: string;
  consumer_secret: string;
}

export interface AuthRes extends APICredentials {
  error?: GeneralError;
  status: string;
  message: string;
}

export interface IPN {
  ipn_id: string;
  url: string;
  created_date: Date;
}

export interface RegisterIPN {
  url: string;
  ipn_notification_type: "GET" | "POST";
}

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

export interface CreatePayment {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  cancellation_url?: string;
  billing_address: BillingAddress;
}

export interface CreateSubscription extends CreatePayment {
  account_number: string;
}

export interface PaymentRequest {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
}

export interface PaymentStatus {
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
}

export interface SubscriptionTransactionInfo {
  account_reference: string;
  amount: number;
  first_name: string;
  last_name: string;
  correlation_id: string;
}

export interface SubscriptionStatus extends PaymentStatus {
  subscription_transaction_info: SubscriptionTransactionInfo;
}
