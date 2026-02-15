"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPickupStations,
  getPickupStation,
  getPickupStationsVendor,
} from "@/services/pickupstations";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchPickupStations() {
  return useQuery({
    queryKey: ["pickupstations"],
    queryFn: () => getPickupStations(),
    enabled: true,
  });
}

export function useFetchPickupStation(station_code: string) {
  return useQuery({
    queryKey: ["pickupstation", station_code],
    queryFn: () => getPickupStation(station_code),
    enabled: !!station_code,
  });
}

export function useFetchPickupStationsVendor() {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pickupstations"],
    queryFn: () => getPickupStationsVendor(headers),
    enabled: true,
  });
}
