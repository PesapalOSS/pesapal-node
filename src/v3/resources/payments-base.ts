import { IPN } from "..";
import { Client } from "../client";
import BaseResource from "./base";
import IPNsResource from "./ipns";

export default class PaymentsBaseResource extends BaseResource {
  private ipns: IPNsResource;

  constructor(client: Client) {
    super(client);
    this.ipns = new IPNsResource(this.client);
  }

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
