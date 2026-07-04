"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface KPI {
  // Combined
  total_revenue: number;
  total_profit: number;
  profit_margin: number;
  total_orders: number;
  items_sold: number;
  average_order_value: number;
  // Breakdown
  online_revenue: number;
  online_orders: number;
  online_items_sold: number;
  pos_revenue: number;
  pos_sales: number;
  pos_items_sold: number;
}

export interface Sales {
  date: string;
  total_revenue: number;
  online_revenue: number;
  pos_revenue: number;
  online_orders: number;
  pos_sales: number;
}

export interface CashierPerformance {
  cashier_name: string;
  total_sales: number;
  total_revenue: number;
  average_sale_value: number;
  total_discount_given: number;
}

export interface AnalyticsParams {
  start_date?: string;
  end_date?: string;
  group_by?: string;
  days?: number;
}

// Combined KPI: /api/v1/possales/analytics/kpi/
export const getKPI = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<KPI> => {
  const response = await apiActions.get(
    `/api/v1/possales/analytics/kpi/`,
    { ...headers, params },
  );
  const data = response.data;
  return {
    ...data,
    total_revenue: Number(data.total_revenue) || 0,
    total_profit: Number(data.total_profit) || 0,
    profit_margin: Number(data.profit_margin) || 0,
    average_order_value: Number(data.average_order_value) || 0,
    online_revenue: Number(data.online_revenue) || 0,
    pos_revenue: Number(data.pos_revenue) || 0,
  };
};

// Combined chart: /api/v1/possales/analytics/sales-chart/
export const getSales = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<Sales[]> => {
  const response: AxiosResponse<Sales[]> = await apiActions.get(
    `/api/v1/possales/analytics/sales-chart/`,
    { ...headers, params },
  );
  return response.data;
};

// Cashier Performance: /api/v1/possales/analytics/cashier/
export const getCashierPerformance = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<CashierPerformance[]> => {
  const response = await apiActions.get(
    `/api/v1/possales/analytics/cashier/`,
    { ...headers, params },
  );
  return response.data.cashiers || [];
};


export interface DailyAnalyticsParams {
  date?: string;
}

export interface DailySummary {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
}

export interface TopSeller {
  variant_id: string;
  product_name: string;
  attributes: any;
  sku?: string;
  quantity_sold: number;
  revenue: number;
  remaining_stock?: number;
}

export interface DailyAnalyticsData {
  date: string;
  summary: DailySummary;
  top_sellers: TopSeller[];
}

export interface ShiftDiscrepancy {
  cashier_id: string;
  cashier_name: string;
  total_shifts: number;
  total_discrepancy: number;
  total_shortages: number;
  total_overages: number;
}

export interface ShiftDiscrepancyData {
  period: any;
  discrepancies: ShiftDiscrepancy[];
}

export interface TopSellersData {
  period: any;
  top_sellers: TopSeller[];
}

export interface InventoryAlert {
  variant_id: string;
  product_name: string;
  attributes: any;
  sku: string;
  stock: number;
  reorder_level: number;
  cost_price: number;
}

export interface InventoryData {
  total_valuation: number;
  low_stock_alerts: InventoryAlert[];
}

export interface PaymentMethod {
  payment_method: string;
  total_revenue: number;
  total_count: number;
}

export interface PaymentMethodsData {
  period: any;
  payment_methods: PaymentMethod[];
}

export interface TopCustomer {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  loyalty_points: number;
}

export interface CustomersData {
  total_loyalty_points_issued: number;
  top_customers: TopCustomer[];
}

export const getDailyAnalytics = async (
  headers: { headers: { Authorization: string } },
  params?: DailyAnalyticsParams,
): Promise<DailyAnalyticsData> => {
  const response = await apiActions.get(
    `/api/v1/possales/analytics/daily/`,
    { ...headers, params },
  );
  return response.data;
};

export const getShiftDiscrepancies = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<ShiftDiscrepancy[]> => {
  const response = await apiActions.get(
    `/api/v1/possales/analytics/shift-discrepancies/`,
    { ...headers, params },
  );
  return response.data.discrepancies || [];
};

export const getTopSellers = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<TopSeller[]> => {
  const response = await apiActions.get(
    `/api/v1/possales/analytics/top-sellers/`,
    { ...headers, params },
  );
  return response.data.top_sellers || [];
};

export const getInventoryAnalytics = async (
  headers: { headers: { Authorization: string } }
): Promise<InventoryData> => {
  const response = await apiActions.get(
    `/api/v1/possales/analytics/inventory/`,
    headers,
  );
  return response.data;
};

export const getPaymentMethodsAnalytics = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<PaymentMethod[]> => {
  const response = await apiActions.get(
    `/api/v1/possales/analytics/payment-methods/`,
    { ...headers, params },
  );
  return response.data.payment_methods || [];
};

export const getCustomersAnalytics = async (
  headers: { headers: { Authorization: string } }
): Promise<CustomersData> => {
  const response = await apiActions.get(
    `/api/v1/possales/analytics/customers/`,
    headers,
  );
  return response.data;
};

export const getBundleAnalytics = async (
  headers: { headers: { Authorization: string } }
) => {
  const response = await apiActions.get("/api/v1/possales/analytics/bundles/", headers);
  return response.data;
};
