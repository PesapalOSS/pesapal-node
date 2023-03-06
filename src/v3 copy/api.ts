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
import axios, { AxiosError, AxiosInstance } from "axios";
import { SANDBOX_CREDENTIALS } from "./constants";

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
  protected readonly axios: AxiosInstance;

  constructor(opts: APIOpts) {
    if (opts.sandbox) {
      this.user_credentials = SANDBOX_CREDENTIALS[opts.sandbox];
      this.API_URL = "https://cybqa.pesapal.com/pesapalv3";
    } else {
      this.user_credentials = {
        consumer_key: opts.consumer_key,
        consumer_secret: opts.consumer_secret,
      };
      this.API_URL = "https://pay.pesapal.com/v3";
    }
    this.IPN_URL = opts.ipn_url;
    this.axios = axios.create({
      baseURL: this.API_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Encoding": "application/json",
      },
      // Transform date text to date object
      // transformResponse: (data) => {
      //   return JSON.parse(data, (key, value) => (/date/i.test(key) ? new Date(value) : value));
      // },
    });
  }

  protected errorThrower(err: GeneralError) {
    throw new Error(`[${err.code}]: ${err.message}`);
  }

  protected async auth() {
    // console.log(this.API_URL)
    await this.axios
      .post<AuthRes>(`/api/Auth/RequestToken`, JSON.stringify(this.user_credentials))
      .then((res) => {
        console.log(res.data)
        if (res.data.error) this.errorThrower(res.data.error);
        this.api_credentials = res.data;
      })
      .catch((err: AxiosError) => {
        console.log(err)
        throw err;
      });
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

  protected async ensureApiAuth() {
    const now = new Date();
    if (!this.api_credentials || this.api_credentials.expiryDate < now) return this.auth();
  }

  async getIPNs(): Promise<IPNGetEndpointsRes> {
    await this.ensureApiAuth();
    return (
      await this.axios.get<IPNGetEndpointsRes>("/api/URLSetup/GetIpnList", {
        headers: { Authorization: `Bearer ${this.api_credentials?.token}` },
      })
    ).data;
  }

  async registerIPN(data: IPNRegisterReq): Promise<IPNRegisterRes> {
    await this.ensureApiAuth();
    return this.axios
      .post<IPNRegisterRes>("/api/URLSetup/RegisterIPN", JSON.stringify(data), {
        headers: { Authorization: `Bearer ${this.api_credentials?.token}` },
      })
      .then((res) => {
        if (res.data.error) this.errorThrower(res.data.error);
        return res.data;
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }

  async createTransaction(data: Omit<SubmitOrderReq, "notification_id">): Promise<SubmitOrderRes> {
    await this.ensureApiAuth();
    return this.axios
      .post<SubmitOrderRes>(
        "/api/Transactions/SubmitOrderRequest",
        JSON.stringify({ ...data, notification_id: this.IPN?.ipn_id }),
        {
          headers: { Authorization: `Bearer ${this.api_credentials?.token}` },
        }
      )
      .then((res) => {
        if (res.data.error) this.errorThrower(res.data.error);
        return res.data;
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }

  async createRecurringTransaction(
    data: Omit<RecurringOrderReq, "notification_id">
  ): Promise<SubmitOrderRes> {
    await this.ensureApiAuth();
    return this.axios
      .post<SubmitOrderRes>(
        "/api/Transactions/SubmitOrderRequest",
        JSON.stringify({ ...data, notification_id: this.IPN?.ipn_id }),
        {
          headers: { Authorization: `Bearer ${this.api_credentials?.token}` },
        }
      )
      .then((res) => {
        if (res.data.error) this.errorThrower(res.data.error);
        return res.data;
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatusRes> {
    await this.ensureApiAuth();
    return this.axios
      .get<TransactionStatusRes>(
        `/api/Transactions/GetTransactionStatus?orderTrackingId=${transactionId}`,
        {
          headers: { Authorization: `Bearer ${this.api_credentials?.token}` },
        }
      )
      .then((res) => {
        if (res.data.error) this.errorThrower(res.data.error);
        return res.data;
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }
}
