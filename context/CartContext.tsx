/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { Cart } from "@/services/cart";
import { CartItem } from "@/services/cartitems";
import { useFetchCart } from "@/hooks/cart/actions";
import {
  useAddToCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from "@/hooks/cartitems/mutations";

// Extended interface for Item input (used especially for guest cart)
export interface CartItemInput {
  variant_sku: string;
  quantity: number;
  variant_name?: string;
  variant_price?: number;
  variant_image?: string;
  shop_currency?: string;
  stock?: number;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (item: CartItemInput) => Promise<void>;
  updateItem: (reference: string, quantity: number) => Promise<void>;
  removeItem: (reference: string) => Promise<void>;
  isGuest: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // ── Authenticated cart ──
  const { data: serverCart, isLoading: isServerLoading } = useFetchCart({
    enabled: isAuthenticated,
  });

  const { mutateAsync: serverAdd } = useAddToCart();
  const { mutateAsync: serverUpdate } = useUpdateCartItem();
  const { mutateAsync: serverDelete } = useDeleteCartItem();

  // ── Guest cart (local storage) ──
  const [guestCart, setGuestCart] = useState<Cart | null>(null);
  const [isGuestLoading, setIsGuestLoading] = useState(true);

  // Load guest cart from localStorage on mount (when not authenticated)
  useEffect(() => {
    if (status === "loading") return;

    if (!isAuthenticated) {
      const loadGuestCart = () => {
        const stored = localStorage.getItem("guest_cart");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setTimeout(() => {
              setGuestCart(parsed);
              setIsGuestLoading(false);
            }, 0);
          } catch (e) {
            console.error("Failed to parse guest cart from localStorage", e);
            localStorage.removeItem("guest_cart");
            setIsGuestLoading(false);
          }
        } else {
          // Initialize empty guest cart
          const newGuestCart = {
            customer: "guest",
            customer_name: "Guest",
            customer_email: "",
            reference: `guest-${Date.now()}`,
            items: [],
            grand_total: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as unknown as Cart;

          setTimeout(() => {
            setGuestCart(newGuestCart);
            setIsGuestLoading(false);
          }, 0);
        }
      };

      loadGuestCart();
    }
  }, [isAuthenticated, status]);

  // Persist guest cart to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated && guestCart && !isGuestLoading) {
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
    }
  }, [guestCart, isAuthenticated, isGuestLoading]);

  // ── Merge guest cart into server cart when user logs in ──
  useEffect(() => {
    let mounted = true;

    const mergeCart = async () => {
      // Small delay to let session & server cart stabilize
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!mounted) return;

      if (isAuthenticated && !isGuestLoading) {
        const stored = localStorage.getItem("guest_cart");
        if (stored) {
          try {
            const parsed: Cart = JSON.parse(stored);
            if (parsed?.items?.length > 0) {
              for (const item of parsed.items) {
                try {
                  const sku = item.variant_sku || item.variant;
                  if (sku) {
                    await serverAdd({ variant: sku, quantity: item.quantity });
                  }
                } catch (e) {
                  console.error("Failed to sync guest item to server", item, e);
                }
              }

              // Clear guest cart after sync
              localStorage.removeItem("guest_cart");
              setGuestCart(null);
            }
          } catch (e) {
            console.error("Failed to parse guest cart during merge", e);
          }
        }
      }
    };

    if (isAuthenticated) {
      mergeCart();
    }

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isGuestLoading, serverAdd]);

  // ── Cart operations ──
  const addToCart = async (input: CartItemInput) => {
    if (isAuthenticated) {
      await serverAdd({ variant: input.variant_sku, quantity: input.quantity });
    } else {
      setGuestCart((prev) => {
        if (!prev) return null;

        const existingItemIndex = prev.items.findIndex(
          (item) => item.variant === input.variant_sku,
        );

        const newItems = [...prev.items];

        const newItemPayload: CartItem = {
          reference: `local-${input.variant_sku}-${Date.now()}`,
          variant: input.variant_sku,
          variant_name: input.variant_name || "Unknown Product",
          variant_image: input.variant_image || "/placeholder.png",
          quantity: input.quantity,
          variant_price: input.variant_price || 0,
          sub_total: (input.variant_price || 0) * input.quantity,
          variant_shop_currency: input.shop_currency || "KES",
          cart: prev.reference,
          variant_attributes: {},
          variant_shop: "",
          variant_shop_code: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          variant_sku: input.variant_sku,
        } as CartItem;

        if (existingItemIndex >= 0) {
          const existing = newItems[existingItemIndex];
          const newQty = existing.quantity + input.quantity;
          const price = parseFloat(existing.variant_price?.toString() || "0");

          newItems[existingItemIndex] = {
            ...existing,
            quantity: newQty,
            sub_total: price * newQty,
          };
        } else {
          newItems.push(newItemPayload);
        }

        const newTotal = newItems.reduce(
          (acc, item) =>
            acc +
            (typeof item.sub_total === "number"
              ? item.sub_total
              : parseFloat((item.sub_total as any) || "0")),
          0,
        );

        return { ...prev, items: newItems, grand_total: newTotal };
      });
    }
  };

  const updateItem = async (reference: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(reference);
      return;
    }

    if (isAuthenticated) {
      await serverUpdate({ reference, quantity });
    } else {
      setGuestCart((prev) => {
        if (!prev) return null;

        const newItems = prev.items.map((item) => {
          if (item.reference === reference) {
            // Ensure we use variant_price, and handle if it's potentially missing or undefined
            const price = parseFloat(item.variant_price?.toString() || "0");
            return {
              ...item,
              quantity,
              sub_total: price * quantity,
            };
          }
          return item;
        });

        const newTotal = newItems.reduce(
          (acc, item) =>
            acc +
            (typeof item.sub_total === "number"
              ? item.sub_total
              : parseFloat((item.sub_total as any) || "0")),
          0,
        );

        return { ...prev, items: newItems, grand_total: newTotal };
      });
    }
  };

  const removeItem = async (reference: string) => {
    if (isAuthenticated) {
      await serverDelete(reference);
    } else {
      setGuestCart((prev) => {
        if (!prev) return null;

        const newItems = prev.items.filter(
          (item) => item.reference !== reference,
        );

        const newTotal = newItems.reduce(
          (acc, item) =>
            acc +
            (typeof item.sub_total === "number"
              ? item.sub_total
              : parseFloat((item.sub_total as any) || "0")),
          0,
        );

        return { ...prev, items: newItems, grand_total: newTotal };
      });
    }
  };

  // ── Context value ──
  const value: CartContextType = {
    cart: isAuthenticated ? serverCart || null : guestCart,
    isLoading: isAuthenticated ? isServerLoading : isGuestLoading,
    addToCart,
    updateItem,
    removeItem,
    isGuest: !isAuthenticated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
