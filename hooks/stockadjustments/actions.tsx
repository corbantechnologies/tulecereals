"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getInventory,
  getLowStock,
  getStockAdjustments,
} from "@/services/stockadjustments";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchInventory() {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory(headers),
  });
}

export function useFetchLowStock() {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["low-stock"],
    queryFn: () => getLowStock(headers),
  });
}

export function useFetchStockAdjustments() {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["stock-adjustments"],
    queryFn: () => getStockAdjustments(headers),
  });
}

