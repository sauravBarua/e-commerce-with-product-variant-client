"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const createPaymentSession = async (orderId: string) => {
  return httpClient.post<{ checkoutUrl: string }>(`/payments/${orderId}`, {});
};

export const verifyPaymentSession = async (sessionId: string) => {
  return httpClient.get<{ paid: boolean; orderId?: string }>(
    `/payments/verify/${sessionId}`,
  );
};
