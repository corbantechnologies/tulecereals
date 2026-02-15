"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface CartItem {
  cart: string;
  variant: string;
  variant_name: string;
  variant_attributes: Record<string, string>;
  variant_shop: string;
  variant_sku: string;
  variant_price: number;
  variant_shop_code: string;
  variant_shop_currency: string;
  variant_image: string;
  quantity: number;
  sub_total: number;
  reference: string;
  created_at: string;
  updated_at: string;
}

interface addToCart {
  variant: string; // variant sku
  quantity: number;
}

interface updateCartItem {
  quantity: number;
}

export const addToCart = async (
  data: addToCart,
  headers: { headers: { Authorization: string } },
): Promise<CartItem> => {
  const response: AxiosResponse<CartItem> = await apiActions.post(
    `/api/v1/cartitems/`,
    data,
    headers,
  );
  return response.data;
};

export const getCartItems = async (headers: {
  headers: { Authorization: string };
}): Promise<CartItem[]> => {
  const response: AxiosResponse<PaginatedResponse<CartItem>> =
    await apiActions.get(`/api/v1/cartitems/`, headers);
  return response.data.results || [];
};

export const getCartItem = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<CartItem> => {
  const response: AxiosResponse<CartItem> = await apiActions.get(
    `/api/v1/cartitems/${reference}/`,
    headers,
  );
  return response.data;
};

export const updateCartItem = async (
  reference: string,
  data: updateCartItem,
  headers: { headers: { Authorization: string } },
): Promise<CartItem> => {
  const response: AxiosResponse<CartItem> = await apiActions.patch(
    `/api/v1/cartitems/${reference}/`,
    data,
    headers,
  );
  return response.data;
};

export const deleteCartItem = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<CartItem> => {
  const response: AxiosResponse<CartItem> = await apiActions.delete(
    `/api/v1/cartitems/${reference}/`,
    headers,
  );
  return response.data;
};
