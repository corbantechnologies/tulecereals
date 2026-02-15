"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { updateProduct } from "@/services/products";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { Loader2, X, ChevronDown } from "lucide-react";
import {
  useFetchSubCategoriesVendor,
} from "@/hooks/subcategories/actions";
import { useFetchProductVendor } from "@/hooks/products/actions";

interface UpdateProductProps {
  productReference: string;
  onSuccess: () => void;
}

export default function UpdateProduct({
  productReference,
  onSuccess,
}: UpdateProductProps) {
  const authHeaders = useAxiosAuth();
  const { data: subcategories } = useFetchSubCategoriesVendor();
  const { data: product } = useFetchProductVendor(productReference);

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
      tags: "",
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

        const payload = {
          ...values,
          tags: tagsArray,
        };

        await updateProduct(productReference, payload, authHeaders);

        toast.success("Product updated successfully");
        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error("Failed to update product");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  // Populate form with existing product data
  useEffect(() => {
    if (product) {
      formik.setValues({
        name: product.name || "",
        description: product.description || "",
        sub_categories: product.sub_category?.map((sub) => sub.name) || [],
        tags: product.tags?.join(", ") || "",
        is_active: product.is_active,
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Product Name
        </label>
        <input
          name="name"
          type="text"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={4}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Multi-Select Subcategories */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
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
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Tags
        </label>
        <input
          name="tags"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tags}
          placeholder="Men, Unisex (comma separated)"
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          onChange={formik.handleChange}
          checked={formik.values.is_active}
          className="h-4 w-4 text-primary focus:ring-primary border-secondary rounded"
        />
        <label
          htmlFor="is_active"
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          Is Active (Published)
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
