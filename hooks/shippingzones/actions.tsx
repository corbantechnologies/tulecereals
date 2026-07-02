"use client";

import { useQuery } from "@tanstack/react-query";
import {
    getShippingZones,
    getShippingZone,
    getShippingZonesVendor,
} from "@/services/shippingzones";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchShippingZones() {
    return useQuery({
        queryKey: ["shippingzones"],
        queryFn: () => getShippingZones(),
        enabled: true,
    });
}

export function useFetchShippingZone(zone_code: string) {
    return useQuery({
        queryKey: ["shippingzone", zone_code],
        queryFn: () => getShippingZone(zone_code),
        enabled: !!zone_code,
    });
}

export function useFetchShippingZonesVendor() {
    const headers = useAxiosAuth();
    return useQuery({
        queryKey: ["shippingzones"],
        queryFn: () => getShippingZonesVendor(headers),
        enabled: true,
    });
}
