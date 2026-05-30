"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { type ICustomer } from "@/types/customer.types";

export const getAllCustomers = async (queryString?: string) => {
  try {
    return await httpClient.get<ICustomer[]>(
      queryString ? `/customers?${queryString}` : "/customers",
    );
  } catch (error) {
    console.log("Error fetching customers:", error);
    throw error;
  }
};
