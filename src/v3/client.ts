import wretch, { Wretch } from "wretch";
import { dedupe } from "wretch/middlewares/dedupe";
import { SANDBOX_CREDENTIALS } from ".";
import { APICredentials, AuthRes, GeneralError, PesapalConfig, UserCredentials } from "./types";

interface Response {
  error?: GeneralError;
  [key: string]: unknown;
}

/**
 * The `Client` class handles all communication with the Pesapal API.
 */
export class Client {
  public wretch: Wretch<unknown, unknown, Promise<unknown>>;
  protected api_credentials?: APICredentials;
  private user_credentials: UserCredentials;

  /**
   * Creates a new `Client` instance.
   * @param config - Pesapal API configuration
   */
  constructor(config: PesapalConfig) {
    // FIXME: sandbox env's cloudflare keeps blacklisting
    const sandbox = false;
    this.user_credentials = config.sandbox
      ? SANDBOX_CREDENTIALS[config.sandbox]
      : { consumer_key: config.consumer_key, consumer_secret: config.consumer_key };
    this.wretch = wretch(
      sandbox ? "https://cybqa.pesapal.com/pesapalv3" : "https://pay.pesapal.com/v3"
    )
      .middlewares([dedupe()])
      .errorType("json")
      .resolve((r) => r.json());
  }

  /**
   * Handles throwing an error if there is one in the response object.
   * @param err - The error object to throw.
   */
  protected errorThrower(err: GeneralError) {
    throw new Error(`[${err.code}]: ${err.message}`);
  }

  /**
   * Ensures that the client is authorized to access the API, and returns the API credentials.
   * @returns The API credentials.
   */
  protected async ensureAuth(): Promise<APICredentials> {
    const now = new Date();
    if (!this.api_credentials || this.api_credentials.expiryDate < now) return await this.auth();
    return this.api_credentials;
  }

  /**
   * Requests API credentials from the Pesapal API.
   * @returns The API credentials.
   */
  async auth(): Promise<APICredentials> {
    const res = (await this.wretch
      .url("/api/Auth/RequestToken")
      .post(this.user_credentials)
      .catch((e) => console.log(e.message))) as AuthRes;
    if (res.error) this.errorThrower(res.error);
    this.api_credentials = res;
    return this.api_credentials;
  }

  /**
   * Sends a GET request to the Pesapal API.
   * @param endpoint - The endpoint to send the request to.
   * @returns The response data from the API.
   */
  async get(endpoint: string): Promise<unknown> {
    await this.ensureAuth();
    const res = await this.wretch
      .auth(`Bearer ${this.api_credentials?.token}`)
      .get(endpoint)
      .then((res) => res as Response)
      .catch((e) => {
        throw e;
      });
    if (res.error) this.errorThrower(res.error);
    return res;
  }

  /**
   * Sends a POST request to the Pesapal API.
   * @param endpoint - The endpoint to send the request to.
   * @param data - The data to send in the request body.
   * @returns The response data from the API. 
   */
  async post(endpoint: string, data: unknown): Promise<unknown> {
    await this.ensureAuth();
    const res = await this.wretch
      .auth(`Bearer ${this.api_credentials?.token}`)
      .url(endpoint)
      .post(data)
      .then((res) => res as Response)
      .catch((e) => {
        throw e;
      });
    if (res.error) this.errorThrower(res.error);
    return res;
  }
}
