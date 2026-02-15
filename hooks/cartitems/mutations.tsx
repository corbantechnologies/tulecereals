"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  updateCartItem,
  deleteCartItem,
} from "@/services/cartitems";
import useAxiosAuth from "../authentication/useAxiosAuth";
import toast from "react-hot-toast";

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();

  return useMutation({
    mutationFn: (data: { variant: string; quantity: number }) =>
      addToCart(data, header),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item added to cart");
    },
    onError: (error: any) => {
      toast.error("Failed to add item to cart");
      console.error(error);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();

  return useMutation({
    mutationFn: ({
      reference,
      quantity,
    }: {
      reference: string;
      quantity: number;
    }) => updateCartItem(reference, { quantity }, header),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // toast.success("Cart updated"); // Optional: might be too noisy
    },
    onError: (error: any) => {
      toast.error("Failed to update cart");
      console.error(error);
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();

  return useMutation({
    mutationFn: (reference: string) => deleteCartItem(reference, header),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: (error: any) => {
      toast.error("Failed to remove item");
      console.error(error);
    },
  });
};
