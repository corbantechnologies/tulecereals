"use client";

import { useQuery } from "@tanstack/react-query";
import { getShopOrders, getShopOrder } from "@/services/shoporders";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchShopOrders() {
  const header = useAxiosAuth();
  return useQuery({
    queryKey: ["shoporders"],
    queryFn: () => getShopOrders(header),
    enabled: true,
  });
}

export function useFetchShopOrder(reference: string) {
  const header = useAxiosAuth();
  return useQuery({
    queryKey: ["shoporder", reference],
    queryFn: () => getShopOrder(reference, header),
    enabled: !!reference,
  });
}
