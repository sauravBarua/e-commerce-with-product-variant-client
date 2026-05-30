"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IProduct } from "@/types/inventory.types";

export const getAllProducts = async (queryString?: string) => {
  try {
    return await httpClient.get<IProduct[]>(
      queryString ? `/products?${queryString}` : "/products",
    );
  } catch (error) {
    console.log("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    return await httpClient.get<IProduct>(`/products/${id}`);
  } catch (error) {
    console.log("Error fetching product by id:", error);
    throw error;
  }
};
