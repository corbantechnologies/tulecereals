"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface KPI {
  total_revenue: number;
  total_orders: number;
  items_sold: number;
  average_order_value: number;
  total_profit: number;
  profit_margin: number;
}

export interface Sales {
  date: string;
  revenue: number;
  order_count: number;
}

export interface AnalyticsParams {
  start_date?: string;
  end_date?: string;
  group_by?: string;
}

// /api/v1/shoporders/analytics/kpi/?start_date=2024-01-01&end_date=2024-01-31
export const getKPI = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<KPI> => {
  const response: AxiosResponse<KPI> = await apiActions.get(
    `/api/v1/shoporders/analytics/kpi/`,
    { ...headers, params },
  );
  return response.data;
};

// Groupings
// group_by: string; month, year, day
// start_date: string;
// end_date: string;

// /api/v1/shoporders/analytics/sales-chart/?group_by=month&start_date=2024-01-01&end_date=2024-12-31
export const getSales = async (
  headers: { headers: { Authorization: string } },
  params?: AnalyticsParams,
): Promise<Sales[]> => {
  const response: AxiosResponse<PaginatedResponse<Sales>> =
    await apiActions.get(`/api/v1/shoporders/analytics/sales-chart/`, {
      ...headers,
      params,
    });
  return response.data.results || [];
};
