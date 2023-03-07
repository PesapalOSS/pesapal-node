import { CreateSubscription, SubscriptionStatus } from "..";
import PaymentsBaseResource from "./payments-base";

export default class SubscriptionsResource extends PaymentsBaseResource {
  async create(data: CreateSubscription, ipnURL: string): Promise<PaymentRequest> {
    const ipn = await this.ensureIPN(ipnURL);
    return (await this.client.post("/api/Transactions/SubmitOrderRequest", {
      ...data,
      notification_id: ipn.ipn_id,
    })) as PaymentRequest;
  }

  async getStatus(orderTrackingId: string): Promise<SubscriptionStatus> {
    return (await this.client.get(
      `/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`
    )) as SubscriptionStatus;
  }
}
