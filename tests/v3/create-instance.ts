import Pesapal from "../../src/v3";

export const newPesapal = () => new Pesapal({ sandbox: "kenya", ipn_url: "https://example.com/ipn" });
