/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
// for the vendors

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface ShopOrder {
  id: string;
  reference: string;
  order_reference: string;
  shop_name: string;
  status: string;
  tracking_number: string;
  vendor_notes: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: Array<ShopOrderItem>;
  created_at: string;
  updated_at: string;
}

export interface ShopOrderItem {
  id: string;
  order: string;
  variant: string;
  variant_sku: string;
  variant_price: string;
  quantity: number;
  price: string;
  created_at: string;
  updated_at: string;
  reference: string | null;
}

export interface ShopOrderUpdate {
  status: string;
  vendor_notes: string;
}

export const getShopOrders = async (headers: {
  headers: { Authorization: string };
}): Promise<ShopOrder[]> => {
  const response: AxiosResponse<PaginatedResponse<ShopOrder>> =
    await apiActions.get(`/api/v1/shoporders/`, headers);
  return response.data.results || [];
};

export const getShopOrder = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<ShopOrder> => {
  const response: AxiosResponse<ShopOrder> = await apiActions.get(
    `/api/v1/shoporders/${reference}/`,
    headers,
  );
  return response.data;
};

export const updateShopOrder = async (
  reference: string,
  data: ShopOrderUpdate,
  headers: { headers: { Authorization: string } },
): Promise<ShopOrder> => {
  const response: AxiosResponse<ShopOrder> = await apiActions.patch(
    `/api/v1/shoporders/${reference}/`,
    data,
    headers,
  );
  return response.data;
};
