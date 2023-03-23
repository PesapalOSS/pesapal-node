import { CreateSubscription, SubscriptionStatus } from "..";
import PaymentsBaseResource from "./payments-base";

/**
 * A resource for managing subscriptions.
 * @extends PaymentsBaseResource to ensure that IPN is registered for each request.
 */
export default class SubscriptionsResource extends PaymentsBaseResource {
  /**
   * Creates a new subscription.
   *
   * @param data - The subscription data.
   * @param ipnURL - The URL for the IPN.
   * @returns The PaymentRequest object.
   */
  async create(data: CreateSubscription, ipnURL: string): Promise<PaymentRequest> {
    const ipn = await this.ensureIPN(ipnURL);
    return (await this.client.post("/api/Transactions/SubmitOrderRequest", {
      ...data,
      notification_id: ipn.ipn_id,
    })) as PaymentRequest;
  }

  /**
   * Gets the status of a subscription.
   *
   * @param orderTrackingId - The order tracking ID for the subscription.
   * @returns The SubscriptionStatus object.
   */
  async getStatus(orderTrackingId: string): Promise<SubscriptionStatus> {
    return (await this.client.get(
      `/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`
    )) as SubscriptionStatus;
  }
}
