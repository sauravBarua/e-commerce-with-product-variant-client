"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAddress } from "@/types/order.types";

export interface ICreateAddressPayload {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const getMyAddresses = async () => {
  return httpClient.get<IAddress[]>("/addresses/my");
};

export const createAddress = async (payload: ICreateAddressPayload) => {
  return httpClient.post<IAddress>("/addresses", payload);
};
