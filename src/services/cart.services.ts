"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICart } from "@/types/cart.types";

export const getMyCart = async () => {
  return httpClient.get<ICart>("/cart");
};

export const addToCart = async (variantId: string, quantity: number) => {
  return httpClient.post<ICart>("/cart", { variantId, quantity });
};

export const updateCartItem = async (cartItemId: string, quantity: number) => {
  return httpClient.patch<ICart>(`/cart/items/${cartItemId}`, { quantity });
};

export const removeCartItem = async (cartItemId: string) => {
  return httpClient.delete<ICart>(`/cart/items/${cartItemId}`);
};

export const clearCart = async () => {
  return httpClient.delete<ICart>("/cart");
};
