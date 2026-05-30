/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import {
  IVerifyEmailPayload,
  verifyEmailZodSchema,
} from "@/zod/auth.validation";

export type VerifyEmailActionResult =
  | { success: true; redirectTo: string }
  | ApiErrorResponse;

export const verifyEmailAction = async (
  payload: IVerifyEmailPayload,
): Promise<VerifyEmailActionResult> => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return { success: false, message: firstError };
  }

  try {
    await httpClient.post("/auth/verify-email", parsedPayload.data);
    return { success: true, redirectTo: "/login" };
  } catch (error: any) {
    return {
      success: false,
      message: `Email verification failed: ${error.response?.data?.message || error.message}`,
    };
  }
};
