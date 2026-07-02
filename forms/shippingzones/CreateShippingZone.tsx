"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { createShippingZone } from "@/services/shippingzones";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateShippingZone({
  onSuccess,
  currency,
}: {
  onSuccess?: () => void;
  currency: string;
}) {
  const authHeaders = useAxiosAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      delivery_cost: "",
      estimated_delivery_days: 1,
      is_active: true,
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createShippingZone(values, authHeaders);
        toast.success("Shipping Zone created successfully");
        queryClient.invalidateQueries({ queryKey: ["shippingzones"] });
        formik.resetForm();
        if (onSuccess) onSuccess();
      } catch (error: any) {
        const errorData = error.response?.data;
        console.log("Validation errors:", errorData);
        if (errorData) {
          if (typeof errorData === "object" && !Array.isArray(errorData)) {
            Object.keys(errorData).forEach((key) => {
              const messages = Array.isArray(errorData[key]) ? errorData[key] : [errorData[key]];
              messages.forEach((msg: string) => toast.error(`${key}: ${msg}`));
            });
          } else {
            toast.error("Failed to create shipping zone: " + JSON.stringify(errorData));
          }
        } else {
          toast.error("Failed to create shipping zone");
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 w-full max-w-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Zone Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            placeholder="e.g. East Africa"
            className="w-full px-4 py-2 bg-white border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#1D1D1F] mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          placeholder="Briefly describe the coverage of this zone..."
          className="w-full px-4 py-2 bg-white border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all resize-none"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="delivery_cost" className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Delivery Cost ({currency})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B] text-sm">
              {currency}
            </span>
            <input
              id="delivery_cost"
              name="delivery_cost"
              type="number"
              min="0"
              step="0.01"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.delivery_cost}
              className="w-full pl-12 pr-4 py-2 bg-white border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all"
            />
          </div>
        </div>
        <div>
          <label htmlFor="estimated_delivery_days" className="block text-sm font-medium text-[#1D1D1F] mb-1">
            ETA (Days)
          </label>
          <input
            id="estimated_delivery_days"
            name="estimated_delivery_days"
            type="number"
            min="1"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.estimated_delivery_days}
            className="w-full px-4 py-2 bg-white border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7]">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          onChange={formik.handleChange}
          checked={formik.values.is_active}
          className="h-5 w-5 rounded-lg border-[#D2D2D7] text-[#0071E3] focus:ring-[#0071E3]/20 transition-all"
        />
        <label htmlFor="is_active" className="text-sm font-semibold text-[#1D1D1F] cursor-pointer">
          Zone is Active
          <span className="block text-[10px] text-[#86868B] font-normal uppercase tracking-wider mt-0.5">
            Customers can select this zone during checkout
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#0071E3] text-white font-bold rounded-xl hover:bg-[#0077ED] active:bg-[#005BB5] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#0071E3]/20"
      >
        {loading ? "Creating..." : "Create Shipping Zone"}
      </button>
    </form>
  );
}