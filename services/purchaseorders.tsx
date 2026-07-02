"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface PurchaseOrderItem {
  id: string;
  variant_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  cost_price: string;
  line_total: number;
}

export interface PurchaseOrder {
  id: string;
  reference: string;
  supplier_name: string;
  status: "DRAFT" | "ORDERED" | "RECEIVED" | "CANCELLED";
  order_date: string;
  expected_date: string | null;
  notes: string;
  total_amount: string;
  items: PurchaseOrderItem[];
}

export interface CreatePurchaseOrderItem {
  variant: string;
  quantity: number;
  cost_price: number;
}

export interface CreatePurchaseOrder {
  supplier_name: string;
  expected_date?: string;
  notes?: string;
  items: CreatePurchaseOrderItem[];
}

export const getPurchaseOrders = async (headers: {
  headers: { Authorization: string };
}): Promise<PurchaseOrder[]> => {
  const response: AxiosResponse<PaginatedResponse<PurchaseOrder>> =
    await apiActions.get(`/api/v1/purchaseorders/`, headers);
  return response.data.results || [];
};

export const createPurchaseOrder = async (
  data: CreatePurchaseOrder,
  headers: { headers: { Authorization: string } }
): Promise<PurchaseOrder> => {
  const response: AxiosResponse<PurchaseOrder> = await apiActions.post(
    `/api/v1/purchaseorders/`,
    data,
    headers
  );
  return response.data;
};

export const updatePurchaseOrderStatus = async (
  reference: string,
  status: "ORDERED" | "RECEIVED" | "CANCELLED",
  headers: { headers: { Authorization: string } }
): Promise<PurchaseOrder> => {
  const response: AxiosResponse<PurchaseOrder> = await apiActions.patch(
    `/api/v1/purchaseorders/${reference}/status/`,
    { status },
    headers
  );
  return response.data;
};
