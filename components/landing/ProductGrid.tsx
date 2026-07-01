"use client";

import Link from "next/link";
import { Loader2, ShoppingBag } from "lucide-react";
import { useFetchProducts } from "@/hooks/products/actions";
import ProductCard from "../products/ProductCard";

export default function ProductGrid() {
  const { data: products, isLoading } = useFetchProducts();

  // Filter products that have images and are active
  const displayProducts =
    products?.filter((p) => p.is_active && p.images && p.images.length > 0).slice(0, 8) || [];

  const hasNoProducts = displayProducts.length === 0;

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
        ) : hasNoProducts ? (
          /* Empty State Block */
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 border border-secondary/20">
              <ShoppingBag className="w-6 h-6 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              No products available yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              We are currently updating our inventory. Check back shortly to discover our fresh batches!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
            {displayProducts.map((product) => (
              <ProductCard key={product.reference} product={product} />
            ))}
          </div>
        )}

        {/* Footer link stays visible regardless of internal state loading */}
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