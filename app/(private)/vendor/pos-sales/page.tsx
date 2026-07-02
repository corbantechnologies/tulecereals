"use client";

import React, { useState } from "react";
import { useFetchPOSSales } from "@/hooks/possales/actions";
import { format } from "date-fns";
import { Search, FileText, ChevronRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { POSSale } from "@/services/possales";
import Link from "next/link";

export default function POSSalesHistoryPage() {
  const { data: sales = [], isLoading } = useFetchPOSSales();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = sales.filter(
    (sale) =>
      sale.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case "HELD":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" /> Held
          </span>
        );
      case "VOIDED":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Voided
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D1D1F]">POS Sales History</h1>
          <p className="text-[#6E6E73] mt-1">Audit log of all physical transactions.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 pl-9 pr-4 py-2 bg-white border border-[#D2D2D7] rounded-full text-sm focus:outline-none focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7] text-xs uppercase tracking-wider text-[#86868B] font-semibold">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Cashier</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[#86868B]">
                    Loading sales logs...
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[#86868B]">
                    No sales records found.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale: POSSale) => (
                  <tr key={sale.id} className="hover:bg-[#FAFAFA] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-semibold text-[#1D1D1F]">
                        {sale.reference}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6E6E73]">
                      {format(new Date(sale.sale_date), "MMM d, yyyy h:mm a")}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1D1D1F]">
                      {sale.served_by_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6E6E73]">
                      {sale.customer_name || "Walk-in"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#6E6E73] bg-[#F5F5F7] px-2 py-1 rounded">
                        {sale.payment_method.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-[#1D1D1F]">
                      {parseFloat(sale.total_amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(sale.status)}</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/vendor/pos-sales/${sale.reference}`}
                        className="p-2 text-[#e38c00] hover:bg-[#0071E3]/10 rounded-full transition-colors inline-block"
                        title="View Details"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
