"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getPOSShifts,
  getCurrentShift,
} from "@/services/posshifts";
import useAxiosAuth from "../authentication/useAxiosAuth";

export const useFetchPOSShifts = () => {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["posshifts"],
    queryFn: () => getPOSShifts(token),
    enabled: !!token,
  });
};

export const useFetchCurrentShift = () => {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["currentShift"],
    queryFn: () => getCurrentShift(token),
    enabled: !!token,
    retry: false,
  });
};


