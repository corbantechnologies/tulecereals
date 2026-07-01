"use client";

import { useFetchCategories } from "@/hooks/categories/actions";
import { useFetchProducts } from "@/hooks/products/actions";
import ProductCard from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

function ProductList() {
  const { data: products, isLoading: isLoadingProducts } = useFetchProducts();
  const { data: categories, isLoading: isLoadingCategories } = useFetchCategories();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");
  const selectedSubcategory = searchParams.get("subcategory");

  // Filter out categories that have no active products
  const categoriesWithProducts = useMemo(() => {
    return categories?.filter((category) => {
      if (!category.is_active) return false;
      const subCategoryRefs = category.subcategories?.map((s) => s.reference) || [];
      return products?.some(
        (p) =>
          p.is_active &&
          p.sub_category.some((sub) => subCategoryRefs.includes(sub.reference)),
      );
    }) || [];
  }, [categories, products]);

  // Extract available subcategories for currently active parent category
  const activeSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const activeCat = categories?.find((c) => c.reference === selectedCategory);
    if (!activeCat || !activeCat.subcategories) return [];

    // Only show subcategories that actually contain items matching active products
    return activeCat.subcategories.filter((sub) => 
      products?.some((p) => p.is_active && p.sub_category.some((s) => s.reference === sub.reference))
    );
  }, [selectedCategory, categories, products]);

  // Filter products based on selected category AND/OR subcategory parameters
  const filteredProducts = useMemo(() => {
    return products?.filter((p) => {
      if (!p.is_active) return false;

      // Handle specific subcategory filtering
      if (selectedSubcategory) {
        return p.sub_category.some((sub) => sub.reference === selectedSubcategory);
      }

      // If no overarching main category filter is parsed, return all active items
      if (!selectedCategory) return true;

      const category = categories?.find((c) => c.reference === selectedCategory);
      if (!category) return false;

      const subCategoryRefs = category.subcategories?.map((s) => s.reference) || [];
      return p.sub_category.some((sub) => subCategoryRefs.includes(sub.reference));
    }) || [];
  }, [products, categories, selectedCategory, selectedSubcategory]);

  const handleCategoryClick = (categoryRef: string | null) => {
    if (categoryRef) {
      router.push(`/shop?category=${categoryRef}`);
    } else {
      router.push("/shop");
    }
  };

  const handleSubcategoryClick = (subCategoryRef: string | null) => {
    if (subCategoryRef) {
      router.push(`/shop?category=${selectedCategory}&subcategory=${subCategoryRef}`);
    } else {
      router.push(`/shop?category=${selectedCategory}`);
    }
  };

  const isLoading = isLoadingProducts || isLoadingCategories;

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Header Section */}
      <div className="text-center mb-12">
        <p className="text-xs md:text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase mb-3">
          Our Collection
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-foreground font-medium mb-4">
          All Products
        </h1>
        <p className="text-foreground/60 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Discover our curated selection of luxury beauty essentials, crafted
          with the finest ingredients for radiant results.
        </p>
      </div>

      {/* Filters and Navigation Bars */}
      <div className="flex flex-col gap-4 mb-10 border-b border-border/40 pb-6">
        {/* Main Categories Row */}
        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="flex flex-nowrap md:flex-wrap gap-2 min-w-max px-1">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-6 py-2 rounded-sm text-sm font-medium transition-all duration-300 border whitespace-nowrap ${
                !selectedCategory
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground"
              }`}
            >
              All Products
            </button>
            {categoriesWithProducts.map((category) => (
              <button
                key={category.reference}
                onClick={() => handleCategoryClick(category.reference)}
                className={`px-6 py-2 rounded-sm text-sm font-medium transition-all duration-300 border whitespace-nowrap ${
                  selectedCategory === category.reference
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Secondary Subcategories Row */}
        {selectedCategory && activeSubcategories.length > 0 && (
          <div className="w-full overflow-x-auto hide-scrollbar pt-2 border-t border-border/30 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex flex-nowrap gap-2 min-w-max px-1 items-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wider mr-2 font-medium">
                Subcategories:
              </span>
              <button
                onClick={() => handleSubcategoryClick(null)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  !selectedSubcategory
                    ? "bg-secondary text-foreground border-secondary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                All Type
              </button>
              {activeSubcategories.map((sub) => (
                <button
                  key={sub.reference}
                  onClick={() => handleSubcategoryClick(sub.reference)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    selectedSubcategory === sub.reference
                      ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                      : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Grid Layout container */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.reference} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/5 rounded-sm border border-dashed border-secondary/30">
            <p className="text-foreground/60 mb-4">
              No products found matching your current refinement parameters.
            </p>
            <button
              onClick={() => handleCategoryClick(null)}
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Reset active filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-40">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        }
      >
        <ProductList />
      </Suspense>
    </div>
  );
}