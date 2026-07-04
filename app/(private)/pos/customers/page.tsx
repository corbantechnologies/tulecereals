"use client";

import React, { useState } from "react";
import { useFetchWalkInCustomers } from "@/hooks/walkincustomers/actions";
import { WalkInCustomer } from "@/services/walkincustomers";
import { useFetchAccount } from "@/hooks/accounts/actions";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { Search, Users, Gift, TrendingUp, Calendar } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/utils";

export default function CustomersPage() {
  const { data: user } = useFetchAccount();
  const currency = user?.shop?.currency || "KES";
  
  const [search, setSearch] = useState("");
  const { data: customers = [], isLoading } = useFetchWalkInCustomers(search);

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <SectionHeader
            title="Walk-in Customers & Loyalty"
            description="Manage your in-store customers and their loyalty points."
          />
        </div>

        <div className="bg-white rounded-2xl border border-[#D2D2D7] overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#F5F5F7] bg-[#FAFAFA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#e38800]" /> Customer Directory
            </h3>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
              <input
                type="text"
                placeholder="Search by name or phone..."
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
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Contact</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Loyalty Points</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Total Spent</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Visits</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-[#86868B] uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F7]">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-5 py-4"><div className="h-4 bg-[#F5F5F7] rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-[#86868B]">
                        <Users className="w-8 h-8 text-[#D2D2D7]" />
                        <p className="text-sm font-medium">No customers found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer: WalkInCustomer) => (
                    <tr key={customer.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#1D1D1F]">{customer.name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-mono text-[#6E6E73]">{customer.phone}</p>
                        {customer.email && <p className="text-xs text-[#86868B] mt-0.5">{customer.email}</p>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-100">
                          <Gift className="w-3 h-3" />
                          {customer.loyalty_points.toLocaleString()} pts
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-[#1D1D1F]">
                        {formatCurrency(parseFloat(customer.total_spent), currency)}
                      </td>
                      <td className="px-5 py-4 text-right text-[#6E6E73]">
                        {customer.visit_count}
                      </td>
                      <td className="px-5 py-4 text-right text-[#86868B] text-xs">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
