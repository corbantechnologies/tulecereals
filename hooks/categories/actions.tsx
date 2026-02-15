"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategory,
  getCategoriesVendor,
  getCategoryVendor,
} from "@/services/categories";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    enabled: true,
  });
}

export function useFetchCategory(reference: string) {
  return useQuery({
    queryKey: ["category", reference],
    queryFn: () => getCategory(reference),
    enabled: !!reference,
  });
}

export function useFetchCategoriesVendor() {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["categories-vendor"],
    queryFn: () => getCategoriesVendor(headers),
    enabled: true,
  });
}

export function useFetchCategoryVendor(reference: string) {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["category-vendor", reference],
    queryFn: () => getCategoryVendor(reference, headers),
    enabled: !!reference,
  });
}
