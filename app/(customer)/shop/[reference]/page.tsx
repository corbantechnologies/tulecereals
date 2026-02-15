"use client";

import { useFetchProduct, useFetchProducts } from "@/hooks/products/actions";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/products/ProductCard";
import AddToCartButton from "@/components/products/AddToCartButton";
import { formatCurrency } from "@/components/dashboard/utils";
import { Loader2, Minus, Plus, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, use } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const { data: product, isLoading } = useFetchProduct(
    resolvedParams.reference,
  );
  const { data: allProducts } = useFetchProducts();
  const { addToCart, isLoading: isAddingToCart } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [globalQuantity, setGlobalQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const { variants, images } = product;
  const hasMultipleVariants = variants.length > 1;

  // Filter related products
  const relatedProducts =
    allProducts
      ?.filter(
        (p) =>
          p.reference !== product.reference &&
          p.is_active &&
          p.sub_category.some((sub) =>
            product.sub_category.some(
              (currentSub) => currentSub.reference === sub.reference,
            ),
          ),
      )
      .slice(0, 4) || [];

  // Handle Quantity Change for specific variants
  const handleVariantQuantityChange = (
    variantSku: string,
    delta: number,
    maxStock: number,
  ) => {
    setQuantities((prev) => {
      const currentQty = prev[variantSku] || 0;
      const newQty = Math.max(0, Math.min(currentQty + delta, maxStock));
      return { ...prev, [variantSku]: newQty };
    });
  };

  // Handle Global Quantity Change
  const handleGlobalQuantityChange = (delta: number, maxStock: number) => {
    setGlobalQuantity((prev) => Math.max(1, Math.min(prev + delta, maxStock)));
  };

  const handleMultiAddToCart = async () => {
    // Use SKU for filter and map
    const variantsToAdd = variants.filter((v) => (quantities[v.sku] || 0) > 0);

    if (variantsToAdd.length === 0) {
      toast.error("Please select at least one item");
      return;
    }

    try {
      // Use v.sku
      await Promise.all(
        variantsToAdd.map((v) =>
          addToCart({
            variant_sku: v.sku,
            quantity: quantities[v.sku],
            // Extra details for guest cart
            variant_name: v.product_name || product.name,
            variant_image: mainImage,
            variant_price: parseFloat(v.price.toString()),
            shop_currency: product.shop_details.currency,
          }),
        ),
      );
      setQuantities({});
      toast.success("Items added to cart");
    } catch (error) {
      console.error("Error adding multiple items", error);
    }
  };

  const mainImage = images[selectedImageIndex]?.image || "/placeholder.png";

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <Link href="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>
          {product.sub_category[0] && (
            <>
              <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
              <Link
                href={`/shop?subcategory=${product.sub_category[0].reference}`}
                className="hover:text-primary transition-colors"
              >
                {product.sub_category[0].name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="text-foreground font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-secondary/10 rounded-none overflow-hidden max-w-xl mx-auto md:mx-0">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square bg-secondary/10 overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img.image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div>
            <div className="mb-2 text-sm text-muted-foreground uppercase tracking-wider font-medium">
              {product.shop_details.name}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">
              {product.name}
            </h1>

            {/* Price Display */}
            <div className="text-2xl font-medium text-primary mb-6">
              {!hasMultipleVariants && variants.length > 0 ? (
                formatCurrency(variants[0].price, product.shop_details.currency)
              ) : (
                <span>
                  {/* Logic to show price range if needed */}
                  See prices below
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm text-foreground/80 mb-8 max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Variants Handling */}
            {hasMultipleVariants ? (
              <div className="border-t border-border pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-foreground">
                    Select Options
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase text-muted-foreground pb-2 border-b border-border/50">
                    <div className="col-span-6">Variant</div>
                    <div className="col-span-3 text-center">Price</div>
                    <div className="col-span-3 text-right">Qty</div>
                  </div>

                  {/* Variant Rows */}
                  {variants.map((variant) => {
                    const variantName =
                      Object.values(variant.attributes).join(" - ") ||
                      variant.product_name;
                    // Use SKU for quantity lookup
                    const qty = quantities[variant.sku] || 0;

                    return (
                      <div
                        key={variant.sku} // Use SKU as key
                        className="grid grid-cols-12 gap-4 items-center py-2 border-b border-border/10 last:border-0"
                      >
                        <div className="col-span-6">
                          <p className="font-medium text-sm text-foreground">
                            {variantName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {variant.stock > 0
                              ? `${variant.stock} in stock`
                              : "Out of stock"}
                          </p>
                        </div>
                        <div className="col-span-3 text-center text-sm font-medium text-foreground/80">
                          {formatCurrency(
                            variant.price,
                            product.shop_details.currency,
                          )}
                        </div>
                        <div className="col-span-3 flex justify-end">
                          {variant.stock > 0 ? (
                            <div className="flex items-center border border-border rounded-md">
                              <button
                                onClick={() =>
                                  handleVariantQuantityChange(
                                    variant.sku, // Use SKU
                                    -1,
                                    variant.stock,
                                  )
                                }
                                className="p-1 hover:bg-secondary/10 transition-colors"
                                disabled={qty <= 0}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="text"
                                value={qty}
                                readOnly
                                className="w-8 text-center text-sm bg-transparent border-none focus:ring-0 p-0"
                              />
                              <button
                                onClick={() =>
                                  handleVariantQuantityChange(
                                    variant.sku, // Use SKU
                                    1,
                                    variant.stock,
                                  )
                                }
                                className="p-1 hover:bg-secondary/10 transition-colors"
                                disabled={qty >= variant.stock}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">
                              Sold Out
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleMultiAddToCart}
                  disabled={isAddingToCart}
                  className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-md font-medium text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            ) : (
              // Simple Product View
              <div className="border-t border-border pt-6">
                {variants[0] && (
                  <>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <span
                        className={`w-2 h-2 rounded-full ${variants[0].stock > 0 ? "bg-green-500" : "bg-red-500"}`}
                      ></span>
                      <span className="font-medium">
                        {variants[0].stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                      <span className="text-muted-foreground">
                        ({variants[0].stock} available)
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground uppercase">
                        {variants[0].sku}
                      </span>
                    </div>

                    {variants[0].stock > 0 && (
                      <div className="flex flex-col gap-4 mt-6">
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-medium text-foreground">
                            Quantity:
                          </label>
                          <div className="flex items-center border border-border rounded-md w-fit">
                            <button
                              onClick={() =>
                                handleGlobalQuantityChange(
                                  -1,
                                  variants[0].stock,
                                )
                              }
                              className="p-2 hover:bg-secondary/10 transition-colors"
                              disabled={globalQuantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="text"
                              value={globalQuantity}
                              readOnly
                              className="w-12 text-center text-base bg-transparent border-none focus:ring-0 p-0 font-medium"
                            />
                            <button
                              onClick={() =>
                                handleGlobalQuantityChange(1, variants[0].stock)
                              }
                              className="p-2 hover:bg-secondary/10 transition-colors"
                              disabled={globalQuantity >= variants[0].stock}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <AddToCartButton
                          variantSKU={variants[0].sku} // Updated prop name
                          quantity={globalQuantity}
                          stock={variants[0].stock}
                          variantName={product.name}
                          variantImage={mainImage}
                          variantPrice={parseFloat(
                            variants[0].price.toString(),
                          )}
                          shopCurrency={product.shop_details.currency}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* We Think You'll Love This */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 md:mt-20 border-t border-border pt-12">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-8">
              We Think You&apos;ll Love This
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.reference} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
