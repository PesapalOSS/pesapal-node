# Pesapal Node.js Library

The officially supported Node.js library for interacting with the Pesapal API. It provides a simple and intuitive API for integrating your Node.js applications with Pesapal, making it easy to accept payments and manage subscriptions.

## 🚀 Getting started

```sh
npm install @pesapal/pesapal-node
# or
pnpm install @pesapal/pesapal-node
# or
yarn add @pesapal/pesapal-node
```

Once you've installed the library, you can start using it in your application like this:

### Typescript

```typescript
import Pesapal from "@pesapal/pesapal-node";

const pesapal = new Pesapal({ sandbox: "kenya" });

// list all registered ipns
const ipns = await pesapal.ipns.list();

// create a payment request
const paymentRequest = await pesapal.payments.create(
  {
    id: "ABC123",
    currency: "KES",
    amount: 5000,
    description: "Payment for goods and services",
    callback_url: "https://example.com/checkout/success",
    billing_address: {
      email_address: "jane.doe@example.com",
      phone_number: "0712345678",
      country_code: "KE",
      first_name: "Jane",
      middle_name: "",
      last_name: "Doe",
      line_1: "123 Main Street",
      line_2: "Apt 4B",
      city: "Nairobi",
      state: "Nairobi",
      postal_code: "00100",
      zip_code: "00100",
    },
  },
  "https://example.com/ipn"
);
```

## Configuration

```typescript
import Pesapal from "@pesapal/pesapal-node";

const pesapal = new Pesapal({
  sandbox: false,
  consumer_key: "xxx",
  consumer_secret: "xxx",
});
```

| Option          | Default | Description                                                                                                                                                                                                     |
| --------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sandbox         | 'kenya' | Can be any of the sandbox countries for example `kenya` `uganda` `tanzania` `malawi` `rwanda` `zambia` `zimbabwe`. If you set it to `false` then you must provide your own `consumer_key` and `consumer_secret` |
| consumer_key    | null    | Obtained when you [sign up](https://www.pesapal.com/dashboard/account/register) for an account                                                                                                                  |
| consumer_secret | null    | Obtained when you [sign up](https://www.pesapal.com/dashboard/account/register) for an account                                                                                                                  |
