"use client";

import { useQuery } from "@tanstack/react-query";
import { getCartItems, getCartItem } from "@/services/cartitems";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchCartItems() {
    const header = useAxiosAuth();
    return useQuery({
        queryKey: ["cartitems"],
        queryFn: () => getCartItems(header),
        enabled: true,
    });
}

export function useFetchCartItem(reference: string) {
    const header = useAxiosAuth();
    return useQuery({
        queryKey: ["cartitem", reference],
        queryFn: () => getCartItem(reference, header),
        enabled: !!reference,
    });
}

