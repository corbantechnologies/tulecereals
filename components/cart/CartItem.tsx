"use client";

import { useCart } from "@/context/CartContext";
import { CartItem as CartItemType } from "@/services/cartitems";
import { formatCurrency } from "@/components/dashboard/utils";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
  currency?: string;
}

export default function CartItem({ item, currency = "KES" }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Optimistic UI for quantity could be added here, but relying on server/context for now
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await updateItem(item.reference, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeItem(item.reference);
    } finally {
      setIsDeleting(false);
    }
  };

  const isDisabled = isUpdating || isDeleting;

  return (
    <div className="flex gap-4 py-4 border-b border-secondary/20 last:border-0">
      {/* Image Placeholder - since API currently doesn't seem to return image URL directly on CartItem, 
                we might need to fetch it or assuming it might be added later. 
                For now using a placeholder or if variant has image logic.
                Looking at the interfaces, CartItem has variant_name but no image. 
                We might need to fetch product/variant details or maybe it's missing in interface but present in API?
                Let's use a placeholder for now.
            */}
      <div className="relative w-20 h-20 bg-secondary/10 rounded-sm overflow-hidden flex-shrink-0">
        <Image
          src={item.variant_image || "/placeholder.png"}
          alt={item.variant_name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground line-clamp-2">
            {item.variant_name}
          </h4>
          {/* Attributes display if any useful ones exist in variant_attributes */}
          {item.variant_attributes &&
            Object.keys(item.variant_attributes).length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {Object.values(item.variant_attributes).join(" / ")}
              </p>
            )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-medium text-foreground">
            {formatCurrency(
              parseFloat(item.sub_total.toString()),
              item.variant_shop_currency || currency,
            )}
          </p>

          <div className="flex items-center gap-2">
            {/* Quantity Controls */}
            <div className="flex items-center border border-secondary/30 rounded-sm h-8">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isDisabled || item.quantity <= 1}
                className="w-8 h-full flex items-center justify-center hover:bg-secondary/10 transition-colors disabled:opacity-50"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-xs font-medium">
                {isUpdating ? (
                  <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                ) : (
                  item.quantity
                )}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isDisabled}
                className="w-8 h-full flex items-center justify-center hover:bg-secondary/10 transition-colors disabled:opacity-50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={isDisabled}
              className="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
