"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { updateAccount } from "@/services/accounts";
import { useFetchAccount } from "@/hooks/accounts/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface UpdateAccountFormProps {
  onSuccess?: () => void;
}

export default function UpdateAccountForm({
  onSuccess,
}: UpdateAccountFormProps) {
  const authHeaders = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const { data: vendor } = useFetchAccount();

  const formik = useFormik({
    initialValues: {
      first_name: vendor?.first_name || "",
      last_name: vendor?.last_name || "",
      email: vendor?.email || "",
      phone_number: vendor?.phone_number || "",
      country: vendor?.country || "",
      county: vendor?.county || "",
      town: vendor?.town || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!vendor?.usercode) {
        toast.error("User information not found");
        return;
      }

      setLoading(true);
      try {
        await updateAccount(
          vendor.usercode,
          {
            ...values,
            phone_number: values.phone_number || null,
            county: values.county || null,
            town: values.town || null,
          },
          authHeaders,
        );
        toast.success("Account details updated successfully");
        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error("Failed to update account details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (!vendor) {
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
          <label
            htmlFor="first_name"
            className="text-sm font-medium text-foreground"
          >
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.first_name}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="last_name"
            className="text-sm font-medium text-foreground"
          >
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.last_name}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email Address
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

        <div className="space-y-2">
          <label
            htmlFor="phone_number"
            className="text-sm font-medium text-foreground"
          >
            Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.phone_number}
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
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="county"
            className="text-sm font-medium text-foreground"
          >
            County / State
          </label>
          <input
            id="county"
            name="county"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.county}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="town" className="text-sm font-medium text-foreground">
            Town / City
          </label>
          <input
            id="town"
            name="town"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.town}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
}
