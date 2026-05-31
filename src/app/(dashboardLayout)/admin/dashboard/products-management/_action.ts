"use server";

import {
  createProduct,
  ICreateProductPayload,
} from "@/services/product.services";
import { getCookie } from "@/lib/cookieUtils";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createProductAction = async (payload: ICreateProductPayload) => {
  const result = await createProduct(payload);
  revalidatePath("/admin/dashboard/products-management");
  return result;
};

export const uploadColorGroupImagesAction = async (
  productId: string,
  colorGroupId: string,
  formData: FormData,
) => {
  const accessToken = await getCookie("accessToken");

  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/color-groups/${colorGroupId}/images`,
    {
      method: "POST",
      headers: {
        ...(accessToken ? { Cookie: `accessToken=${accessToken}` } : {}),
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message ?? "Image upload failed");
  }

  return response.json();
};
