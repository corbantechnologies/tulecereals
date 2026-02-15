"use client"

import Image from "next/image";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { useFetchProducts } from "@/hooks/products/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import ProductCard from "../products/ProductCard";

export default function ProductGrid() {
  const { data: products, isLoading } = useFetchProducts();

  // Filter products that have images and are active
  const displayProducts =
    products?.filter((p) => p.is_active && p.images.length > 0).slice(0, 8) ||
    []; // Limit to 8 products for the grid

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Our Best Sellers
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-sm md:text-base">
            Discover our customers&apos; favorite grains and breakfast cereals,
            chosen for their quality, freshness, and delicious taste.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
            {displayProducts.map((product) => {
              return <ProductCard key={product.reference} product={product} />;
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block border-b border-foreground pb-1 text-foreground hover:text-primary hover:border-primary transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
