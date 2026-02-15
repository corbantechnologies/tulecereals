"use client";

import { useQuery } from "@tanstack/react-query";
import { getShops, getShop } from "@/services/shops";

export function useFetchShops() {
    return useQuery({
        queryKey: ["shops"],
        queryFn: () => getShops(),
        enabled: true,
    });
}

export function useFetchShop(shop_code: string) {
    return useQuery({
        queryKey: ["shop", shop_code],
        queryFn: () => getShop(shop_code),
        enabled: !!shop_code,
    });
}