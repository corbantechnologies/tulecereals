"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts, getProduct, getProductsVendor, getProductVendor } from "@/services/products";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: () => getProducts(),
        enabled: true,
    });
}

export function useFetchProduct(reference: string) {
    return useQuery({
        queryKey: ["product", reference],
        queryFn: () => getProduct(reference),
        enabled: !!reference,
    });
}

// Vendor specific

export function useFetchProductsVendor() {
    const header = useAxiosAuth();
    return useQuery({
        queryKey: ["products-vendor"],
        queryFn: () => getProductsVendor(header),
        enabled: true,
    });
}

export function useFetchProductVendor(reference: string) {
    const header = useAxiosAuth();
    return useQuery({
        queryKey: ["product-vendor", reference],
        queryFn: () => getProductVendor(reference, header),
        enabled: !!reference,
    });
}