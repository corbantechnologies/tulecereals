"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface PickupStation {
  name: string;
  location: string;
  shop: string;
  shop_details: {
    shop_code: string;
    name: string;
    currency: string;
    logo: string | null;
  };
  city: string;
  map_link: string;
  is_active: boolean;
  cost_to_customer: string;
  station_code: string;
  created_at: string;
  updated_at: string;
  estimated_delivery_days: number;
  reference: string;
}

interface createPickupStation {
  name: string;
  location: string;
  city: string;
  map_link: string;
  is_active: boolean;
  cost_to_customer: string;
  estimated_delivery_days: number;
}

interface updatePickupStation {
  name: string;
  location: string;
  city: string;
  map_link: string;
  is_active: boolean;
  cost_to_customer: string;
  estimated_delivery_days: number;
}

// Authenticated
export const getPickupStationsVendor = async (headers: {
  headers: { Authorization: string };
}): Promise<PickupStation[]> => {
  const response: AxiosResponse<PaginatedResponse<PickupStation>> =
    await apiActions.get(`/api/v1/pickupstations/`, headers);
  return response.data.results || [];
};

export const createPickupStation = async (
  data: createPickupStation,
  headers: { headers: { Authorization: string } },
): Promise<PickupStation> => {
  const response: AxiosResponse<PickupStation> = await apiActions.post(
    `/api/v1/pickupstations/`,
    data,
    headers,
  );
  return response.data;
};

export const updatePickupStation = async (
  station_code: string,
  data: updatePickupStation,
  headers: { headers: { Authorization: string } },
): Promise<PickupStation> => {
  const response: AxiosResponse<PickupStation> = await apiActions.patch(
    `/api/v1/pickupstations/${station_code}/`,
    data,
    headers,
  );
  return response.data;
};

export const deletePickupStation = async (
  station_code: string,
  headers: { headers: { Authorization: string } },
): Promise<PickupStation> => {
  const response: AxiosResponse<PickupStation> = await apiActions.delete(
    `/api/v1/pickupstations/${station_code}/`,
    headers,
  );
  return response.data;
};

// Public
export const getPickupStations = async (): Promise<PickupStation[]> => {
  const response: AxiosResponse<PaginatedResponse<PickupStation>> =
    await apiActions.get(`/api/v1/pickupstations/`);
  return response.data.results || [];
};

export const getPickupStation = async (
  station_code: string,
): Promise<PickupStation> => {
  const response: AxiosResponse<PickupStation> = await apiActions.get(
    `/api/v1/pickupstations/${station_code}/`,
  );
  return response.data;
};
