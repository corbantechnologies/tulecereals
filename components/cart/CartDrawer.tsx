"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import CartItem from "./CartItem";
import { formatCurrency } from "@/components/dashboard/utils";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, isLoading } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="relative z-[100] w-full sm:w-[400px] h-full bg-background shadow-sm border-l border-secondary/30 animate-in slide-in-from-right duration-300 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading your cart...
              </p>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium text-foreground">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {cart.items.map((item) => (
                <CartItem key={item.reference} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="p-6 border-t border-border bg-secondary/5">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(cart.grand_total, "KES")}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(cart.grand_total, "KES")}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center pt-2">
                Shipping and taxes calculated at checkout.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full py-3 bg-primary text-primary-foreground text-center rounded-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
