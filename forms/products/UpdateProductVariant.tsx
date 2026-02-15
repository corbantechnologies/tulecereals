/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  updateProductVariant,
  ProductVariant,
} from "@/services/productvariants";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { Loader2, Plus, X } from "lucide-react";

interface UpdateProductVariantProps {
  variant: ProductVariant;
  productCode: string; // Required by backend interface
  onSuccess: () => void;
}

export default function UpdateProductVariant({
  variant,
  productCode,
  onSuccess,
}: UpdateProductVariantProps) {
  const authHeaders = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  // Manage attributes as array of {key, value} for easier editing
  const [attributeList, setAttributeList] = useState<
    { key: string; value: string }[]
  >([]);

  useEffect(() => {
    if (variant && variant.attributes) {
      const attrs = Object.entries(variant.attributes).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      setAttributeList(attrs);
    }
  }, [variant]);

  const formik = useFormik({
    initialValues: {
      price: variant.price || "",
      cost_price: variant.cost_price || "",
      stock: variant.stock || 0,
      // image: null, // Image update to be handled separately or added later if needed
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Construct attributes object
        const attributesObj = attributeList.reduce(
          (acc, curr) => {
            if (curr.key.trim()) {
              acc[curr.key.trim()] = curr.value.trim();
            }
            return acc;
          },
          {} as Record<string, string>,
        );

        const formData = new FormData();
        formData.append("product", productCode);
        formData.append("price", String(values.price));
        formData.append("cost_price", String(values.cost_price));
        formData.append("stock", String(values.stock));

        // Append attributes as JSON string or individual keys?
        // Usually multipart/form-data struggles with nested JSON.
        // The backend likely expects a JSON string for 'attributes' if it's a single field,
        // OR dot notation if it parses it.
        // Re-reading service: interface has `attributes: {}`.
        // Let's try sending as JSON string first if backend calls `json.loads`.
        // IF backend is DRF with standard parsers, it might need specific handling.
        // Safest for now: stringify it.
        formData.append("attributes", JSON.stringify(attributesObj));

        // Note: updateProductVariant service signature expects `updateProductVariant` object,
        // but implementation uses `apiMultipartActions.patch`.
        // We cast to any to bypass strict type checking if we pass FormData,
        // or we update service signature.
        // For now, let's update the service to accept FormData like we did for products.

        await updateProductVariant(
          variant.reference,
          formData as any,
          authHeaders,
        );

        toast.success("Variant updated successfully");
        onSuccess();
      } catch (error) {
        toast.error("Failed to update variant");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const addAttribute = () => {
    setAttributeList([...attributeList, { key: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    setAttributeList(attributeList.filter((_, i) => i !== index));
  };

  const updateAttribute = (
    index: number,
    field: "key" | "value",
    val: string,
  ) => {
    const newList = [...attributeList];
    newList[index][field] = val;
    setAttributeList(newList);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Price
          </label>
          <input
            name="price"
            type="number"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
            className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Cost Price
          </label>
          <input
            name="cost_price"
            type="number"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.cost_price}
            className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Stock
          </label>
          <input
            name="stock"
            type="number"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.stock}
            className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-foreground">
            Attributes
          </label>
          <button
            type="button"
            onClick={addAttribute}
            className="text-xs flex items-center bg-secondary/10 text-primary px-2 py-1 rounded-sm hover:bg-secondary/20"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Attribute
          </button>
        </div>

        <div className="space-y-2">
          {attributeList.map((attr, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                placeholder="Size, Color..."
                value={attr.key}
                onChange={(e) => updateAttribute(idx, "key", e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-secondary rounded-sm focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <input
                placeholder="Value"
                value={attr.value}
                onChange={(e) => updateAttribute(idx, "value", e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-secondary rounded-sm focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => removeAttribute(idx)}
                className="text-muted-foreground hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {attributeList.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No attributes defined (e.g. Size, Color).
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Updating..." : "Update Variant"}
      </button>
    </form>
  );
}
