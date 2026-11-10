import { test } from "@playwright/test";

import type { ApiClient } from "../client";
import type { Order, OrderCreate, Page } from "../models";

export class OrdersApi {
  constructor(private readonly client: ApiClient) {}

  create(order: OrderCreate): Promise<Order> {
    return test.step("Create an order through API", () =>
      this.client.send<Order>("POST", "/invoices", {
        payload: { ...order, invoice_date: new Date().toISOString().slice(0, 10) },
        expectedStatus: 201,
        retry: false,
      }));
  }

  list(): Promise<Page<Order>> {
    return test.step("List orders through API", () =>
      this.client.send<Page<Order>>("GET", "/invoices"));
  }

  get(orderId: string): Promise<Order> {
    return test.step("Read an order through API", () =>
      this.client.send<Order>("GET", `/invoices/${orderId}`));
  }
}
