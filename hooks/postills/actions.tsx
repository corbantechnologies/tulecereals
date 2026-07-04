"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPOSTills,
  getPOSTill
} from "@/services/postills";
import useAxiosAuth from "../authentication/useAxiosAuth";

export const useFetchPOSTills = () => {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["postills"],
    queryFn: () => getPOSTills(header),
  });
};

export const useFetchPOSTill = (id: string) => {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["postill", id],
    queryFn: () => getPOSTill(id, header),
    enabled: !!id,
  });
};
