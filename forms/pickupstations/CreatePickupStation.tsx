"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { createPickupStation } from "@/services/pickupstations";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";

export default function CreatePickupStation({
  onSuccess,
  currency,
}: {
  onSuccess?: () => void;
  currency: string;
}) {
  const authHeaders = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
      city: "",
      map_link: "",
      cost_to_customer: "",
      estimated_delivery_days: 1,
      is_active: true,
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createPickupStation(values, authHeaders);
        toast.success("Pickup Station created successfully");
        formik.resetForm();
        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error("Failed to create pickup station");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 w-full max-w-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Name
          </label>
          <input
            id="name"
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
          <label
            htmlFor="city"
            className="block text-sm font-medium text-foreground mb-1"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
            className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Location Description
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.location}
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="map_link"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Map Link (URL)
          </label>
          <input
            id="map_link"
            name="map_link"
            type="url"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.map_link}
            placeholder="https://maps.google.com/..."
            className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="cost_to_customer"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Cost to Customer ({currency})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 text-sm">
              {currency}
            </span>
            <input
              id="cost_to_customer"
              name="cost_to_customer"
              type="number"
              min="0"
              step="0.01"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.cost_to_customer}
              className="w-full pl-12 pr-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="estimated_delivery_days"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Estimated Delivery Days
        </label>
        <input
          id="estimated_delivery_days"
          name="estimated_delivery_days"
          type="number"
          min="0"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.estimated_delivery_days}
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
          Is Active
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Pickup Station"}
      </button>
    </form>
  );
}
