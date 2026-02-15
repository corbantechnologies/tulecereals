"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { SubCategory } from "./subcategories";

export interface Category {
  reference: string;
  name: string;
  is_active: boolean;
  shop: string;
  shop_details: {
    shop_code: string;
    name: string;
    currency: string;
    logo: string | null;
  };
  created_at: string;
  updated_at: string;
  subcategories: SubCategory[];
}

interface createCategory {
  name: string;
  is_active: boolean;
}

interface updateCategory {
  name: string;
  is_active: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  const response: AxiosResponse<PaginatedResponse<Category>> =
    await apiActions.get(`/api/v1/categories/`);
  return response.data.results || [];
};


export const getCategory = async (reference: string): Promise<Category> => {
  const response: AxiosResponse<Category> = await apiActions.get(
    `/api/v1/categories/${reference}/`,
  );
  return response.data;
};

// Authenticated
export const getCategoriesVendor = async (headers: {
  headers: { Authorization: string };
}): Promise<Category[]> => {
  const response: AxiosResponse<PaginatedResponse<Category>> =
    await apiActions.get(`/api/v1/categories/`, headers);
  return response.data.results || [];
};

export const getCategoryVendor = async (reference: string, headers: {
  headers: { Authorization: string };
}): Promise<Category> => {
  const response: AxiosResponse<Category> = await apiActions.get(
    `/api/v1/categories/${reference}/`,
    headers,
  );
  return response.data;
};


export const createCategory = async (
  data: createCategory,
  headers: { headers: { Authorization: string } },
): Promise<Category> => {
  const response: AxiosResponse<Category> = await apiActions.post(
    `/api/v1/categories/`,
    data,
    headers,
  );
  return response.data;
};

export const updateCategory = async (
  reference: string,
  data: updateCategory,
  headers: { headers: { Authorization: string } },
): Promise<Category> => {
  const response: AxiosResponse<Category> = await apiActions.patch(
    `/api/v1/categories/${reference}/`,
    data,
    headers,
  );
  return response.data;
};

export const deleteCategory = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<Category> => {
  const response: AxiosResponse<Category> = await apiActions.delete(
    `/api/v1/categories/${reference}/`,
    headers,
  );
  return response.data;
};
