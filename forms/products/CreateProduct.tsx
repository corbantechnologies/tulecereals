"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { createProduct } from "@/services/products";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, X, ChevronDown } from "lucide-react";
import { useFetchSubCategoriesVendor } from "@/hooks/subcategories/actions";

interface CreateProductProps {
  onSuccess?: () => void;
}

export function CreateProduct({ onSuccess }: CreateProductProps) {
  const router = useRouter();
  const authHeaders = useAxiosAuth();
  const { data: subcategories } = useFetchSubCategoriesVendor();
  const [loading, setLoading] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [subSearch, setSubSearch] = useState("");

  const filteredSubcategories = subcategories?.filter((sub) =>
    sub.name.toLowerCase().includes(subSearch.toLowerCase()),
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      sub_categories: [] as string[],
      tags: "", // Comma separated string for input
      is_active: false,
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Convert tags string to array
        const tagsArray = values.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== "");

        // Ensure sub_categories is an array (select returns string)

        const payload = {
          ...values,
          tags: tagsArray,
        };

        console.log(payload);

        const response = await createProduct(payload, authHeaders);

        toast.success("Product draft created successfully");

        if (onSuccess) onSuccess();

        // Navigate to product details page for further updates
        router.push(`/vendor/products/${response.reference}`);
      } catch (error) {
        toast.error("Failed to create product");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Product Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          placeholder="e.g. Leather Jacket"
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          placeholder="High quality material..."
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="sub_categories"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Subcategories
        </label>

        {/* Selected Chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {formik.values.sub_categories.map((subName) => (
            <span
              key={subName}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {subName}
              <button
                type="button"
                onClick={() => {
                  const newSubs = formik.values.sub_categories.filter(
                    (s) => s !== subName,
                  );
                  formik.setFieldValue("sub_categories", newSubs);
                }}
                className="ml-1 text-primary hover:text-primary/80 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Dropdown Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSubDropdownOpen(!isSubDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2 border border-secondary rounded-sm bg-white text-left focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-sm"
          >
            <span
              className={
                formik.values.sub_categories.length === 0
                  ? "text-muted-foreground"
                  : "text-foreground"
              }
            >
              {formik.values.sub_categories.length > 0
                ? "Add more subcategories..."
                : "Select Subcategories"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isSubDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Content */}
          {isSubDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-secondary rounded-sm shadow-lg max-h-60 flex flex-col">
              <div className="p-2 border-b border-secondary/20 sticky top-0 bg-white">
                <input
                  type="text"
                  placeholder="Search..."
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-secondary/50 rounded-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="overflow-y-auto p-1 custom-scrollbar flex-1">
                {filteredSubcategories?.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    No matches found
                  </div>
                ) : (
                  filteredSubcategories?.map((sub) => {
                    const isSelected = formik.values.sub_categories.includes(
                      sub.name,
                    );
                    return (
                      <label
                        key={sub.reference}
                        className="flex items-center px-3 py-2 hover:bg-secondary/10 cursor-pointer rounded-sm"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            let newSubs: string[];
                            if (isSelected) {
                              newSubs = formik.values.sub_categories.filter(
                                (s) => s !== sub.name,
                              );
                            } else {
                              newSubs = [
                                ...formik.values.sub_categories,
                                sub.name,
                              ];
                            }
                            formik.setFieldValue("sub_categories", newSubs);
                          }}
                          className="h-4 w-4 text-primary border-secondary rounded focus:ring-primary mr-3"
                        />
                        <span
                          className={`text-sm ${isSelected ? "font-medium text-foreground" : "text-foreground/80"}`}
                        >
                          {sub.name}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Select one or more subcategories using the list above.
        </p>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tags}
          placeholder="Men, Unisex (comma separated)"
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Creating Draft..." : "Create Draft Product"}
      </button>
    </form>
  );
}
