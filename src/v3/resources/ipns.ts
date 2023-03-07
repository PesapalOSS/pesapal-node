import { IPN, RegisterIPN } from "..";
import BaseResource from "./base";

export default class IPNsResource extends BaseResource {
  async list(): Promise<IPN[]> {
    return (await this.client.get("/api/URLSetup/GetIpnList")) as IPN[];
  }

  async register(ipn: RegisterIPN): Promise<IPN> {
    return (await this.client.post("/api/URLSetup/RegisterIPN", ipn)) as IPN;
  }
}
