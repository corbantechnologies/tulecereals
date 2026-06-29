"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Loader2, Lock, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import CartItem from "./CartItem";
import { formatCurrency } from "@/components/dashboard/utils";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Assuming 'isGuest' is provided by your CartContext or an auth hook. 
  // If it's not in useCart(), swap this for your auth logic hook (e.g., const { isGuest } = useAuth())
  const { cart, isLoading, isGuest } = useCart(); 
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

  const hasItems = cart && cart.items && cart.items.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
      />

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
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center items-center">
          {isLoading ? (
            <div className="space-y-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                Loading your cart...
              </p>
            </div>
          ) : isGuest ? (
            <div className="w-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-secondary/20 rounded-3xl flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-muted-foreground/70" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">Sign in to see your bag.</h1>
              <p className="text-muted-foreground max-w-sm text-sm mb-8">
                Your saved items will appear here once you sign in to your account.
              </p>
              <Link
                href="/login"
                onClick={onClose}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 group"
              >
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : !hasItems ? (
            <div className="space-y-4 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium text-foreground">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
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
            <div className="w-full space-y-1 self-start h-full">
              {cart.items.map((item) => (
                <CartItem key={item.reference} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && !isGuest && hasItems && (
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