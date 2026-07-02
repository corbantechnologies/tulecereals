"use client";

import React, { useState } from "react";
import { useFetchPOSStaffList } from "@/hooks/accounts/actions";
import { createPOSStaff, updatePOSStaff, deactivatePOSStaff } from "@/services/accounts";
import { Users, Plus, Edit, Trash2, ShieldAlert } from "lucide-react";
import VendorModal from "@/components/vendor/Modal";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

export default function POSStaffSection() {
  const { data: staffList = [], isLoading, refetch } = useFetchPOSStaffList();
  const header = useAxiosAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      is_active: true,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: editingId 
        ? Yup.string() 
        : Yup.string().email("Invalid email").required("Email is required"),
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const tId = toast.loading(editingId ? "Updating staff..." : "Creating staff account...");
      try {
        if (editingId) {
          await updatePOSStaff(editingId, {
            first_name: values.first_name,
            last_name: values.last_name,
            phone_number: values.phone_number,
            is_active: values.is_active,
          }, header);
          toast.success("Staff updated successfully", { id: tId });
        } else {
          await createPOSStaff({
            email: values.email,
            first_name: values.first_name,
            last_name: values.last_name,
            phone_number: values.phone_number,
          }, header);
          toast.success("Staff account created successfully", { id: tId });
        }
        await refetch();
        setIsModalOpen(false);
      } catch (error: any) {
        console.log(error?.response?.data);
        const errData = error?.response?.data;
        let msg = "Failed to save staff account";
        if (errData && typeof errData === "object") {
          msg = errData.detail || 
                errData.non_field_errors?.[0] || 
                Object.values(errData).flat()[0] || 
                "Failed to save staff account";
        }
        toast.error(msg as string, { id: tId });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOpenModal = (staff: any = null) => {
    if (staff) {
      setEditingId(staff.usercode);
      formik.setValues({
        email: staff.email,
        first_name: staff.first_name,
        last_name: staff.last_name,
        phone_number: staff.phone_number || "",
        is_active: staff.is_active,
      });
    } else {
      setEditingId(null);
      formik.resetForm();
    }
    setIsModalOpen(true);
  };

  const handleDeactivate = async (usercode: string) => {
    if (window.confirm("Are you sure you want to deactivate this cashier? They will no longer be able to log in or process sales.")) {
      const tId = toast.loading("Deactivating...");
      try {
        await deactivatePOSStaff(usercode, header);
        toast.success("Staff deactivated successfully", { id: tId });
        await refetch();
      } catch (error: any) {
        toast.error(error?.response?.data?.detail || "Failed to deactivate", { id: tId });
      }
    }
  };

  return (
    <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden mt-8">
      <div className="px-5 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA] flex justify-between items-center">
        <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#ee9c05]" />
          POS Staff Management
        </h3>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 text-xs font-semibold bg-[#ec9805] text-white px-3 py-1.5 rounded-lg hover:bg-[#0077ED] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Staff
        </button>
      </div>

      <div className="p-4 md:p-8">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
             <div className="h-14 bg-[#F5F5F7] rounded-xl w-full"></div>
             <div className="h-14 bg-[#F5F5F7] rounded-xl w-full"></div>
          </div>
        ) : staffList.length === 0 ? (
          <p className="text-sm text-[#86868B] text-center py-6">No POS Staff accounts created yet.</p>
        ) : (
          <div className="space-y-3">
            {staffList.map((staff: any) => (
              <div key={staff.usercode} className="border border-[#ea940a] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0071E3]/10 text-[#f3a602] rounded-full flex items-center justify-center font-bold text-sm">
                    {staff.first_name[0]}{staff.last_name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1D1D1F]">
                      {staff.first_name} {staff.last_name}
                      {!staff.is_active && (
                        <span className="ml-2 text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          Inactive
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#86868B] mt-0.5">{staff.email} • {staff.phone_number || "No phone"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(staff)} className="p-2 text-[#86868B] hover:text-[#f8de5b] bg-[#F5F5F7] hover:bg-[#0071E3]/10 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  {staff.is_active && (
                    <button onClick={() => handleDeactivate(staff.usercode)} className="p-2 text-[#86868B] hover:text-red-500 bg-[#F5F5F7] hover:bg-red-50 rounded-lg transition-colors" title="Deactivate">
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <VendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Update POS Staff" : "Create POS Staff"}
        maxWidth="max-w-md"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {!editingId && (
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className={`w-full h-11 px-4 bg-[#F5F5F7] border rounded-xl text-sm focus:bg-white focus:border-[#dd9c04] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
                  formik.touched.email && formik.errors.email ? "border-red-500" : "border-transparent"
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{formik.errors.email as string}</p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                type="text"
                {...formik.getFieldProps("first_name")}
                className={`w-full h-11 px-4 bg-[#F5F5F7] border rounded-xl text-sm focus:bg-white focus:border-[#e09d00] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
                  formik.touched.first_name && formik.errors.first_name ? "border-red-500" : "border-transparent"
                }`}
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <p className="text-xs text-red-500 mt-1.5">{formik.errors.first_name as string}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                Last Name
              </label>
              <input
                type="text"
                {...formik.getFieldProps("last_name")}
                className={`w-full h-11 px-4 bg-[#F5F5F7] border rounded-xl text-sm focus:bg-white focus:border-[#efaa08] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
                  formik.touched.last_name && formik.errors.last_name ? "border-red-500" : "border-transparent"
                }`}
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <p className="text-xs text-red-500 mt-1.5">{formik.errors.last_name as string}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="text"
              {...formik.getFieldProps("phone_number")}
              className="w-full h-11 px-4 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
            />
          </div>
          
          {editingId && (
            <label className="flex items-center gap-2 text-sm text-[#1D1D1F] font-medium cursor-pointer">
              <input
                type="checkbox"
                {...formik.getFieldProps("is_active")}
                checked={formik.values.is_active}
                className="w-4 h-4 rounded text-[#eaa608] focus:ring-[#d89905]"
              />
              Staff Account is Active
            </label>
          )}

          {!editingId && (
            <p className="text-xs text-[#86868B] bg-blue-50 text-[#eaa608] p-3 rounded-lg">
              The default password will be generated and sent in an email (or they can use forgot password with this email). For now, the backend auto-generates a secure password.
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-11 bg-[#e9b302] text-white font-semibold rounded-xl text-sm hover:bg-[#0077ED] transition-colors disabled:opacity-50"
            >
              {formik.isSubmitting ? "Saving..." : "Save Staff"}
            </button>
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
