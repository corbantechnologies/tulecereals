"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPOSBundles,
  getPOSBundle,
  createPOSBundle,
  deletePOSBundle,
} from "@/services/posbundles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";

export const useFetchPOSBundles = (activeOnly: boolean = false) => {
  const header = useAxiosAuth()

  return useQuery({
    queryKey: ["posbundles", activeOnly],
    queryFn: () => getPOSBundles(activeOnly, header),
    enabled: !!header,
  });
};

export const useFetchPOSBundle = (id: string) => {
  const header = useAxiosAuth()

  return useQuery({
    queryKey: ["posbundles", id],
    queryFn: () => getPOSBundle(id, header),
    enabled: !!header && !!id,
  });
};

export const useCreatePOSBundle = () => {
  const header = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createPOSBundle(data, header),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posbundles"] });
    },
  });
};

export const useDeletePOSBundle = () => {
  const header = useAxiosAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePOSBundle(id, header),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posbundles"] });
    },
  });
};