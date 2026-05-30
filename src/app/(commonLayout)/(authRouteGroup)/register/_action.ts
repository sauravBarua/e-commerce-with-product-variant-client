/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { IRegisterResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";

export type RegisterActionResult =
  | { success: true; redirectTo: string }
  | ApiErrorResponse;

export const registerAction = async (
  payload: IRegisterPayload,
  redirectPath?: string,
): Promise<RegisterActionResult> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }
  try {
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      parsedPayload.data,
    );

    const { accessToken, refreshToken, token } = response.data;
    await Promise.all([
      setTokenInCookies("accessToken", accessToken),
      setTokenInCookies("refreshToken", refreshToken),
      setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60), // 1 day in seconds
    ]);

    const targetPath = redirectPath || getDefaultDashboardRoute("CUSTOMER");
    return { success: true, redirectTo: targetPath };
  } catch (error: any) {
    if (
      error &&
      error.response &&
      error.response.data.message === "Email not verified"
    ) {
      return {
        success: true,
        redirectTo: `/verify-email?email=${payload.email}`,
      };
    }
    return {
      success: false,
      message: `Registration failed: ${error.message}`,
    };
  }
};
