/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import {
  IChangePasswordPayload,
  changePasswordZodSchema,
} from "@/zod/auth.validation";

export type ChangePasswordActionResult =
  | { success: true; redirectTo: string }
  | ApiErrorResponse;

export const changePasswordAction = async (
  payload: IChangePasswordPayload,
  role: UserRole,
): Promise<ChangePasswordActionResult> => {
  const parsedPayload = changePasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  const { currentPassword, newPassword } = parsedPayload.data;

  try {
    await httpClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });

    return { success: true, redirectTo: getDefaultDashboardRoute(role) };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Change password failed",
    };
  }
};
