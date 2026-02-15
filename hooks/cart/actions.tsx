"use client";

import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/services/cart";
import useAxiosAuth from "../authentication/useAxiosAuth";

interface UseFetchCartOptions {
  enabled?: boolean;
}

export function useFetchCart(options: UseFetchCartOptions = {}) {
  // gets the cart data of the logged in user from the server
  const header = useAxiosAuth();
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(header),
    enabled: options.enabled ?? true,
  });
}
