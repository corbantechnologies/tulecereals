/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface ProductVariant {
  id: string;
  product: string;
  product_name: string;
  attributes: {};
  price: string;
  cost_price: string;
  discounted_price: string | null;
  stock: number;
  sku: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  reference: string;
}

export interface createProductVariant {
  product: string; // the product_code
  attributes: {};
  price: string;
  cost_price: string;
  discounted_price: string | null;
  stock: number;
  image: File | null; // can be null. Restricted to one image as there are already images in the product
}

export interface updateProductVariant {
  product: string;
  attributes: {};
  price: string;
  cost_price: string;
  discounted_price: string | null;
  stock: number;
  image: File | null;
}

export const getProductVariants = async (headers: {
  headers: { Authorization: string };
}): Promise<ProductVariant[]> => {
  const response: AxiosResponse<PaginatedResponse<ProductVariant>> =
    await apiActions.get(`/api/v1/productvariants/`, headers);
  return response.data.results || [];
};

export const getProductVariant = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<ProductVariant> => {
  const response: AxiosResponse<ProductVariant> = await apiActions.get(
    `/api/v1/productvariants/${reference}/`,
    headers,
  );
  return response.data;
};

export const createProductVariant = async (
  data: createProductVariant | FormData,
  headers: { headers: { Authorization: string } },
): Promise<ProductVariant> => {
  const response: AxiosResponse<ProductVariant> =
    await apiMultipartActions.post(`/api/v1/productvariants/`, data, headers);
  return response.data;
};

export const updateProductVariant = async (
  reference: string,
  data: updateProductVariant | FormData,
  headers: { headers: { Authorization: string } },
): Promise<ProductVariant> => {
  const response: AxiosResponse<ProductVariant> =
    await apiMultipartActions.patch(
      `/api/v1/productvariants/${reference}/`,
      data,
      headers,
    );
  return response.data;
};

export const deleteProductVariant = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<ProductVariant> => {
  const response: AxiosResponse<ProductVariant> = await apiActions.delete(
    `/api/v1/productvariants/${reference}/`,
    headers,
  );
  return response.data;
};


// Public
export const getProductVariantsPublic = async (): Promise<ProductVariant[]> => {
  const response: AxiosResponse<PaginatedResponse<ProductVariant>> =
    await apiActions.get(`/api/v1/productvariants/`);
  return response.data.results || [];
};

export const getProductVariantPublic = async (
  reference: string,
): Promise<ProductVariant> => {
  const response: AxiosResponse<ProductVariant> = await apiActions.get(
    `/api/v1/productvariants/${reference}/`,
  );
  return response.data;
};
