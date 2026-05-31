"use server";

import { createOrder, clearCartAfterOrder } from "@/services/order.services";
import { ICreateOrderPayload } from "@/types/order.types";

export async function placeOrderAction(payload: ICreateOrderPayload) {
  const result = await createOrder(payload);
  if (result.success && result.data) {
    // Fire and forget — cart clear is best-effort
    await clearCartAfterOrder().catch(() => null);
  }
  return result;
}
