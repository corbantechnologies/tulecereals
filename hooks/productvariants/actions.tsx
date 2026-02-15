"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getProductVariants,
  getProductVariant,
  getProductVariantsPublic,
  getProductVariantPublic,
} from "@/services/productvariants";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchProductVariants() {
  const header = useAxiosAuth();
  return useQuery({
    queryKey: ["product-variants"],
    queryFn: () => getProductVariants(header),
    enabled: true,
  });
}

export function useFetchProductVariant(reference: string) {
  const header = useAxiosAuth();
  return useQuery({
    queryKey: ["product-variant", reference],
    queryFn: () => getProductVariant(reference, header),
    enabled: !!reference,
  });
}

export function useFetchProductVariantsPublic() {
  return useQuery({
    queryKey: ["product-variants-public"],
    queryFn: () => getProductVariantsPublic(),
    enabled: true,
  });
}

export function useFetchProductVariantPublic(reference: string) {
  return useQuery({
    queryKey: ["product-variant-public", reference],
    queryFn: () => getProductVariantPublic(reference),
    enabled: !!reference,
  });
}
