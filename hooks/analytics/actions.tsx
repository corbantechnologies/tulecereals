"use client";

import { useQuery } from "@tanstack/react-query";
import { getKPI, getSales, getCashierPerformance, AnalyticsParams,
  getDailyAnalytics,
  getShiftDiscrepancies,
  getTopSellers,
  getInventoryAnalytics,
  getPaymentMethodsAnalytics,
  getCustomersAnalytics,
  getBundleAnalytics,
  DailyAnalyticsParams,
} from "@/services/analytics";
import useAxiosAuth from "../authentication/useAxiosAuth";

export const useKPI = (params?: AnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["kpi", params],
    queryFn: () => getKPI(headers, params),
  });
};

export const useSales = (params?: AnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["sales", params],
    queryFn: () => getSales(headers, params),
  });
};

export const useCashierPerformance = (params?: AnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["cashierPerformance", params],
    queryFn: () => getCashierPerformance(headers, params),
  });
};


export const useDailyAnalytics = (params?: DailyAnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["dailyAnalytics", params],
    queryFn: () => getDailyAnalytics(headers, params),
  });
};

export const useShiftDiscrepancies = (params?: AnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["shiftDiscrepancies", params],
    queryFn: () => getShiftDiscrepancies(headers, params),
  });
};

export const useTopSellers = (params?: AnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["topSellers", params],
    queryFn: () => getTopSellers(headers, params),
  });
};

export const useInventoryAnalytics = () => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["inventoryAnalytics"],
    queryFn: () => getInventoryAnalytics(headers),
  });
};

export const usePaymentMethodsAnalytics = (params?: AnalyticsParams) => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["paymentMethodsAnalytics", params],
    queryFn: () => getPaymentMethodsAnalytics(headers, params),
  });
};

export const useCustomersAnalytics = () => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["customersAnalytics"],
    queryFn: () => getCustomersAnalytics(headers),
  });
};

export const useBundleAnalytics = () => {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["bundleAnalytics"],
    queryFn: () => getBundleAnalytics(headers),
  });
};
