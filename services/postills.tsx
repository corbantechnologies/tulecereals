"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface POSTill {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export const getPOSTills = async (headers: {
  headers: { Authorization: string };
}): Promise<POSTill[]> => {
  const response: AxiosResponse<PaginatedResponse<POSTill>> =
    await apiActions.get(`/api/v1/postills/`, headers);
  return response.data.results || [];
};

export const getPOSTill = async (id: string, headers: {
  headers: { Authorization: string };
}): Promise<POSTill> => {
  const response: AxiosResponse<POSTill> = await apiActions.get(
    `/api/v1/postills/${id}/`, headers
  );
  return response.data;
};

export const createPOSTill = async (
  data: { name: string },
  headers: { headers: { Authorization: string } }
): Promise<POSTill> => {
  const response: AxiosResponse<POSTill> = await apiActions.post(
    `/api/v1/postills/`,
    data,
    headers
  );
  return response.data;
};

export const updatePOSTill = async (
  id: string,
  data: { name?: string; is_active?: boolean },
  headers: { headers: { Authorization: string } }
): Promise<POSTill> => {
  const response: AxiosResponse<POSTill> = await apiActions.patch(
    `/api/v1/postills/${id}/`,
    data,
    headers
  );
  return response.data;
};

export const deletePOSTill = async (
  id: string,
  headers: { headers: { Authorization: string } }
): Promise<void> => {
  await apiActions.delete(`/api/v1/postills/${id}/`, headers);
};
