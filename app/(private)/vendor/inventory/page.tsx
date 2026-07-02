"use client";

import React, { useState, useMemo } from "react";
import {
  useFetchInventory,
  useFetchLowStock,
  useFetchStockAdjustments,
} from "@/hooks/stockadjustments/actions";
import { InventoryItem, createStockAdjustment } from "@/services/stockadjustments";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import SectionHeader from "@/components/dashboard/SectionHeader";
import {
  Search,
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  History,
  Loader2,
  CheckCircle2,
  X,
  Package,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function attrLabel(attrs: Record<string, string>) {
  const entries = Object.entries(attrs);
  if (!entries.length) return "Standard";
  return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
}

const REASONS = [
  { value: "RESTOCK", label: "Restocking" },
  { value: "DAMAGE", label: "Damaged Goods" },
  { value: "CORRECTION", label: "Inventory Correction" },
  { value: "RETURN", label: "Customer Return" },
  { value: "OTHER", label: "Other" },
] as const;

// ─── Adjust Modal ─────────────────────────────────────────────────────────────

const AdjustModal = ({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();
  const [isPending, setIsPending] = useState(false);
  const [type, setType] = useState<"add" | "remove">("add");
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState<string>("RESTOCK");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const newStock = type === "add" ? item.stock + qty : item.stock - qty;

  const handleSubmit = async () => {
    setError("");
    setIsPending(true);
    try {
      await createStockAdjustment({
        variant: item.variant_id,
        quantity_change: type === "add" ? qty : -qty,
        reason: reason as any,
        notes: notes || undefined,
      }, header);
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["lowstock"] });
      queryClient.invalidateQueries({ queryKey: ["stockadjustments"] });
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.quantity_change?.[0] ||
          err?.response?.data?.detail ||
          "Adjustment failed.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#F5F5F7] text-[#86868B] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-base font-bold text-[#1D1D1F] mb-1">
          Adjust Stock
        </h2>
        <p className="text-sm text-[#86868B] mb-5">
          {item.product_name} · {attrLabel(item.attributes)}
        </p>

        {success ? (
          <div className="py-8 flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <p className="text-sm font-semibold text-[#1D1D1F]">
              Stock updated successfully!
            </p>
          </div>
        ) : (
          <>
            {/* Current Stock */}
            <div className="bg-[#F5F5F7] rounded-xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#86868B]">Current Stock</p>
                <p className="text-2xl font-bold text-[#1D1D1F]">
                  {item.stock}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#86868B]">After Adjustment</p>
                <p
                  className={`text-2xl font-bold ${
                    newStock < 0
                      ? "text-red-500"
                      : newStock <= item.reorder_level
                      ? "text-amber-500"
                      : "text-emerald-600"
                  }`}
                >
                  {newStock}
                </p>
              </div>
            </div>

            {/* Add / Remove toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => {
                  setType("add");
                  setReason("RESTOCK");
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  type === "add"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                    : "border-[#D2D2D7] text-[#6E6E73] hover:border-emerald-300"
                }`}
              >
                <Plus className="w-4 h-4" /> Add Stock
              </button>
              <button
                onClick={() => {
                  setType("remove");
                  setReason("DAMAGE");
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  type === "remove"
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-[#D2D2D7] text-[#6E6E73] hover:border-red-300"
                }`}
              >
                <Minus className="w-4 h-4" /> Remove Stock
              </button>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl border border-[#D2D2D7] flex items-center justify-center hover:bg-[#F5F5F7] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center py-2.5 border border-[#D2D2D7] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3]"
              />
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 rounded-xl border border-[#D2D2D7] flex items-center justify-center hover:bg-[#F5F5F7] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Reason */}
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] mb-4 bg-white"
            >
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            {/* Notes */}
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] resize-none mb-4"
            />

            {error && (
              <p className="text-xs text-red-500 mb-3 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isPending || newStock < 0}
              className="w-full py-3 bg-[#e38800] text-white rounded-xl text-sm font-semibold hover:bg-[#0077ED] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Save Adjustment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const { data: inventory = [], isLoading } = useFetchInventory();
  const { data: lowStock = [] } = useFetchLowStock();
  const { data: adjustments = [] } = useFetchStockAdjustments();

  const [search, setSearch] = useState("");
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [tab, setTab] = useState<"all" | "low" | "history">("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return inventory.filter(
      (item) =>
        item.product_name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q),
    );
  }, [inventory, search]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHeader
            title="Inventory"
            description="Monitor stock levels and log manual adjustments."
          />
          {lowStock.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
              <AlertTriangle className="w-4 h-4" />
              {lowStock.length} item{lowStock.length !== 1 ? "s" : ""} low on stock
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white rounded-xl border border-[#D2D2D7] p-1 w-fit">
          {[
            { key: "all", label: "All Stock", icon: Boxes },
            { key: "low", label: `Low Stock (${lowStock.length})`, icon: AlertTriangle },
            { key: "history", label: "Adjustment Log", icon: History },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key
                  ? "bg-[#e38800] text-white shadow-sm"
                  : "text-[#6E6E73] hover:text-[#1D1D1F]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === "all" && (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
              <input
                type="text"
                placeholder="Search by product name or SKU…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all"
              />
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-white rounded-2xl border border-[#D2D2D7] animate-pulse"
                    />
                  ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 bg-white rounded-2xl border border-dashed border-[#D2D2D7]">
                <Package className="w-10 h-10 text-[#D2D2D7]" />
                <p className="text-sm font-semibold text-[#1D1D1F]">No products found</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D2D2D7] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#F5F5F7]">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                        Product
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider hidden md:table-cell">
                        SKU
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider hidden sm:table-cell">
                        Reorder At
                      </th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr
                        key={item.variant_id}
                        className="border-b border-[#F5F5F7] last:border-0 hover:bg-[#F5F5F7]/50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-[#1D1D1F]">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-[#86868B]">
                            {attrLabel(item.attributes)}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-mono text-[#86868B] hidden md:table-cell">
                          {item.sku}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.stock === 0
                                ? "bg-red-100 text-red-600"
                                : item.is_low_stock
                                ? "bg-amber-100 text-amber-600"
                                : "bg-emerald-100 text-emerald-600"
                            }`}
                          >
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-xs text-[#86868B] hidden sm:table-cell">
                          {item.reorder_level}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setAdjustItem(item)}
                            className="px-3 py-1.5 rounded-lg border border-[#D2D2D7] text-xs font-medium text-[#1D1D1F] hover:border-[#0071E3] hover:text-[#0071E3] transition-colors"
                          >
                            Adjust
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === "low" && (
          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 bg-white rounded-2xl border border-dashed border-[#D2D2D7]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <p className="text-sm font-semibold text-[#1D1D1F]">
                  All stock levels are healthy!
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D2D2D7] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#F5F5F7]">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                        Product
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                        Reorder At
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                        Deficit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item) => (
                      <tr
                        key={item.variant_id}
                        className="border-b border-[#F5F5F7] last:border-0"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-[#1D1D1F]">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-[#86868B]">
                            {attrLabel(item.attributes)} · {item.sku}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-600">
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right text-sm text-[#6E6E73]">
                          {item.reorder_level}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="text-sm font-semibold text-red-500">
                            -{item.units_below_reorder}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="bg-white rounded-2xl border border-[#D2D2D7] overflow-x-auto">
            {adjustments.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <History className="w-10 h-10 text-[#D2D2D7]" />
                <p className="text-sm font-semibold text-[#1D1D1F]">
                  No adjustments logged yet
                </p>
                <p className="text-xs text-[#86868B]">
                  Stock adjustments will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F5F5F7]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                      Variant
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider hidden md:table-cell">
                      Reason
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                      Change
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider hidden sm:table-cell">
                      Before / After
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider hidden lg:table-cell">
                      By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adjustments.map((adj) => (
                    <tr
                      key={adj.id}
                      className="border-b border-[#F5F5F7] last:border-0 hover:bg-[#F5F5F7]/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-[#1D1D1F]">
                          {adj.variant_name}
                        </p>
                        <p className="text-xs text-[#86868B] font-mono">
                          {adj.variant_sku}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-[#6E6E73] hidden md:table-cell">
                        {adj.reason_display}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-bold ${
                            adj.quantity_change > 0
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {adj.quantity_change > 0 ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          {adj.quantity_change > 0 ? "+" : ""}
                          {adj.quantity_change}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-[#86868B] hidden sm:table-cell">
                        {adj.stock_before} → {adj.stock_after}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#6E6E73] hidden lg:table-cell">
                        {adj.adjusted_by_name}
                        <br />
                        <span className="text-[10px] text-[#86868B]">
                          {new Date(adj.created_at).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Adjust Modal */}
      {adjustItem && (
        <AdjustModal item={adjustItem} onClose={() => setAdjustItem(null)} />
      )}
    </div>
  );
}
