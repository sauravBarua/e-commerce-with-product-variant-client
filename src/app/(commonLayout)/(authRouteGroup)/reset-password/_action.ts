/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import {
  IResetPasswordPayload,
  resetPasswordZodSchema,
} from "@/zod/auth.validation";

export type ResetPasswordActionResult =
  | { success: true; redirectTo: string }
  | ApiErrorResponse;

export const resetPasswordAction = async (
  payload: IResetPasswordPayload,
): Promise<ResetPasswordActionResult> => {
  const parsedPayload = resetPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    await httpClient.post("/auth/reset-password", parsedPayload.data);

    return { success: true, redirectTo: "/login" };
  } catch (error: any) {
    return {
      success: false,
      message: `Reset password failed: ${error.message}`,
    };
  }
};
