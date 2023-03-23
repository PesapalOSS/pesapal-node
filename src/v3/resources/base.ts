import { Client } from "../client";

/**
 * Base class for all API resources.
 */
export default class BaseResource {
  /**
   * The `Client` instance to be used for all communication with the Pesapal API.
   */
  protected client: Client;

  /**
   * Creates a new `BaseResource` instance.
   * @param client The `Client` instance to use for communication with the Pesapal API.
   */
  constructor(client: Client) {
    this.client = client;
  }
}
