"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface InventoryItem {
  variant_id: string;
  sku: string;
  product_name: string;
  attributes: Record<string, string>;
  price: number;
  cost_price: number;
  stock: number;
  reorder_level: number;
  is_low_stock: boolean;
}

export interface LowStockItem {
  variant_id: string;
  sku: string;
  product_name: string;
  attributes: Record<string, string>;
  stock: number;
  reorder_level: number;
  units_below_reorder: number;
}

export interface StockAdjustment {
  id: string;
  reference: string;
  variant: string;
  variant_name: string;
  variant_sku: string;
  adjusted_by_name: string;
  quantity_change: number;
  reason: string;
  reason_display: string;
  notes: string | null;
  stock_before: number;
  stock_after: number;
  created_at: string;
}

export interface CreateStockAdjustment {
  variant: string; // UUID
  quantity_change: number;
  reason: "RESTOCK" | "DAMAGE" | "CORRECTION" | "RETURN" | "OTHER";
  notes?: string;
}

export const getInventory = async (headers: {
  headers: { Authorization: string };
}): Promise<InventoryItem[]> => {
  const response: AxiosResponse<InventoryItem[]> = await apiActions.get(
    `/api/v1/stockadjustments/inventory/`,
    headers,
  );
  return response.data;
};

export const getLowStock = async (headers: {
  headers: { Authorization: string };
}): Promise<LowStockItem[]> => {
  const response: AxiosResponse<LowStockItem[]> = await apiActions.get(
    `/api/v1/stockadjustments/low-stock/`,
    headers,
  );
  return response.data;
};

export const getStockAdjustments = async (headers: {
  headers: { Authorization: string };
}): Promise<StockAdjustment[]> => {
  const response: AxiosResponse<PaginatedResponse<StockAdjustment>> =
    await apiActions.get(`/api/v1/stockadjustments/`, headers);
  return response.data.results || [];
};

export const createStockAdjustment = async (
  data: CreateStockAdjustment,
  headers: { headers: { Authorization: string } },
): Promise<StockAdjustment> => {
  const response: AxiosResponse<StockAdjustment> = await apiActions.post(
    `/api/v1/stockadjustments/`,
    data,
    headers,
  );
  return response.data;
};
