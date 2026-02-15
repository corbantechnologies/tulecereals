"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/components/dashboard/utils";
import { Product } from "@/services/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calculate price range or single price
  const prices = product.variants.map((v) => parseFloat(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const isRange = minPrice !== maxPrice;

  return (
    <Link
      href={`/shop/${product.reference}`}
      className="group cursor-pointer block"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/10 mb-3">
        <Image
          src={product.images[0]?.image || "/placeholder.png"} // Fallback image
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Add to Cart - Visible on hover for desktop */}
        <button className="absolute bottom-0 left-0 w-full py-3 md:py-4 bg-foreground/90 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium text-sm md:text-base">
          View Details
        </button>
      </div>

      {/* Content */}
      <div>
        <div className="mb-1">
          <h3 className="text-base font-serif text-foreground font-bold group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-primary">
            {prices.length > 0
              ? isRange
                ? `${formatCurrency(
                    minPrice,
                    product.shop_details.currency,
                  )} - ${formatCurrency(maxPrice, product.shop_details.currency)}`
                : formatCurrency(minPrice, product.shop_details.currency)
              : "Out of Stock"}
          </p>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.sub_category[0]?.name || "General"}
        </p>
      </div>
    </Link>
  );
}
