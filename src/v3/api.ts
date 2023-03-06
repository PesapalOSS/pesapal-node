import {
  APIOpts,
  AuthReq,
  AuthRes,
  GeneralError,
  IPNGetEndpointsRes,
  IPNRegisterReq,
  IPNRegisterRes,
  RecurringOrderReq,
  SubmitOrderReq,
  SubmitOrderRes,
  TransactionStatusRes,
} from "./types";
import wretch, { Wretch } from "wretch";
import { dedupe } from "wretch/middlewares/dedupe";
import { SANDBOX_CREDENTIALS } from "./constants";

// global.fetch = require("node-fetch");
// global.FormData = require("form-data");
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// global.URLSearchParams = require("url").URLSearchParams;

/**
 * TODO:
 * - add docs
 * - implement reoccurring/subscription payments
 */

export default class Pesapal {
  protected readonly API_URL: string;
  protected api_credentials?: AuthRes;
  protected IPN?: IPNRegisterRes;
  protected readonly IPN_URL: string;
  protected readonly user_credentials: AuthReq;
  protected apiClient: Wretch<unknown, unknown, Promise<unknown>>;

  constructor(opts: APIOpts) {
    if (opts.sandbox) {
      this.user_credentials = SANDBOX_CREDENTIALS[opts.sandbox];
      // this.API_URL = "https://cybqa.pesapal.com/pesapalv3";
      this.API_URL = "https://pay.pesapal.com/v3";
    } else {
      this.user_credentials = {
        consumer_key: opts.consumer_key,
        consumer_secret: opts.consumer_secret,
      };
      this.API_URL = "https://pay.pesapal.com/v3";
    }
    this.IPN_URL = opts.ipn_url;
    this.apiClient = wretch(this.API_URL)
      .middlewares([
        dedupe(),
      ])
      .errorType("json")
      .resolve((r) => r.json());
  }

  protected errorThrower(err: GeneralError) {
    throw new Error(`[${err.code}]: ${err.message}`);
  }

  protected async auth() {
    const res = (await this.apiClient
      .url("/api/Auth/RequestToken")
      .post(this.user_credentials)) as AuthRes;
    if (res.error) this.errorThrower(res.error);
    this.api_credentials = res;
    const registeredIPNs = await this.getIPNs();
    let alreadyRegistered = false;
    registeredIPNs.every((ipn) => {
      if (ipn.url === this.IPN_URL) {
        alreadyRegistered = true;
        return false;
      }
    });
    if (!alreadyRegistered) {
      await this.registerIPN({
        ipn_notification_type: "POST",
        url: this.IPN_URL,
      })
        .then((ipn) => (this.IPN = ipn))
        .catch((err) => this.errorThrower(err));
    }
  }

  protected async ensureAuth() {
    const now = new Date();
    if (!this.api_credentials || this.api_credentials.expiryDate < now) return this.auth();
  }

  async getIPNs(): Promise<IPNGetEndpointsRes> {
    await this.ensureAuth();
    const res = await this.apiClient
      .auth(`Bearer ${this.api_credentials?.token}`)
      .get("/api/URLSetup/GetIpnList");
    return res as IPNGetEndpointsRes;
  }

  async registerIPN(data: IPNRegisterReq): Promise<IPNRegisterRes> {
    await this.ensureAuth();
    const res = (await this.apiClient
      .auth(`Bearer ${this.api_credentials?.token}`)
      .url("/api/URLSetup/RegisterIPN")
      .post(data)) as IPNRegisterRes;
    if (res.error) this.errorThrower(res.error);
    return res;
  }

  protected async submitOrderRequest(
    data: SubmitOrderReq | RecurringOrderReq
  ): Promise<SubmitOrderRes> {
    await this.ensureAuth();
    const res = (await this.apiClient
      .auth(`Bearer ${this.api_credentials?.token}`)
      .url("/api/Transactions/SubmitOrderRequest")
      .post(data)) as SubmitOrderRes;
    if (res.error) this.errorThrower(res.error);
    return res;
  }

  async createTransaction(data: Omit<SubmitOrderReq, "notification_id">): Promise<SubmitOrderRes> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.submitOrderRequest({ ...data, notification_id: this.IPN!.ipn_id });
  }

  async createRecurringTransaction(
    data: Omit<RecurringOrderReq, "notification_id">
  ): Promise<SubmitOrderRes> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.submitOrderRequest({ ...data, notification_id: this.IPN!.ipn_id });
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatusRes> {
    await this.ensureAuth();
    const res = (await this.apiClient
      .auth(`Bearer ${this.api_credentials?.token}`)
      .get(
        `/api/Transactions/GetTransactionStatus?orderTrackingId=${transactionId}`
      )) as TransactionStatusRes;
    if (res.error) this.errorThrower(res.error);
    return res;
  }
}
