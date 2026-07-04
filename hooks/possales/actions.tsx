"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPOSSales,
  getPOSSale,
  getPOSSaleReceipt,
  searchPOSProducts,
  lookupPOSSku,
  sendPOSSaleReceiptEmail,
  downloadPOSSaleReceiptPdf,
} from "@/services/possales";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchPOSSales() {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-sales"],
    queryFn: () => getPOSSales(headers),
  });
}

export function useEmailPOSSaleReceipt() {
  const headers = useAxiosAuth();
  
  return useMutation({
    mutationFn: ({ reference, email }: { reference: string; email?: string }) =>
      sendPOSSaleReceiptEmail(reference, email, headers),
  });
}

export function useDownloadPOSSaleReceiptPdf() {
  const headers = useAxiosAuth();
  
  return useMutation({
    mutationFn: (reference: string) => downloadPOSSaleReceiptPdf(reference, headers),
  });
}

export function useFetchPOSSale(reference: string, pollInterval?: number) {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-sale", reference],
    queryFn: () => getPOSSale(reference, headers),
    enabled: !!reference,
    refetchInterval: pollInterval,
  });
}

export function useFetchPOSSaleReceipt(reference: string) {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-sale-receipt", reference],
    queryFn: () => getPOSSaleReceipt(reference, headers),
    enabled: !!reference,
  });
}


export function useFetchPOSProducts(search: string = "", inStockOnly: boolean = false) {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-products", search, inStockOnly],
    queryFn: () => searchPOSProducts(search, inStockOnly, headers),
  });
}

export function useLookupPOSSku(sku: string) {
  const headers = useAxiosAuth();
  return useQuery({
    queryKey: ["pos-sku", sku],
    queryFn: () => lookupPOSSku(sku, headers),
    enabled: !!sku && sku.length >= 3,
    retry: false,
  });
}
