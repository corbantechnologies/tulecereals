"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface WalkInCustomer {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  loyalty_points: number;
  total_spent: string;
  visit_count: number;
  created_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  transaction_type: "EARNED" | "REDEEMED" | "ADJUSTED";
  points: number;
  balance_after: number;
  sale_reference: string | null;
  notes: string | null;
  created_at: string;
}

export const getWalkInCustomers = async (
  search: string = "",
  headers: { headers: { Authorization: string } }
): Promise<WalkInCustomer[]> => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const response: AxiosResponse<PaginatedResponse<WalkInCustomer>> =
    await apiActions.get(`/api/v1/walkincustomers/${query}`, headers);
  return response.data.results || [];
};

export const lookupWalkInCustomer = async (
  phone: string,
  headers: { headers: { Authorization: string } }
): Promise<WalkInCustomer | null> => {
  try {
    const response: AxiosResponse<WalkInCustomer> = await apiActions.get(
      `/api/v1/walkincustomers/lookup/?phone=${encodeURIComponent(phone)}`,
      headers
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

export const createWalkInCustomer = async (
  data: {
    phone: string;
    name: string;
    email?: string;
  },
  headers: { headers: { Authorization: string } }
): Promise<WalkInCustomer> => {
  const response: AxiosResponse<WalkInCustomer> = await apiActions.post(
    `/api/v1/walkincustomers/`,
    data,
    headers
  );
  return response.data;
};

export const updateWalkInCustomer = async (
  id: string,
  data: Partial<WalkInCustomer>,
  headers: { headers: { Authorization: string } }
): Promise<WalkInCustomer> => {
  const response: AxiosResponse<WalkInCustomer> = await apiActions.patch(
    `/api/v1/walkincustomers/${id}/`,
    data,
    headers
  );
  return response.data;
};

export const getLoyaltyHistory = async (
  customerId: string,
  headers: { headers: { Authorization: string } }
): Promise<LoyaltyTransaction[]> => {
  const response: AxiosResponse<PaginatedResponse<LoyaltyTransaction>> =
    await apiActions.get(
      `/api/v1/walkincustomers/${customerId}/loyalty-history/`,
      headers
    );
  return response.data.results || [];
};

export const adjustLoyaltyPoints = async (
  customerId: string,
  data: { action: "ADD" | "SUBTRACT"; points: number; notes: string },
  headers: { headers: { Authorization: string } }
): Promise<{ message: string; customer: WalkInCustomer }> => {
  const response = await apiActions.post(
    `/api/v1/walkincustomers/${customerId}/adjust-points/`,
    data,
    headers
  );
  return response.data;
};
