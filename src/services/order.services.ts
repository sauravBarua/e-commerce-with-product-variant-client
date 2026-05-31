"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICart } from "@/types/cart.types";
import { ICreateOrderPayload, IOrder } from "@/types/order.types";

export const createOrder = async (payload: ICreateOrderPayload) => {
  return httpClient.post<IOrder>("/orders", payload);
};

export const getMyOrders = async (queryString?: string) => {
  return httpClient.get<IOrder[]>(
    queryString ? `/orders/my-orders?${queryString}` : "/orders/my-orders",
  );
};

export const getOrderById = async (id: string) => {
  return httpClient.get<IOrder>(`/orders/${id}`);
};

export const cancelOrder = async (id: string) => {
  return httpClient.patch<IOrder>(`/orders/${id}/cancel`, {});
};

// Re-export cart helpers so checkout can call them via server actions
export const getMyCartForCheckout = async () => {
  return httpClient.get<ICart>("/carts");
};

export const clearCartAfterOrder = async () => {
  return httpClient.delete<ICart>("/carts");
};
