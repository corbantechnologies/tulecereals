import { useCart } from "@/context/CartContext";
import { Loader2, ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  variantSKU: string;
  quantity: number;
  stock: number;
  disabled?: boolean;
  className?: string;
  // Details for Guest Cart
  variantName?: string;
  variantPrice?: number;
  variantImage?: string;
  shopCurrency?: string;
}

export default function AddToCartButton({
  variantSKU,
  quantity,
  stock,
  disabled,
  className = "",
  variantName,
  variantPrice,
  variantImage,
  shopCurrency,
}: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async () => {
    if (!variantSKU) {
      console.error("No variantSKU provided");
      return;
    }
    await addToCart({
      variant_sku: variantSKU,
      quantity,
      variant_name: variantName,
      variant_price: variantPrice,
      variant_image: variantImage,
      shop_currency: shopCurrency,
    });
  };

  const isOutOfStock = stock <= 0;
  const isDisabled = disabled || isLoading || isOutOfStock;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-md font-medium text-lg transition-colors flex items-center justify-center gap-2 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      {isLoading ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
