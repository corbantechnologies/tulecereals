"use client";

import { useQuery } from "@tanstack/react-query";
import { getPurchaseOrders } from "@/services/purchaseorders";
import useAxiosAuth from "../authentication/useAxiosAuth";

export const useFetchPurchaseOrders = () => {
  const headers = useAxiosAuth()

  return useQuery({
    queryKey: ["purchaseorders"],
    queryFn: () => getPurchaseOrders(headers),
    enabled: !!headers,
  });
};

