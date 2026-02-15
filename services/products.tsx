/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { ProductVariant } from "./productvariants";

export interface Product {
  shop: string;
  shop_details: {
    shop_code: string;
    name: string;
    currency: string;
    logo: string | null;
  };
  product_code: string;
  name: string;
  description: string;
  is_active: boolean;
  features: {};
  images: {
    image: string;
    created_at: string;
    updated_at: string;
  }[];
  created_at: string;
  updated_at: string;
  tags: string[];
  reference: string;
  sub_category: {
    name: string;
    category: string;
    shop: string;
    is_active: boolean;
    reference: string;
    created_at: string;
    updated_at: string;
  }[];
  variants: ProductVariant[];
  available_options: string[];
  total_stock: number;
}

export interface createProduct {
  name: string;
  description: string;
  sub_categories: string[]; // sub category name
  tags: string[]; // tag names. As the vendor pleases
}

export interface addProductImages {
  uploaded_images: File[]; // can be multiple
}

export interface updateProduct {
  name: string;
  description: string;
  sub_categories: string[]; // sub category name
  tags: string[]; // tag names. As the vendor pleases
  is_active: boolean;
}

export const getProductsVendor = async (headers: {
  headers: { Authorization: string };
}): Promise<Product[]> => {
  const response: AxiosResponse<PaginatedResponse<Product>> =
    await apiActions.get(`/api/v1/products/`, headers);
  return response.data.results || [];
};

export const getProductVendor = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<Product> => {
  const response: AxiosResponse<Product> = await apiActions.get(
    `/api/v1/products/${reference}/`,
    headers,
  );
  return response.data;
};

export const createProduct = async (
  data: createProduct,
  headers: { headers: { Authorization: string } },
): Promise<Product> => {
  const response: AxiosResponse<Product> = await apiActions.post(
    `/api/v1/products/`,
    data,
    headers,
  );
  return response.data;
};

export const addProductImages = async (
  reference: string,
  data: addProductImages | FormData,
  headers: { headers: { Authorization: string } },
): Promise<Product> => {
  const response: AxiosResponse<Product> = await apiMultipartActions.patch(
    `/api/v1/products/${reference}/`,
    data,
    headers,
  );
  return response.data;
};

export const updateProduct = async (
  reference: string,
  data: updateProduct,
  headers: { headers: { Authorization: string } },
): Promise<Product> => {
  const response: AxiosResponse<Product> = await apiActions.patch(
    `/api/v1/products/${reference}/`,
    data,
    headers,
  );
  return response.data;
};

export const deleteProduct = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<Product> => {
  const response: AxiosResponse<Product> = await apiActions.delete(
    `/api/v1/products/${reference}/`,
    headers,
  );
  return response.data;
};

// Public Views

export const getProducts = async (): Promise<Product[]> => {
  const response: AxiosResponse<PaginatedResponse<Product>> =
    await apiActions.get(`/api/v1/products/`);
  return response.data.results || [];
};

export const getProduct = async (reference: string): Promise<Product> => {
  const response: AxiosResponse<Product> = await apiActions.get(
    `/api/v1/products/${reference}/`,
  );
  return response.data;
};
