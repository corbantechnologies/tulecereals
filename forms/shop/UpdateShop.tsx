/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { updateShop } from "@/services/shops";
import { useFetchAccount } from "@/hooks/accounts/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface UpdateShopFormProps {
  onSuccess?: () => void;
}

export default function UpdateShopForm({ onSuccess }: UpdateShopFormProps) {
  const authHeaders = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const { data: vendor } = useFetchAccount();
  const shop = vendor?.shop;

  const formik = useFormik({
    initialValues: {
      name: shop?.name || "",
      description: shop?.description || "",
      logo: shop?.logo || null,
      banner: shop?.banner || null,
      address: shop?.address || "",
      city: shop?.city || "",
      state: shop?.state || "",
      zip_code: shop?.zip_code || "",
      country: shop?.country || "",
      phone: shop?.phone || "",
      email: shop?.email || "",
      currency: shop?.currency || "",
      return_policy: shop?.return_policy || "",
      shipping_policy: shop?.shipping_policy || "",
      refund_policy: shop?.refund_policy || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!shop?.shop_code) {
        toast.error("Shop information not found");
        return;
      }

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name || "");
        formData.append("description", values.description || "");
        if ((values.logo as any) instanceof File) {
          formData.append("logo", values.logo as any);
        }
        if ((values.banner as any) instanceof File) {
          formData.append("banner", values.banner as any);
        }
        formData.append("address", values.address || "");
        formData.append("city", values.city || "");
        formData.append("state", values.state || "");
        formData.append("zip_code", values.zip_code || "");
        formData.append("country", values.country || "");
        formData.append("phone", values.phone || "");
        formData.append("email", values.email || "");
        formData.append("currency", values.currency || "");
        formData.append("return_policy", values.return_policy || "");
        formData.append("shipping_policy", values.shipping_policy || "");
        formData.append("refund_policy", values.refund_policy || "");

        await updateShop(shop.shop_code, formData, authHeaders);
        toast.success("Shop details updated successfully");
        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error("Failed to update shop details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (!shop) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-2xl px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Shop Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="currency"
            className="text-sm font-medium text-foreground"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            onChange={formik.handleChange}
            value={formik.values.currency}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            required
          >
            <option value="" disabled>
              Select Currency
            </option>
            <option value="KES">KES (Kenyan Shilling)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            onChange={formik.handleChange}
            value={formik.values.description}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="logo" className="text-sm font-medium text-foreground">
            Logo
          </label>
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            onChange={(event) => {
              if (event.currentTarget.files) {
                formik.setFieldValue("logo", event.currentTarget.files[0]);
              }
            }}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {shop?.logo && typeof formik.values.logo === "string" && (
            <p className="text-xs text-muted-foreground mt-1">
              Current: {shop.logo.split("/").pop()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="banner"
            className="text-sm font-medium text-foreground"
          >
            Banner
          </label>
          <input
            id="banner"
            name="banner"
            type="file"
            accept="image/*"
            onChange={(event) => {
              if (event.currentTarget.files) {
                formik.setFieldValue("banner", event.currentTarget.files[0]);
              }
            }}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {shop?.banner && typeof formik.values.banner === "string" && (
            <p className="text-xs text-muted-foreground mt-1">
              Current: {shop.banner.split("/").pop()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-foreground"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.phone}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="country"
            className="text-sm font-medium text-foreground"
          >
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.country}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-foreground">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.city}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="text-sm font-medium text-foreground"
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.address}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="col-span-1 md:col-span-2 pt-4">
          <h3 className="text-lg font-medium text-foreground border-b border-secondary/20 pb-2 mb-4">
            Policies
          </h3>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="return_policy"
            className="text-sm font-medium text-foreground"
          >
            Return Policy
          </label>
          <textarea
            id="return_policy"
            name="return_policy"
            rows={3}
            onChange={formik.handleChange}
            value={formik.values.return_policy}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Detail your return policy..."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="shipping_policy"
            className="text-sm font-medium text-foreground"
          >
            Shipping Policy
          </label>
          <textarea
            id="shipping_policy"
            name="shipping_policy"
            rows={3}
            onChange={formik.handleChange}
            value={formik.values.shipping_policy}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Detail your shipping policy..."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="refund_policy"
            className="text-sm font-medium text-foreground"
          >
            Refund Policy
          </label>
          <textarea
            id="refund_policy"
            name="refund_policy"
            rows={3}
            onChange={formik.handleChange}
            value={formik.values.refund_policy}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Detail your refund policy..."
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Shop"}
        </button>
      </div>
    </form>
  );
}
