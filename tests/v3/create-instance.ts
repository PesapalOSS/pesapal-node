import Pesapal from "../../src/v3";

export const newPesapal = () => new Pesapal({ sandbox: "kenya", ipn: "https://example.com/ipn" });
