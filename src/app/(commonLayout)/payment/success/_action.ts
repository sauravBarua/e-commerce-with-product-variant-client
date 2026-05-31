"use server";

import { clearCartAfterOrder } from "@/services/order.services";
import { verifyPaymentSession } from "@/services/payment.services";

export async function verifyAndFinalizePayment(sessionId: string) {
  const result = await verifyPaymentSession(sessionId);
  if (result?.data?.paid) {
    await clearCartAfterOrder().catch(() => null);
  }
  return result?.data ?? { paid: false };
}
