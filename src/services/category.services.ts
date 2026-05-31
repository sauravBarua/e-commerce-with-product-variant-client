"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICategory } from "@/types/category.types";

export const getAllCategories = async (queryString?: string) => {
  try {
    return await httpClient.get<ICategory[]>(
      queryString ? `/categories?${queryString}` : "/categories",
    );
  } catch (error) {
    console.log("Error fetching categories:", error);
    throw error;
  }
};
