"use client";

import React from "react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { Settings, Percent, Gift } from "lucide-react";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { updateShop } from "@/services/shops";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function POSConfigSection() {
  const { data: vendor, isLoading: isAccountLoading } = useFetchAccount();
  const axios = useAxiosAuth();

  const formik = useFormik({
    initialValues: {
      tax_rate: vendor?.shop?.tax_rate || "0.00",
      loyalty_points_per_unit: vendor?.shop?.loyalty_points_per_unit || 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      tax_rate: Yup.number().min(0, "Must be greater than or equal to 0").required("Required"),
      loyalty_points_per_unit: Yup.number().min(0, "Must be greater than or equal to 0").required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!vendor?.shop?.shop_code) return;

      const toastId = toast.loading("Saving configuration...");
      try {
        const data = new FormData();
        data.append("tax_rate", values.tax_rate.toString());
        data.append("loyalty_points_per_unit", values.loyalty_points_per_unit.toString());

        await updateShop(vendor.shop.shop_code, data, axios);
        toast.success("POS Configuration updated successfully!", { id: toastId });
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to update POS configuration", { id: toastId });
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isAccountLoading) {
    return (
      <div className="bg-white border border-[#D2D2D7] rounded-2xl p-8 mt-8 animate-pulse">
        <div className="h-6 w-1/3 bg-[#F5F5F7] rounded mb-6"></div>
        <div className="h-10 w-full bg-[#F5F5F7] rounded mb-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden mt-8">
      <div className="px-5 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA] flex items-center gap-2">
        <Settings className="w-4 h-4 text-[#f3c50e]" />
        <h3 className="text-sm font-bold text-[#1D1D1F]">POS Configuration</h3>
      </div>

      <div className="p-4 md:p-8">
        <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5" />
                Global Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...formik.getFieldProps("tax_rate")}
                className={`w-full h-11 px-4 bg-[#F5F5F7] border rounded-xl text-sm focus:bg-white focus:border-[#eea915] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
                  formik.touched.tax_rate && formik.errors.tax_rate
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.tax_rate && formik.errors.tax_rate ? (
                <p className="text-[10px] text-red-500 mt-1.5 leading-relaxed">
                  {formik.errors.tax_rate as string}
                </p>
              ) : (
                <p className="text-[10px] text-[#86868B] mt-1.5 leading-relaxed">
                  Applied to all POS sales. Set to 0 if tax is included in
                  product prices.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                Loyalty Points Per {vendor?.shop?.currency || "Unit"}
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                {...formik.getFieldProps("loyalty_points_per_unit")}
                className={`w-full h-11 px-4 bg-[#F5F5F7] border rounded-xl text-sm focus:bg-white focus:border-[#f6b70a] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
                  formik.touched.loyalty_points_per_unit &&
                  formik.errors.loyalty_points_per_unit
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.loyalty_points_per_unit &&
              formik.errors.loyalty_points_per_unit ? (
                <p className="text-[10px] text-red-500 mt-1.5 leading-relaxed">
                  {formik.errors.loyalty_points_per_unit as string}
                </p>
              ) : (
                <p className="text-[10px] text-[#86868B] mt-1.5 leading-relaxed">
                  Number of points awarded per 1 {vendor?.shop?.currency} spent.
                  Example: 10 means KES 10 = 1 point.
                </p>
              )}
            </div>
          </div>

          {/* <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">M-Pesa Callbacks</h4>
            <p className="text-sm text-blue-900 mb-2">
              For POS M-Pesa STK push to work automatically, configure your Safaricom Paybill/Till callback to:
            </p>
            <code className="text-xs bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 select-all font-mono">
              [YOUR_API_DOMAIN]/api/v1/possales/mpesa-callback/
            </code>
            <p className="text-xs text-blue-700 mt-2">
              Set this in your backend `.env` as `MPESA_POS_CALLBACK_URL`.
            </p>
          </div> */}

          <div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="h-11 px-6 bg-[#f3b408] text-white font-semibold rounded-xl text-sm hover:bg-[#fce44c] transition-colors disabled:opacity-50"
            >
              {formik.isSubmitting ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
