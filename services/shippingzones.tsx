"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface ShippingZone {
    id: number;
    name: string;
    description: string;
    delivery_cost: string;
    estimated_delivery_days: number;
    zone_code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface createShippingZone {
    name: string;
    description: string;
    delivery_cost: string;
    estimated_delivery_days: number;
    is_active: boolean;
}

export interface updateShippingZone {
    name: string;
    description: string;
    delivery_cost: string;
    estimated_delivery_days: number;
    is_active: boolean;
}

// Authenticated
export const getShippingZonesVendor = async (headers: {
  headers: { Authorization: string };
}): Promise<ShippingZone[]> => {
  const response: AxiosResponse<PaginatedResponse<ShippingZone>> =
    await apiActions.get(`/api/v1/shipping/`, headers);
  return response.data.results || [];
};

export const createShippingZone = async (
  data: createShippingZone,
  headers: { headers: { Authorization: string } },
): Promise<ShippingZone> => {
  const response: AxiosResponse<ShippingZone> = await apiActions.post(
    `/api/v1/shipping/`,
    data,
    headers,
  );
  return response.data;
};

export const updateShippingZone = async (
  zone_code: string,
  data: updateShippingZone,
  headers: { headers: { Authorization: string } },
): Promise<ShippingZone> => {
  const response: AxiosResponse<ShippingZone> = await apiActions.patch(
    `/api/v1/shipping/${zone_code}/`,
    data,
    headers,
  );
  return response.data;
};

export const deleteShippingZone = async (
  zone_code: string,
  headers: { headers: { Authorization: string } },
): Promise<ShippingZone> => {
  const response: AxiosResponse<ShippingZone> = await apiActions.delete(
    `/api/v1/shipping/${zone_code}/`,
    headers,
  );
  return response.data;
};

// Public
export const getShippingZones = async (): Promise<ShippingZone[]> => {
  const response: AxiosResponse<PaginatedResponse<ShippingZone>> =
    await apiActions.get(`/api/v1/shipping/`);
  return response.data.results || [];
};

export const getShippingZone = async (
  zone_code: string,
): Promise<ShippingZone> => {
  const response: AxiosResponse<ShippingZone> = await apiActions.get(
    `/api/v1/shipping/${zone_code}/`,
  );
  return response.data;
};
