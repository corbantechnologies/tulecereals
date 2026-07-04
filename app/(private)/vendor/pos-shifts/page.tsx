"use client";

import React, { useState } from "react";
import { useFetchPOSShifts } from "@/hooks/posshifts/actions";
import { format } from "date-fns";
import { Search, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { POSShift } from "@/services/posshifts";

export default function POSShiftsHistoryPage() {
  const { data: shifts = [], isLoading } = useFetchPOSShifts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShifts = shifts.filter(
    (shift: POSShift) =>
      shift.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.opened_by_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.till_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDiscrepancyBadge = (discrepancy: string | null, status: string) => {
    if (status === "OPEN") return <span className="text-[#86868B]">-</span>;
    if (!discrepancy) return null;

    const val = parseFloat(discrepancy);
    if (val === 0) {
      return (
        <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
        </span>
      );
    } else if (val > 0) {
      return (
        <span className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-md text-xs">
          <AlertTriangle className="w-3.5 h-3.5" /> +{val.toFixed(2)}
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-md text-xs">
          <AlertTriangle className="w-3.5 h-3.5" /> {val.toFixed(2)}
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1D1D1F]">POS Shift Logs</h1>
          <p className="text-[#6E6E73] mt-1">Audit trail for cashiers, tills, and cash floats.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cashier or till..."
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
                <th className="px-6 py-4">Till</th>
                <th className="px-6 py-4">Cashier</th>
                <th className="px-6 py-4">Status / Time</th>
                <th className="px-6 py-4 text-right">Opening Float</th>
                <th className="px-6 py-4 text-right">Expected Cash</th>
                <th className="px-6 py-4 text-right">Declared Cash</th>
                <th className="px-6 py-4 text-right">Discrepancy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[#86868B]">
                    Loading shift logs...
                  </td>
                </tr>
              ) : filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[#86868B]">
                    No shift records found.
                  </td>
                </tr>
              ) : (
                filteredShifts.map((shift: POSShift) => (
                  <tr key={shift.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-semibold text-[#1D1D1F]">
                        {shift.reference}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1D1D1F]">
                      {shift.till_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1D1D1F]">
                      {shift.opened_by_name}
                    </td>
                    <td className="px-6 py-4">
                      {shift.status === "OPEN" ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-emerald-600 mb-1">OPEN</span>
                          <span className="text-xs text-[#86868B] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Since {format(new Date(shift.opened_at), "h:mm a")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#86868B] mb-1">CLOSED</span>
                          <span className="text-xs text-[#86868B]">
                            {format(new Date(shift.opened_at), "MMM d, h:mm a")} -{" "}
                            {shift.closed_at ? format(new Date(shift.closed_at), "h:mm a") : "?"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[#6E6E73]">
                      {parseFloat(shift.opening_float).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-[#1D1D1F]">
                      {parseFloat(shift.expected_cash).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[#6E6E73]">
                      {shift.status === "OPEN" || shift.closing_float === null
                        ? "-"
                        : parseFloat(shift.closing_float).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      {getDiscrepancyBadge(shift.cash_discrepancy, shift.status)}
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
