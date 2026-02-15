"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { addProductImages } from "@/services/products";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { useFetchProductVendor } from "@/hooks/products/actions";
import toast from "react-hot-toast";
import { Loader2, Upload, X } from "lucide-react";

interface UploadProductImagesProps {
  productReference: string;
  onSuccess: () => void;
}

export default function UploadProductImages({
  productReference,
  onSuccess,
}: UploadProductImagesProps) {
  const authHeaders = useAxiosAuth();
  const { data: product } = useFetchProductVendor(productReference);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const formik = useFormik({
    initialValues: {
      uploaded_images: [] as File[],
    },
    onSubmit: async () => {
      if (selectedImages.length === 0) {
        toast.error("Please select at least one image.");
        return;
      }

      setLoading(true);
      try {
        // Manually construct FormData
        const formData = new FormData();

        // Append images
        selectedImages.forEach((file) => {
          formData.append("uploaded_images", file);
        });

        // Append existing sub_categories to prevent them from being cleared
        // The API likely treats this PATCH as an update where missing M2M relations might be inferred as empty
        // (though unexpected for PATCH, we safeguard against it).
        if (product?.sub_category) {
          product.sub_category.forEach((sub) => {
            formData.append("sub_categories", sub.name);
          });
        }

        // Also preserve description and name if needed, assuming the backend might be buggy with partial updates
        // but let's start with sub_categories as requested.

        await addProductImages(productReference, formData, authHeaders);

        toast.success("Images uploaded successfully");
        setSelectedImages([]);
        onSuccess();
      } catch (error) {
        toast.error("Failed to upload images");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Append new files to existing selection
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Product Gallery
        </label>

        <div className="border-2 border-dashed border-secondary/30 rounded-sm p-8 text-center hover:bg-secondary/5 transition-colors cursor-pointer relative bg-secondary/5">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center pointer-events-none">
            <Upload className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-sm font-medium text-foreground">
              Click to upload images
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>
        </div>
      </div>

      {selectedImages.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Selected Files ({selectedImages.length})
          </p>
          <div className="grid grid-cols-1 gap-2">
            {selectedImages.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-white border border-secondary/20 rounded-sm text-sm"
              >
                <span className="truncate max-w-[80%] text-foreground/80">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || selectedImages.length === 0}
        className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Uploading..." : "Upload Images"}
      </button>
    </form>
  );
}
