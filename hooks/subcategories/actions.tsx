"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getSubCategories,
  getSubCategory,
  getSubCategoriesVendor,
  getSubCategoryVendor,
} from "@/services/subcategories";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchSubCategories() {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: () => getSubCategories(),
    enabled: true,
  });
}

export function useFetchSubCategory(reference: string) {
  return useQuery({
    queryKey: ["subcategory", reference],
    queryFn: () => getSubCategory(reference),
    enabled: !!reference,
  });
}

export function useFetchSubCategoriesVendor() {
    const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["subcategories-vendor"],
    queryFn: () => getSubCategoriesVendor(headers),
    enabled: true,
  });
}

export function useFetchSubCategoryVendor(reference: string) {
  const headers = useAxiosAuth()
  return useQuery({
    queryKey: ["subcategory-vendor", reference],
    queryFn: () => getSubCategoryVendor(reference, headers),
    enabled: !!reference,
  });
}
