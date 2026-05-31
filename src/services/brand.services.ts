"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IBrand } from "@/types/brand.types";

export const getAllBrands = async (queryString?: string) => {
  try {
    return await httpClient.get<IBrand[]>(
      queryString ? `/brands?${queryString}` : "/brands",
    );
  } catch (error) {
    console.log("Error fetching brands:", error);
    throw error;
  }
};
