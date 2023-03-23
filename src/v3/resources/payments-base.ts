import { IPN } from "..";
import { Client } from "../client";
import BaseResource from "./base";
import IPNsResource from "./ipns";

/**
 * Represents the base resource for all payment related resources.
 * @extends BaseResource
 */
export default class PaymentsBaseResource extends BaseResource {
  /**
   * The IPN resource object used for IPN related operations.
   * @private
   */
  private ipns: IPNsResource;

  /**
   * Constructs a new PaymentsBaseResource object.
   * @param client The `Client` instance to use for communication with the Pesapal API.
   */
  constructor(client: Client) {
    super(client);
    this.ipns = new IPNsResource(this.client);
  }

  /**
   * Ensures that the given IPN URL is registered and returns the registered IPN object.
   * @param url - The IPN URL to ensure registration for.
   * @returns The registered IPN object.
   */
  protected async ensureIPN(url: string): Promise<IPN> {
    const registeredIPNs = await this.ipns.list();
    let ipn: IPN | undefined = undefined;
    registeredIPNs.every((registered) => {
      if (registered.url === url) {
        ipn = registered;
        return false;
      }
    });
    if (!ipn) {
      ipn = await this.ipns.register({
        ipn_notification_type: "POST",
        url: url,
      });
    }
    return ipn;
  }
}
