"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getWalkInCustomers,
  lookupWalkInCustomer,
  getLoyaltyHistory,
} from "@/services/walkincustomers";
import useAxiosAuth from "../authentication/useAxiosAuth";

export const useFetchWalkInCustomers = (search: string = "") => {
  const headers = useAxiosAuth()

  return useQuery({
    queryKey: ["walkincustomers", search],
    queryFn: () => getWalkInCustomers(search, headers),
    enabled: !!headers,
  });
};

export const useLookupCustomer = (phone: string) => {
  const headers = useAxiosAuth()

  return useQuery({
    queryKey: ["customerLookup", phone],
    queryFn: () => lookupWalkInCustomer(phone, headers),
    enabled: !!headers && !!phone && phone.length >= 9,
    retry: false,
  });
};

export const useFetchLoyaltyHistory = (customerId: string) => {
  const headers = useAxiosAuth()

  return useQuery({
    queryKey: ["loyaltyHistory", customerId],
    queryFn: () => getLoyaltyHistory(customerId, headers),
    enabled: !!headers && !!customerId,
  });
};

