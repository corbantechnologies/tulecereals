"use client";
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useFetchInventory } from "@/hooks/stockadjustments/actions";
import { X, Search, Plus, Minus, Loader2, Package } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createPurchaseOrder } from "@/services/purchaseorders";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePOModal({ onClose }: { onClose: () => void }) {
  const { data: inventory = [], isLoading: isInvLoading } = useFetchInventory();
  const header = useAxiosAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<{
    variantId: string;
    productName: string;
    sku: string;
    quantity: number;
    costPrice: number;
  }[]>([]);

  const filteredInventory = useMemo(() => {
    const q = search.toLowerCase();
    return inventory.filter(
      (item) => item.product_name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)
    );
  }, [inventory, search]);

  const handleAddItem = (item: any) => {
    const exists = selectedItems.find((i) => i.variantId === item.variant_id);
    if (!exists) {
      setSelectedItems([
        ...selectedItems,
        {
          variantId: item.variant_id,
          productName: item.product_name,
          sku: item.sku,
          quantity: 1,
          costPrice: 0,
        },
      ]);
    }
    setSearch("");
  };

  const handleUpdateItem = (variantId: string, field: "quantity" | "costPrice", value: number) => {
    setSelectedItems(
      selectedItems.map((item) => {
        if (item.variantId === variantId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (variantId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.variantId !== variantId));
  };

  const formik = useFormik({
    initialValues: {
      supplierName: "",
      expectedDate: "",
      notes: "",
    },
    validationSchema: Yup.object({
      supplierName: Yup.string().required("Supplier Name is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (selectedItems.length === 0) return toast.error("Please add at least one item.");

      try {
        await createPurchaseOrder({
          supplier_name: values.supplierName,
          expected_date: values.expectedDate || undefined,
          notes: values.notes || undefined,
          items: selectedItems.map((item) => ({
            variant: item.variantId,
            quantity: item.quantity,
            cost_price: item.costPrice,
          })),
        }, header);
        queryClient.invalidateQueries({ queryKey: ["purchaseorders"] });
        onClose();
      } catch (error) {
        console.error(error);
        toast.error("Failed to create Purchase Order.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F5F5F7]">
          <h2 className="text-lg font-bold text-[#1D1D1F]">Create Purchase Order</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#fae585] text-[#86868B] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8">
          {/* Left: Form Details */}
          <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col h-full">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2">
                  Supplier Name
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("supplierName")}
                  placeholder="e.g. Acme Corp"
                  className={`w-full h-11 px-4 bg-[#F5F5F7] border rounded-xl text-sm focus:bg-white focus:border-[#f3c017] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none ${
                    formik.touched.supplierName && formik.errors.supplierName ? "border-red-500" : "border-transparent"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  {...formik.getFieldProps("expectedDate")}
                  className="w-full h-11 px-4 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-2">
                  Notes
                </label>
                <textarea
                  {...formik.getFieldProps("notes")}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none resize-none"
                />
              </div>

            {/* Selected Items List */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-[#1D1D1F] mb-4">Order Items ({selectedItems.length})</h3>
              {selectedItems.length === 0 ? (
                <div className="p-8 border border-dashed border-[#D2D2D7] rounded-xl text-center text-[#86868B] text-sm">
                  Search and select products to order.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div key={item.variantId} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white border border-[#D2D2D7] rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1D1D1F] truncate">{item.productName}</p>
                        <p className="text-xs text-[#86868B] font-mono">{item.sku}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <label className="text-[10px] text-[#86868B] mb-1">Unit Cost</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.costPrice}
                            onChange={(e) => handleUpdateItem(item.variantId, "costPrice", parseFloat(e.target.value) || 0)}
                            className="w-24 h-8 px-2 border border-[#D2D2D7] rounded text-sm outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-[#86868B] mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.variantId, "quantity", parseInt(e.target.value) || 1)}
                            className="w-16 h-8 px-2 border border-[#D2D2D7] rounded text-sm outline-none text-center"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.variantId)}
                          className="mt-5 p-1.5 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          </form>

          {/* Right: Product Search */}
          <div className="flex-1 lg:max-w-sm flex flex-col h-[400px] lg:h-auto border border-[#F5F5F7] rounded-2xl overflow-hidden bg-[#FAFAFA]">
            <div className="p-4 border-b border-[#F5F5F7] bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 bg-[#F5F5F7] border-transparent rounded-lg text-sm focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {isInvLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#f5d221]" /></div>
              ) : filteredInventory.length === 0 ? (
                <div className="text-center p-8 text-sm text-[#86868B]">No products found.</div>
              ) : (
                <div className="space-y-1">
                  {filteredInventory.slice(0, 20).map((item) => (
                    <button
                      key={item.variant_id}
                      onClick={() => handleAddItem(item)}
                      className="w-full text-left p-3 hover:bg-white rounded-lg transition-colors flex justify-between items-center group"
                    >
                      <div className="truncate pr-4">
                        <p className="text-sm font-semibold text-[#1D1D1F] truncate">{item.product_name}</p>
                        <p className="text-xs text-[#86868B] font-mono">{item.sku}</p>
                      </div>
                      <Plus className="w-4 h-4 text-[#86868B] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#F5F5F7] bg-[#FAFAFA] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => formik.submitForm()}
            disabled={formik.isSubmitting || selectedItems.length === 0 || !formik.values.supplierName}
            className="px-6 py-2.5 bg-[#f3b71e] text-white rounded-xl text-sm font-semibold hover:bg-[#f9de70] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {formik.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
