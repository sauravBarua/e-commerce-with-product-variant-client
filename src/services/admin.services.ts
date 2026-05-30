"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { type IAdmin, type IUpdateAdminPayload } from "@/types/admin.types";

export const getAllAdmins = async (queryString?: string) => {
  try {
    return await httpClient.get<IAdmin[]>(
      queryString ? `/admins?${queryString}` : "/admins",
    );
  } catch (error) {
    console.log("Error fetching admins:", error);
    throw error;
  }
};

export const getAdminById = async (id: string) => {
  try {
    return await httpClient.get<IAdmin>(`/admins/${id}`);
  } catch (error) {
    console.log("Error fetching admin by id:", error);
    throw error;
  }
};

export const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  try {
    return await httpClient.patch<IAdmin>(`/admins/${id}`, payload);
  } catch (error) {
    console.log("Error updating admin:", error);
    throw error;
  }
};

export const deleteAdmin = async (id: string) => {
  try {
    return await httpClient.delete<{ message: string }>(`/admins/${id}`);
  } catch (error) {
    console.log("Error deleting admin:", error);
    throw error;
  }
};
