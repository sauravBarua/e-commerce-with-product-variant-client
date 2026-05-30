/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }
  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, emailVerified, needPasswordChange, email } = user;
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds

    if (!emailVerified) {
      redirect("/verify-email");
    } else if (needPasswordChange) {
      // in the catch block

      //TODO : refactoring
      redirect(`/reset-password?email=${email}`);
    } else {
      // redirect(redirectPath || "/dashboard");
      const targetPath =
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);

      redirect(targetPath);
    }
  } catch (error: any) {
    // check for redirect FIRST, before logging
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    // console.log(error, "error"); // now only logs real errors

    // if (
    //   error &&
    //   error.response &&
    //   error.response.data?.message?.includes("Email not verified")
    // ) {
    //   redirect(`/verify-email?email=${payload.email}`);
    // }
    // return {
    //   success: false,
    //   message: `Login failed: ${error.message}`,
    // };
    if (
      error &&
      error.response?.status === 403 &&
      error.response?.data?.message
        ?.toLowerCase()
        .includes("email not verified")
    ) {
      redirect(`/verify-email?email=${encodeURIComponent(payload.email)}`);
    }

    return {
      success: false,
      message: `Login failed: ${error.message}`,
    };
  }
};
