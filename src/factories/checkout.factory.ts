import type { Address, OrderCreate } from "../api/models";

export const CheckoutDataFactory = {
  cashOnDelivery(cartId: string, address: Address): OrderCreate {
    return {
      billing_street: address.street,
      billing_city: address.city,
      billing_state: address.state,
      billing_country: address.country,
      billing_postal_code: address.postal_code,
      payment_method: "cash-on-delivery",
      payment_details: {},
      cart_id: cartId,
    };
  },
};
