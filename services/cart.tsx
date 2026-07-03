"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { CartItem } from "./cartitems";

export interface Cart {
  customer: string;
  customer_name: string;
  customer_email: string;
  reference: string;
  items: CartItem[];
  grand_total: number;
  created_at: string;
  updated_at: string;
}

interface checkoutCart {
  pickup_station: string; // station code
  phone_number: string; // pick the customer's number if available, else ask for it
}

export const getCart = async (headers: {
  headers: { Authorization: string };
}): Promise<Cart> => {
  const response: AxiosResponse<Cart> = await apiActions.get(
    `/api/v1/cart/`,
    headers,
  );
  return response.data;
};

export interface CheckoutResponse {
  message: string;
  order_id: string;
  order_reference: string;
  total_amount: number;
  status: string;
}

export const checkoutCart = async (
  data: checkoutCart,
  headers: { headers: { Authorization: string } },
): Promise<CheckoutResponse> => {
  const response: AxiosResponse<CheckoutResponse> = await apiActions.post(
    `/api/v1/orders/checkout/`,
    data,
    headers,
  );
  return response.data;
};
