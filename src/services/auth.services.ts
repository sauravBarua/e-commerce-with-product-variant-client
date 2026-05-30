"use server";

import { deleteCookie } from "@/lib/cookieUtils";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return false;
    }

    const { data } = await res.json();

    const { accessToken, refreshToken: newRefreshToken, token } = data;

    const cookiePromises = [];
    if (accessToken) {
      cookiePromises.push(setTokenInCookies("accessToken", accessToken));
    }
    if (newRefreshToken) {
      cookiePromises.push(setTokenInCookies("refreshToken", newRefreshToken));
    }
    if (token) {
      cookiePromises.push(
        setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60),
      ); // 1 day in seconds
    }
    await Promise.all(cookiePromises);

    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    const cookieHeader = [
      accessToken ? `accessToken=${accessToken}` : null,
      refreshToken ? `refreshToken=${refreshToken}` : null,
      sessionToken ? `better-auth.session_token=${sessionToken}` : null,
    ]
      .filter(Boolean)
      .join("; ");

    if (accessToken || refreshToken || sessionToken) {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (cookieHeader) {
          headers.Cookie = cookieHeader;
        }

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        await fetch(`${BASE_API_URL}/auth/logout`, {
          method: "POST",
          headers,
        });
      } catch (error) {
        console.error("Backend logout call failed:", error);
      }
    }

    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");
  } catch (error) {
    console.error("Error logging out:", error);
  }
  redirect("/login");
}
