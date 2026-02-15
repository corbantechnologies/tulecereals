/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Category } from "./categories";
import { apiActions, apiMultipartActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Shop {
  id: string;
  name: string;
  currency: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string;
  phone: string | null;
  email: string;
  shop_code: string;
  created_at: string;
  updated_at: string;
  reference: string;
  return_policy: string;
  shipping_policy: string;
  refund_policy: string;
  categories: Category[];
}

export interface updateShop {
  name: string;
  currency: string;
  description: string;
  logo: File | any;
  banner: File | any;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  email: string;
  return_policy: string;
  shipping_policy: string;
  refund_policy: string;
}

export const getShops = async (): Promise<Shop[]> => {
  const response: AxiosResponse<PaginatedResponse<Shop>> =
    await apiActions.get(`/api/v1/shops/`);
  return response.data.results || [];
};

export const getShop = async (shop_code: string): Promise<Shop> => {
  const response: AxiosResponse<Shop> = await apiActions.get(
    `/api/v1/shops/${shop_code}/`,
  );
  return response.data;
};

// Authenticated
export const updateShop = async (
  shop_code: string,
  data: updateShop | FormData,
  headers: { headers: { Authorization: string } },
): Promise<Shop> => {
  const response: AxiosResponse<Shop> = await apiMultipartActions.patch(
    `/api/v1/shops/${shop_code}/`,
    data,
    headers,
  );
  return response.data;
};
