/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkoutCart,
  CheckoutCartPayload,
} from "@/services/cart";
import useAxiosAuth from "../authentication/useAxiosAuth";
import toast from "react-hot-toast";

export const useCheckoutCart = () => {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();

  return useMutation({
    mutationFn: (data: CheckoutCartPayload) =>
      checkoutCart(data, header),

    onSuccess: (data) => {
      console.log("Checkout successful:", data);

      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast.success("Order placed successfully!");
    },

    onError: (error: any) => {
      console.error("Checkout Error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to place order."
      );
    },
  });
};