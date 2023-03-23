import { CreatePayment, PaymentStatus } from "..";
import PaymentsBaseResource from "./payments-base";

/**
 * A resource for managing payments.
 * @extends PaymentsBaseResource to ensure that IPN is registered for each request.
 */
export default class PaymentsResource extends PaymentsBaseResource {
  /**
   * Creates a new payment request with the given data and IPN URL.
   * @param data - The data for the payment request.
   * @param ipnURL - The URL for the IPN (Instant Payment Notification).
   * @returns A `Promise` that resolves to the created `PaymentRequest`.
   */
  async create(data: CreatePayment, ipnURL: string): Promise<PaymentRequest> {
    const ipn = await this.ensureIPN(ipnURL);
    return (await this.client.post("/api/Transactions/SubmitOrderRequest", {
      ...data,
      notification_id: ipn.ipn_id,
    })) as PaymentRequest;
  }

  /**
   * Gets the status of the payment with the given order tracking ID.
   * @param orderTrackingId - The order tracking ID of the payment.
   * @returns A `Promise` that resolves to the `PaymentStatus` of the payment.
   */
  async getStatus(orderTrackingId: string): Promise<PaymentStatus> {
    return (await this.client.get(
      `/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`
    )) as PaymentStatus;
  }
}
