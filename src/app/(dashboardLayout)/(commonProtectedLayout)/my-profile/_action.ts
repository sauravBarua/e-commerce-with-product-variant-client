"use server";

import { getUserInfo } from "@/services/auth.services";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProfileAction = async (): Promise<any | null> => {
  const user = await getUserInfo();
  return user ?? null;
};

export type UpdateProfileActionResult =
  | { success: true }
  | { success: false; message: string };

export const updateProfileAction = async (
  formData: FormData,
): Promise<UpdateProfileActionResult> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await fetch(`${BASE_API_URL}/auth/update-profile`, {
      method: "PATCH",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await res.json().catch(() => ({}));
      return {
        success: false,
        message: data?.message || "Failed to update profile",
      };
    }

    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, message };
  }
};
