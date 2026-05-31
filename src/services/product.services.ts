"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IProduct } from "@/types/inventory.types";

export interface ICreateVariantAttributePayload {
  key: string;
  value: string;
}

export interface ICreateVariantPayload {
  sku?: string;
  price: number;
  attributes: ICreateVariantAttributePayload[];
}

export interface ICreateColorGroupPayload {
  colorValue: string;
  colorCode?: string;
  variants: ICreateVariantPayload[];
}

export interface ICreateSpecificationPayload {
  group: string;
  key: string;
  value: string;
}

export interface ICreateProductPayload {
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  isActive?: boolean;
  specifications?: ICreateSpecificationPayload[];
  colorGroups: ICreateColorGroupPayload[];
}

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

export const createProduct = async (payload: ICreateProductPayload) => {
  try {
    return await httpClient.post<IProduct>("/products", payload);
  } catch (error) {
    console.log("Error creating product:", error);
    throw error;
  }
};
