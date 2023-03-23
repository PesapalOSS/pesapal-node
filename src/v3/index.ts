import { PesapalConfig } from "./types";
import { Client } from "./client";
import IPNsResource from "./resources/ipns";
import PaymentsResource from "./resources/payments";
import SubscriptionsResource from "./resources/subscriptions";

/**
 * Pesapal API wrapper
 */
class Pesapal {
  /**
   * HTTP client used to make requests to the API
   */
  protected client: Client;
  /**
   * Payment Notification (IPN) resource
   */
  public ipns: IPNsResource;
  /**
   * Payment resource
   */
  public payments: PaymentsResource;
  /**
   * Subscription resource
   */
  public subscriptions: SubscriptionsResource;

  /**
   * Creates a new instance of the Pesapal API wrapper
   * @param config - Pesapal API configuration
   */
  constructor(config: PesapalConfig) {
    this.client = new Client(config);
    this.ipns = new IPNsResource(this.client);
    this.payments = new PaymentsResource(this.client);
    this.subscriptions = new SubscriptionsResource(this.client);
  }
}

/**
 * Sandbox credentials for all supported Pesapal countries
 */
export const SANDBOX_CREDENTIALS = {
  kenya: {
    consumer_key: "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW",
    consumer_secret: "osGQ364R49cXKeOYSpaOnT++rHs=",
  },
  uganda: {
    consumer_key: "TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev",
    consumer_secret: "1KpqkfsMaihIcOlhnBo/gBZ5smw=",
  },
  tanzania: {
    consumer_key: "ngW+UEcnDhltUc5fxPfrCD987xMh3Lx8",
    consumer_secret: "q27RChYs5UkypdcNYKzuUw460Dg=",
  },
  malawi: {
    consumer_key: "htMsEFfIVHfhqBL9O0ykz8wuedfFyg1s",
    consumer_secret: "DcwkVNIiyijNWn1fdL/pa4K6khc=",
  },
  rwanda: {
    consumer_key: "wCGzX1fNzvtI5lMR5M4AxvxBmLpFgZzp",
    consumer_secret: "uU7R9g2IHn9dkrKDVIfcPppktIo=",
  },
  zambia: {
    consumer_key: "v988cq7bMB6AjktYo/drFpe6k2r/y7z3",
    consumer_secret: "3p0F/KcY8WAi36LntpPf/Ss0MhQ=",
  },
  zimbabwe: {
    consumer_key: "vknEWEEFeygxAX+C9TPOhvkbkPsj8qXK",
    consumer_secret: "MOOP31smKijvusQbNXn/s7m8jC8=",
  },
};

export default Pesapal;
export * from "./types";
