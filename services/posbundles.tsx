"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface POSBundleItem {
  id: string;
  variant_id: string;
  product_name: string;
  sku: string;
  quantity: number;
}

export interface POSBundle {
  id: string;
  name: string;
  description: string;
  price: string;
  is_active: boolean;
  image: string | null;
  items: POSBundleItem[];
}

export const getPOSBundles = async (
  activeOnly: boolean = false,
  headers: { headers: { Authorization: string } }
): Promise<POSBundle[]> => {
  const query = activeOnly ? `?is_active=true` : "";
  const response = await apiActions.get(`/api/v1/posbundles/${query}`, headers);
  return Array.isArray(response.data) ? response.data : response.data?.results || [];
};

export const getPOSBundle = async (
  id: string,
  headers: { headers: { Authorization: string } }
): Promise<POSBundle> => {
  const response: AxiosResponse<POSBundle> =
    await apiActions.get(`/api/v1/posbundles/${id}/`, headers);
  return response.data;
};

export const createPOSBundle = async (
  data: FormData | any,
  headers: { headers: { Authorization: string } }
): Promise<POSBundle> => {
  const response: AxiosResponse<POSBundle> = await apiActions.post(
    `/api/v1/posbundles/`,
    data,
    headers
  );
  return response.data;
};

export const updatePOSBundle = async (
  id: string,
  data: FormData | any,
  headers: { headers: { Authorization: string } }
): Promise<POSBundle> => {
  const response: AxiosResponse<POSBundle> = await apiActions.patch(
    `/api/v1/posbundles/${id}/`,
    data,
    headers
  );
  return response.data;
};

export const deletePOSBundle = async (
  id: string,
  headers: { headers: { Authorization: string } }
): Promise<void> => {
  await apiActions.delete(`/api/v1/posbundles/${id}/`, headers);
};
