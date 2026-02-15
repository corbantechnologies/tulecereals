/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutCart } from "@/services/cart";
import useAxiosAuth from "../authentication/useAxiosAuth";
import toast from "react-hot-toast";

export const useCheckoutCart = () => {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();

  return useMutation({
    mutationFn: (data: { pickup_station: string; phone_number: string }) =>
      checkoutCart(data, header),
    onSuccess: (data) => {
      console.log("Checkout successful, received data:", data);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to place order. Please try again.");
      console.error(error);
    },
  });
};
