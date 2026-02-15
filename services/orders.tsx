// for the customers

"use client";
import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Order {
  id: string;
  reference: string;
  customer: string;
  pickup_station: string;
  pickup_station_name: string;
  delivery_cost: string;
  total_amount: string;
  phone_number: string;
  shipping_address: string;
  status: string;
  created_at: string;
  updated_at: string;
  checkout_request_id: string | null;
  callback_url: string | null;
  payment_status: string;
  payment_status_description: string | null;
  confirmation_code: string | null;
  payment_account: string | null;
  payment_date: string | null;
  mpesa_receipt_number: string | null;
  mpesa_phone_number: string | null;
  items: OrderItem[];
  shop_orders: ShopOrder[];
}

export interface OrderItem {
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

export interface ShopOrder {
  shop_name: string;
  shop_logo: string | null;
  status: string;
  tracking_number: string;
  items: ShopOrderItem[];
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

export const getOrders = async (
  headers: { headers: { Authorization: string } },
  params?: { page?: number; status?: string },
): Promise<PaginatedResponse<Order>> => {
  const response: AxiosResponse<PaginatedResponse<Order>> =
    await apiActions.get(`/api/v1/orders/`, {
      ...headers,
      params,
    });
  return response.data;
};

export const getOrder = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<Order> => {
  const response: AxiosResponse<Order> = await apiActions.get(
    `/api/v1/orders/${reference}/`,
    headers,
  );
  return response.data;
};
