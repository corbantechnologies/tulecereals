"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { Product } from "./products";

export interface SubCategory {
  name: string;
  category: string;
  shop: string;
  shop_details: {
    shop_code: string;
    name: string;
    currency: string;
    logo: string | null;
  };
  is_active: boolean;
  reference: string;
  created_at: string;
  updated_at: string;
  products: Product[];
}

interface createSubCategory {
  name: string;
  category: string;
  is_active: boolean;
}

interface updateSubCategory {
  name: string;
  category: string;
  is_active: boolean;
}

export const getSubCategoriesVendor = async (headers: {
  headers: { Authorization: string };
}): Promise<SubCategory[]> => {
  const response: AxiosResponse<PaginatedResponse<SubCategory>> =
    await apiActions.get(`/api/v1/subcategories/`, headers);
  return response.data.results || [];
};

export const getSubCategoryVendor = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<SubCategory> => {
  const response: AxiosResponse<SubCategory> = await apiActions.get(
    `/api/v1/subcategories/${reference}/`,
    headers,
  );
  return response.data;
};

export const createSubCategory = async (
  data: createSubCategory,
  headers: { headers: { Authorization: string } },
): Promise<SubCategory> => {
  const response: AxiosResponse<SubCategory> = await apiActions.post(
    `/api/v1/subcategories/`,
    data,
    headers,
  );
  return response.data;
};

export const updateSubCategory = async (
  reference: string,
  data: updateSubCategory,
  headers: { headers: { Authorization: string } },
): Promise<SubCategory> => {
  const response: AxiosResponse<SubCategory> = await apiActions.patch(
    `/api/v1/subcategories/${reference}/`,
    data,
    headers,
  );
  return response.data;
};

export const deleteSubCategory = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<SubCategory> => {
  const response: AxiosResponse<SubCategory> = await apiActions.delete(
    `/api/v1/subcategories/${reference}/`,
    headers,
  );
  return response.data;
};


// Public
export const getSubCategories = async (): Promise<SubCategory[]> => {
  const response: AxiosResponse<PaginatedResponse<SubCategory>> =
    await apiActions.get(`/api/v1/subcategories/`);
  return response.data.results || [];
};

export const getSubCategory = async (
  reference: string,
): Promise<SubCategory> => {
  const response: AxiosResponse<SubCategory> = await apiActions.get(
    `/api/v1/subcategories/${reference}/`,
  );
  return response.data;
};