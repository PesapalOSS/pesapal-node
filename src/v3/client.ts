import wretch, { Wretch } from "wretch";
import { dedupe } from "wretch/middlewares/dedupe";
import { SANDBOX_CREDENTIALS } from ".";
import { APICredentials, AuthRes, GeneralError, PesapalConfig, UserCredentials } from "./types";

interface Response {
  error?: GeneralError;
  [key: string]: unknown;
}

export class Client {
  public wretch: Wretch<unknown, unknown, Promise<unknown>>;
  protected api_credentials?: APICredentials;
  private user_credentials: UserCredentials;

  constructor(config: PesapalConfig) {
    // FIXME: sandbox env currently has some issues we will use main env for now
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

  protected errorThrower(err: GeneralError) {
    throw new Error(`[${err.code}]: ${err.message}`);
  }

  protected async ensureAuth(credentials: UserCredentials): Promise<APICredentials> {
    const now = new Date();
    if (!this.api_credentials || this.api_credentials.expiryDate < now)
      return await this.auth(credentials);
    return this.api_credentials;
  }

  async auth(credentials: UserCredentials): Promise<APICredentials> {
    const res = (await this.wretch.url("/api/Auth/RequestToken").post(credentials)) as AuthRes;
    if (res.error) this.errorThrower(res.error);
    this.api_credentials = res;
    return this.api_credentials;
  }

  async get(url: string): Promise<unknown> {
    await this.ensureAuth(this.user_credentials);
    const res = await this.wretch
      .auth(`Bearer ${this.api_credentials?.token}`)
      .get(url)
      .then((res) => res as Response)
      .catch((e) => {
        throw e;
      });
    if (res.error) this.errorThrower(res.error);
    return res;
  }

  async post(url: string, data: unknown): Promise<unknown> {
    await this.ensureAuth(this.user_credentials);
    const res = await this.wretch
      .auth(`Bearer ${this.api_credentials?.token}`)
      .url(url)
      .post(data)
      .then((res) => res as Response)
      .catch((e) => {
        throw e;
      });
    if (res.error) this.errorThrower(res.error);
    return res;
  }
}
