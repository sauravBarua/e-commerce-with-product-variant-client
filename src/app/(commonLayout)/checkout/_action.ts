"use server";

import { createOrder } from "@/services/order.services";
import { ICreateOrderPayload } from "@/types/order.types";

export async function placeOrderAction(payload: ICreateOrderPayload) {
  return createOrder(payload);
}
