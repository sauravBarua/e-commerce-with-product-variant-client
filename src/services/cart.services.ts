"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICart } from "@/types/cart.types";

export const getMyCart = async () => {
  return httpClient.get<ICart>("/carts");
};

export const addToCart = async (variantId: string, quantity: number) => {
  return httpClient.post<ICart>("/carts", { variantId, quantity });
};

export const updateCartItem = async (cartItemId: string, quantity: number) => {
  return httpClient.patch<ICart>(`/carts/items/${cartItemId}`, { quantity });
};

export const removeCartItem = async (cartItemId: string) => {
  return httpClient.delete<ICart>(`/carts/items/${cartItemId}`);
};

export const clearCart = async () => {
  return httpClient.delete<ICart>("/carts");
};
