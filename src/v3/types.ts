/**
 * Sandbox country for which to use hardcoded test credentials
 */
import { SANDBOX_CREDENTIALS } from ".";

/**
 * Type of sandbox country
 */
type SandboxCountry = keyof typeof SANDBOX_CREDENTIALS;

/**
 * Pesapal API configuration
 */
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

/**
 * General error object returned by the Pesapal API
 */
export interface GeneralError {
  type: string;
  code: string;
  message: string;
}

/**
 * API credentials returned by the Pesapal API authentication endpoint
 */
export interface APICredentials {
  token: string;
  expiryDate: Date;
}

/**
 * User credentials used to authenticate with the Pesapal API
 */
export interface UserCredentials {
  consumer_key: string;
  consumer_secret: string;
}

/**
 * Authentication response returned by the Pesapal API
 */
export interface AuthRes extends APICredentials {
  error?: GeneralError;
  status: string;
  message: string;
}

/**
 * Payment Notification (IPN) object
 */
export interface IPN {
  ipn_id: string;
  url: string;
  created_date: Date;
}

/**
 * IPN registration request
 */
export interface RegisterIPN {
  url: string;
  ipn_notification_type: "GET" | "POST";
}

/**
 * Billing address object for payments and subscriptions
 */
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

/**
 * Payment creation request
 */
export interface CreatePayment {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  cancellation_url?: string;
  billing_address: BillingAddress;
}

/**
 * Subscription creation request
 */
export interface CreateSubscription extends CreatePayment {
  account_number: string;
}

/**
 * Payment request returned by the Pesapal API after a payment creation request
 */
export interface PaymentRequest {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
}

/**
 * Status of a payment
 */
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

/**
 * Information about a transaction in a subscription
 */
export interface SubscriptionTransactionInfo {
  account_reference: string;
  amount: number;
  first_name: string;
  last_name: string;
  correlation_id: string;
}

/**
 * Status of a subscription
 */
export interface SubscriptionStatus extends PaymentStatus {
  subscription_transaction_info: SubscriptionTransactionInfo;
}
