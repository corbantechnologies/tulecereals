"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface POSSaleItem {
  id: string;
  variant: string;
  product_name: string;
  variant_sku: string;
  variant_attributes: Record<string, string>;
  quantity: number;
  price: string;
  cost_price: string;
  discount_amount: string;
  bundle: string | null;
  line_total: number;
  line_profit: number;
}

export interface POSSalePayment {
  id: string;
  payment_method: "CASH" | "MPESA_STK" | "MPESA_MANUAL" | "CARD" | "LOYALTY_POINTS" | "OTHER";
  amount: string;
  mpesa_reference: string | null;
  created_at: string;
}

export interface POSSale {
  id: string;
  reference: string;
  shop_name: string;
  served_by_name: string;
  walk_in_customer: string | null; // Customer ID
  customer_name: string | null;
  mpesa_phone_number: string | null;
  checkout_request_id: string | null;
  mpesa_receipt_number: string | null;
  mpesa_stk_status: "PENDING" | "COMPLETED" | "FAILED" | null;
  payment_method: "SPLIT" | "CASH" | "MPESA_STK" | "MPESA_MANUAL" | "CARD" | "LOYALTY_POINTS" | "OTHER";
  subtotal: string;
  discount_amount: string;
  tax_amount: string;
  total_amount: string;
  total_profit: number;
  loyalty_points_earned: number;
  loyalty_points_redeemed: number;
  status: "COMPLETED" | "HELD" | "VOIDED";
  notes: string | null;
  sale_date: string;
  created_at: string;
  updated_at: string;
  items: POSSaleItem[];
  payments: POSSalePayment[];
}

export interface POSSaleReceipt {
  reference: string;
  shop_name: string;
  shop_address: string | null;
  shop_phone: string | null;
  shop_tax_rate: string;
  served_by_name: string;
  customer_name: string | null;
  payment_method: string;
  subtotal: string;
  discount_amount: string;
  tax_amount: string;
  total_amount: string;
  loyalty_points_earned: number;
  loyalty_points_redeemed: number;
  status: string;
  sale_date: string;
  items: POSSaleItem[];
  payments: POSSalePayment[];
}

export interface CreatePOSSaleItem {
  variant?: string; // Optional if bundle is provided
  bundle?: string;  // Optional if variant is provided
  quantity: number;
  discount_amount?: number;
}

export interface CreatePOSSalePayment {
  payment_method: "CASH" | "MPESA_MANUAL" | "CARD" | "LOYALTY_POINTS" | "OTHER";
  amount: number;
  mpesa_reference?: string;
}

export interface CreatePOSSale {
  items: CreatePOSSaleItem[];
  bundle_ids?: string[];
  payment_method: "SPLIT" | "CASH" | "MPESA_STK" | "MPESA_MANUAL" | "CARD" | "LOYALTY_POINTS" | "OTHER";
  payments?: CreatePOSSalePayment[];
  walk_in_customer?: string;
  customer_name?: string; // Fallback for quick sales without registering
  customer_phone?: string;
  mpesa_reference?: string;
  mpesa_phone_number?: string;
  discount_amount?: number;
  loyalty_points_to_redeem?: number;
  notes?: string;
}

export interface POSProduct {
  variant_id: string;
  sku: string;
  product_name: string;
  attributes: Record<string, string>;
  price: number;
  cost_price: number;
  stock: number;
  reorder_level: number;
  is_low_stock: boolean;
  image_url: string | null;
}

export const getPOSSales = async (headers: {
  headers: { Authorization: string };
}): Promise<POSSale[]> => {
  const response: AxiosResponse<PaginatedResponse<POSSale>> =
    await apiActions.get(`/api/v1/possales/`, headers);
  return response.data.results || [];
};

export const getPOSSale = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<POSSale> => {
  const response: AxiosResponse<POSSale> = await apiActions.get(
    `/api/v1/possales/${reference}/`,
    headers,
  );
  return response.data;
};

export const createPOSSale = async (
  data: CreatePOSSale,
  headers: { headers: { Authorization: string } },
): Promise<POSSale> => {
  const response: AxiosResponse<POSSale> = await apiActions.post(
    `/api/v1/possales/`,
    data,
    headers,
  );
  return response.data;
};

export const voidPOSSale = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<{ message: string; reference: string; status: string }> => {
  const response = await apiActions.patch(
    `/api/v1/possales/${reference}/void/`,
    {},
    headers,
  );
  return response.data;
};

export const holdPOSSale = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<{ message: string; reference: string; status: string }> => {
  const response = await apiActions.patch(
    `/api/v1/possales/${reference}/hold/`,
    {},
    headers,
  );
  return response.data;
};

export const resumePOSSale = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<{ message: string; reference: string; status: string }> => {
  const response = await apiActions.patch(
    `/api/v1/possales/${reference}/resume/`,
    {},
    headers,
  );
  return response.data;
};

export const getPOSSaleReceipt = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<POSSaleReceipt> => {
  const response: AxiosResponse<POSSaleReceipt> = await apiActions.get(
    `/api/v1/possales/${reference}/receipt/`,
    headers,
  );
  return response.data;
};

export const sendPOSSaleReceiptEmail = async (
  reference: string,
  email: string | undefined,
  headers: { headers: { Authorization: string } },
): Promise<{ message: string }> => {
  const response = await apiActions.post(
    `/api/v1/possales/${reference}/send-receipt/`,
    { email },
    headers,
  );
  return response.data;
};

export const downloadPOSSaleReceiptPdf = async (
  reference: string,
  headers: { headers: { Authorization: string } },
): Promise<Blob> => {
  const response = await apiActions.get(
    `/api/v1/possales/${reference}/download-receipt/`,
    {
      ...headers,
      responseType: 'blob',
    },
  );
  return response.data;
};

export const triggerMpesaSTKPush = async (
  reference: string,
  phoneNumber: string,
  headers: { headers: { Authorization: string } },
): Promise<{ message: string; checkout_request_id: string; customer_message: string }> => {
  const response = await apiActions.post(
    `/api/v1/possales/${reference}/mpesa-stk/`,
    { phone_number: phoneNumber },
    headers,
  );
  return response.data;
};

export const searchPOSProducts = async (
  search: string,
  inStockOnly: boolean,
  headers: { headers: { Authorization: string } },
): Promise<POSProduct[]> => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (inStockOnly) params.append("in_stock", "true");
  const response: AxiosResponse<POSProduct[]> = await apiActions.get(
    `/api/v1/possales/products/?${params.toString()}`,
    headers,
  );
  return response.data;
};

export const lookupPOSSku = async (
  sku: string,
  headers: { headers: { Authorization: string } },
): Promise<{ found: boolean; variant?: POSProduct; message?: string }> => {
  const response = await apiActions.get(
    `/api/v1/possales/lookup/?sku=${encodeURIComponent(sku)}`,
    headers,
  );
  return response.data;
};
