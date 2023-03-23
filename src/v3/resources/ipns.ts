import { IPN, RegisterIPN } from "..";
import BaseResource from "./base";

/**
 * Represents the base resource for all ipn related resources.
 * @extends BaseResource
 */
export default class IPNsResource extends BaseResource {
  /**
   * Returns a list of IPNs.
   * @returns A promise that resolves to an array of IPN objects.
   */
  async list(): Promise<IPN[]> {
    return (await this.client.get("/api/URLSetup/GetIpnList")) as IPN[];
  }

  /**
   * Registers a new IPN.
   * @param ipn An object containing information about the IPN to register.
   * @returns A promise that resolves to an IPN object.
   */
  async register(ipn: RegisterIPN): Promise<IPN> {
    return (await this.client.post("/api/URLSetup/RegisterIPN", ipn)) as IPN;
  }
}
