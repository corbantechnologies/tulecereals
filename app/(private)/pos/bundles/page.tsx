"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { Search, Plus, Layers, Trash2, Edit2 } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/utils";
import { useFetchPOSBundles, useDeletePOSBundle } from "@/hooks/posbundles/actions";
import { POSBundle } from "@/services/posbundles";
import CreateBundleModal from "@/components/vendor/pos/CreateBundleModal";

export default function BundlesPage() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: bundles = [], isLoading } = useFetchPOSBundles(false);
  const deleteMutation = useDeletePOSBundle();

  const filteredBundles = bundles.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to deactivate this bundle?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <SectionHeader
            title="POS Bundles"
            description="Manage predefined sets of products sold together at a fixed price."
          />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#e39b00] text-white rounded-xl text-sm font-semibold hover:bg-[#0077ED] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Bundle
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#D2D2D7] overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#F5F5F7] bg-[#FAFAFA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#e39000]" /> Bundle Directory
            </h3>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
              <input
                type="text"
                placeholder="Search bundles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F5F5F7] bg-white">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Bundle</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Items Included</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Bundle Price</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F7]">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-4"><div className="h-4 bg-[#F5F5F7] rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : filteredBundles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-[#86868B]">
                        <Layers className="w-8 h-8 text-[#D2D2D7]" />
                        <p className="text-sm font-medium">No bundles found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBundles.map((bundle: POSBundle) => (
                    <tr key={bundle.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#1D1D1F]">{bundle.name}</p>
                        {bundle.description && <p className="text-xs text-[#86868B] mt-0.5 line-clamp-1">{bundle.description}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          {bundle.items.map((i) => (
                            <span key={i.variant_id} className="text-xs text-[#6E6E73] font-mono bg-[#E3E3E8] px-1.5 py-0.5 rounded w-fit">
                              {i.quantity}x {i.product_name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-[#1D1D1F]">
                        {formatCurrency(parseFloat(bundle.price))}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${bundle.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                          {bundle.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(bundle.id)}
                          className="p-2 text-[#86868B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deactivate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateBundleModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
