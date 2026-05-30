/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import {
  forgotPasswordZodSchema,
  IForgotPasswordPayload,
} from "@/zod/auth.validation";

export type ForgotPasswordActionResult =
  | { success: true; email: string }
  | ApiErrorResponse;

export const forgotPasswordAction = async (
  payload: IForgotPasswordPayload,
): Promise<ForgotPasswordActionResult> => {
  const parsedPayload = forgotPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return { success: false, message: firstError };
  }

  try {
    await httpClient.post("/auth/forget-password", parsedPayload.data);
    return { success: true, email: parsedPayload.data.email };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to send reset OTP",
    };
  }
};
