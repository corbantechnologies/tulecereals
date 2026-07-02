"use client";
import React from "react";
import toast from "react-hot-toast";
import { useFetchPOSTills } from "@/hooks/postills/actions";
import { Loader2, Monitor, DollarSign, AlertCircle, X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { openShift, closeShift } from "@/services/posshifts";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { useSession } from "next-auth/react";

export const OpenShiftModal = ({
  currency,
  onClose,
}: {
  currency: string;
  onClose: () => void;
}) => {
  const { data: tills = [], isLoading: isTillsLoading } = useFetchPOSTills();
  const queryClient = useQueryClient();
  const axios = useAxiosAuth();

  const activeTills = tills.filter((t: any) => t.is_active);
  const allTillsOccupied = activeTills.length > 0 && activeTills.every((t: any) => t.is_in_use);

  const formik = useFormik({
    initialValues: {
      tillId: "",
      floatAmount: 0,
    },
    validationSchema: Yup.object({
      tillId: Yup.string().required("Please select a till"),
      floatAmount: Yup.number().min(0, "Must be >= 0").required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await openShift({
          till: values.tillId,
          opening_float: values.floatAmount,
        }, axios);
        queryClient.invalidateQueries({ queryKey: ["currentShift"] });
        queryClient.invalidateQueries({ queryKey: ["posshifts"] });
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "Failed to open shift.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-xl hover:bg-[#F5F5F7] text-[#86868B] transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-[#0071E3]/10 text-[#0071E3] rounded-2xl flex items-center justify-center mb-6">
            <Monitor className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">Open Register Shift</h2>
          <p className="text-sm text-[#86868B] mb-8 leading-relaxed">
            You must open a shift before you can process any sales. Select your till and declare your starting cash float.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2">
                Select Till
              </label>
              {isTillsLoading ? (
                <div className="h-12 bg-[#F5F5F7] rounded-xl animate-pulse" />
              ) : activeTills.length === 0 ? (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>No active tills found. Please ask an administrator to create one in POS Settings.</p>
                </div>
              ) : allTillsOccupied ? (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>All tills are currently occupied. Please wait for a till to become available.</p>
                </div>
              ) : (
                <>
                  <select
                    {...formik.getFieldProps("tillId")}
                    className={`w-full px-4 h-12 bg-[#F5F5F7] border rounded-xl text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
                      formik.touched.tillId && formik.errors.tillId ? "border-red-500" : "border-transparent"
                    }`}
                  >
                    <option value="" disabled>Select a till...</option>
                    {activeTills.map((till: any) => (
                      <option key={till.id} value={till.id} disabled={till.is_in_use}>
                        {till.name} {till.is_in_use ? `(In Use by ${till.in_use_by || 'another cashier'})` : ''}
                      </option>
                    ))}
                  </select>
                  {formik.touched.tillId && formik.errors.tillId && (
                    <p className="text-xs text-red-500 mt-1.5">{formik.errors.tillId as string}</p>
                  )}
                </>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                Opening Cash Float ({currency})
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...formik.getFieldProps("floatAmount")}
                  className={`w-full pl-10 pr-4 h-12 bg-[#F5F5F7] border rounded-xl text-sm font-semibold focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
                    formik.touched.floatAmount && formik.errors.floatAmount ? "border-red-500" : "border-transparent"
                  }`}
                />
              </div>
              {formik.touched.floatAmount && formik.errors.floatAmount && (
                <p className="text-xs text-red-500 mt-1.5">{formik.errors.floatAmount as string}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting || activeTills.length === 0 || allTillsOccupied}
              className="w-full h-12 mt-4 bg-[#0071E3] text-white rounded-xl text-sm font-bold hover:bg-[#0077ED] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {formik.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Start Shift
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const CloseShiftModal = ({
  currency,
  onClose,
  reference,
  expectedCash = 0, // 1. Accept expectedCash as a prop
}: {
  currency: string;
  onClose: () => void;
  reference: string;
  expectedCash?: number; // Add type definition
}) => {
  const queryClient = useQueryClient();
  const token = useAxiosAuth();

  const formik = useFormik({
    initialValues: {
      floatAmount: expectedCash, // 2. Automatically pick expected cash here
    },
    enableReinitialize: true, // Allows initialValues to update if expectedCash loads late
    validationSchema: Yup.object({
      floatAmount: Yup.number().min(0, "Must be >= 0").required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await closeShift({ closing_float: values.floatAmount }, reference, token);
        queryClient.invalidateQueries({ queryKey: ["currentShift"] });
        queryClient.invalidateQueries({ queryKey: ["posshifts"] });
        onClose();
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "Failed to close shift.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">Close Shift</h2>
          <p className="text-sm text-[#86868B] mb-8 leading-relaxed">
            Verify or modify the final cash amount in your till before closing the shift. This calculates your discrepancy.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2">
                Closing Cash Float ({currency})
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={String(expectedCash)} // 3. Use expectedCash as placeholder
                  {...formik.getFieldProps("floatAmount")}
                  className={`w-full pl-10 pr-4 h-12 bg-[#F5F5F7] border rounded-xl text-lg font-bold focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
                    formik.touched.floatAmount && formik.errors.floatAmount ? "border-red-500" : "border-transparent"
                  }`}
                />
              </div>
              {formik.touched.floatAmount && formik.errors.floatAmount && (
                <p className="text-xs text-red-500 mt-1.5">{formik.errors.floatAmount as string}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 bg-[#F5F5F7] text-[#1D1D1F] rounded-xl text-sm font-bold hover:bg-[#E8E8ED] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="flex-1 h-12 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {formik.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Close Shift
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// export const CloseShiftModal = ({
//   currency,
//   onClose,
//   reference,
//   expectedCash = 0,
// }: {
//   currency: string;
//   onClose: () => void;
//   reference: string;
//   expectedCash?: number;
// }) => {
//   const queryClient = useQueryClient();
//   const token = useAxiosAuth();

//   const formik = useFormik({
//     initialValues: {
//       floatAmount: expectedCash,
//     },
//     validationSchema: Yup.object({
//       floatAmount: Yup.number().min(0, "Must be >= 0").required("Required"),
//     }),
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         await closeShift(
//           { closing_float: values.floatAmount },
//           reference,
//           token,
//         );
//         queryClient.invalidateQueries({ queryKey: ["currentShift"] });
//         queryClient.invalidateQueries({ queryKey: ["posshifts"] });
//         onClose();
//       } catch (err: any) {
//         toast.error(err?.response?.data?.detail || "Failed to close shift.");
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
//         <div className="p-8">
//           <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
//             Close Shift
//           </h2>
//           <p className="text-sm text-[#86868B] mb-8 leading-relaxed">
//             Enter the final cash amount in your till before closing the shift.
//             This will be recorded to calculate discrepancies.
//           </p>

//           <form onSubmit={formik.handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2">
//                 Closing Cash Float ({currency})
//               </label>
//               <div className="relative">
//                 <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   placeholder={expectedCash}
//                   {...formik.getFieldProps("floatAmount")}
//                   className={`w-full pl-10 pr-4 h-12 bg-[#F5F5F7] border rounded-xl text-lg font-bold focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
//                     formik.touched.floatAmount && formik.errors.floatAmount
//                       ? "border-red-500"
//                       : "border-transparent"
//                   }`}
//                 />
//               </div>
//               {formik.touched.floatAmount && formik.errors.floatAmount && (
//                 <p className="text-xs text-red-500 mt-1.5">
//                   {formik.errors.floatAmount as string}
//                 </p>
//               )}
//             </div>

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 h-12 bg-[#F5F5F7] text-[#1D1D1F] rounded-xl text-sm font-bold hover:bg-[#E8E8ED] transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={formik.isSubmitting}
//                 className="flex-1 h-12 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {formik.isSubmitting && (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 )}
//                 Close Shift
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
