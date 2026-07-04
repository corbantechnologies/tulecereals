"use client";

import React, { useMemo, useState } from "react";
import { formatCurrency } from "@/components/dashboard/utils";
import {
  Package,
  AlertCircle,
  Users,
  CreditCard,
  CalendarDays,
  FileWarning,
  TrendingUp,
  Layers,
} from "lucide-react";
import {
  useDailyAnalytics,
  useTopSellers,
  useInventoryAnalytics,
  usePaymentMethodsAnalytics,
  useCustomersAnalytics,
  useShiftDiscrepancies,
  useBundleAnalytics,
} from "@/hooks/analytics/actions";

// --- Daily Analytics Component ---
export const DailyAnalyticsWidget = ({ currency }: { currency: string }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { data, isLoading } = useDailyAnalytics({ date: selectedDate });

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  if (isLoading) return <div className="h-64 bg-white rounded-2xl animate-pulse" />;
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#1D1D1F] flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#e3a300]" />
          End of Day Sales {isToday ? "(Today)" : ""}
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-1.5 border border-[#D2D2D7] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#F5F5F7] p-3 rounded-xl text-center">
          <p className="text-xs text-[#86868B] uppercase tracking-wider font-semibold">Revenue</p>
          <p className="text-lg font-bold text-[#1D1D1F]">{formatCurrency(data.summary.total_revenue, currency)}</p>
        </div>
        <div className="bg-[#F5F5F7] p-3 rounded-xl text-center">
          <p className="text-xs text-[#86868B] uppercase tracking-wider font-semibold">Orders</p>
          <p className="text-lg font-bold text-[#1D1D1F]">{data.summary.total_orders}</p>
        </div>
        <div className="bg-[#F5F5F7] p-3 rounded-xl text-center">
          <p className="text-xs text-[#86868B] uppercase tracking-wider font-semibold">Avg Value</p>
          <p className="text-lg font-bold text-[#1D1D1F]">{formatCurrency(data.summary.average_order_value, currency)}</p>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-[#1D1D1F] mb-3">Top Products on {isToday ? "Today" : selectedDate}</h4>
      {data.top_sellers.length === 0 ? (
        <p className="text-sm text-[#86868B]">No sales recorded on this day.</p>
      ) : (
        <div className="space-y-3">
          {data.top_sellers.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-sm border-b border-[#F5F5F7] pb-2 last:border-0 last:pb-0">
              <div>
                <p className="font-medium text-[#1D1D1F]">{item.product_name}</p>
                <p className="text-xs text-[#86868B]">{item.quantity_sold} sold</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-emerald-600">{formatCurrency(item.revenue, currency)}</p>
                <p className="text-xs text-[#86868B]">Stock: {item.remaining_stock}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Top Sellers Component ---
export const TopSellersWidget = ({ params, currency }: { params: any, currency: string }) => {
  const { data, isLoading } = useTopSellers(params);

  if (isLoading) return <div className="h-64 bg-white rounded-2xl animate-pulse" />;
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
      <h3 className="text-base font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#e3aa00]" />
        Top Sellers (Selected Period)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F5F5F7]">
              <th className="text-left py-2 font-semibold text-[#86868B]">Product</th>
              <th className="text-right py-2 font-semibold text-[#86868B]">Qty Sold</th>
              <th className="text-right py-2 font-semibold text-[#86868B]">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-[#F5F5F7] last:border-0">
                <td className="py-3 font-medium text-[#1D1D1F]">{item.product_name}</td>
                <td className="py-3 text-right">{item.quantity_sold}</td>
                <td className="py-3 text-right text-emerald-600 font-semibold">{formatCurrency(item.revenue, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Shift Discrepancies Component ---
export const ShiftDiscrepanciesWidget = ({ params, currency }: { params: any, currency: string }) => {
  const { data, isLoading } = useShiftDiscrepancies(params);

  if (isLoading) return <div className="h-48 bg-white rounded-2xl animate-pulse" />;
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
      <h3 className="text-base font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
        <FileWarning className="w-4 h-4 text-orange-500" />
        Shift Discrepancies
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F5F5F7]">
              <th className="text-left py-2 font-semibold text-[#86868B]">Cashier</th>
              <th className="text-right py-2 font-semibold text-[#86868B]">Shifts</th>
              <th className="text-right py-2 font-semibold text-[#86868B]">Net Discrepancy</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-[#F5F5F7] last:border-0">
                <td className="py-3 font-medium text-[#1D1D1F]">{item.cashier_name}</td>
                <td className="py-3 text-right">{item.total_shifts}</td>
                <td className={`py-3 text-right font-semibold ${item.total_discrepancy < 0 ? 'text-red-500' : item.total_discrepancy > 0 ? 'text-blue-500' : 'text-emerald-500'}`}>
                  {item.total_discrepancy < 0 ? '-' : item.total_discrepancy > 0 ? '+' : ''}{formatCurrency(Math.abs(item.total_discrepancy), currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Inventory Analytics Component ---
export const InventoryWidget = ({ currency }: { currency: string }) => {
  const { data, isLoading } = useInventoryAnalytics();

  if (isLoading) return <div className="h-64 bg-white rounded-2xl animate-pulse" />;
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
      <h3 className="text-base font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
        <Package className="w-4 h-4 text-[#e38800]" />
        Inventory Health
      </h3>
      <div className="mb-5 bg-[#F5F5F7] p-4 rounded-xl">
        <p className="text-sm text-[#86868B] uppercase tracking-wider font-semibold mb-1">Total Inventory Value</p>
        <p className="text-2xl font-bold text-[#1D1D1F]">{formatCurrency(data.total_valuation, currency)}</p>
      </div>

      <h4 className="text-sm font-semibold text-[#1D1D1F] mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-orange-500" />
        Low Stock Alerts ({data.low_stock_alerts.length})
      </h4>
      <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
        {data.low_stock_alerts.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center text-sm border-b border-[#F5F5F7] pb-2 last:border-0">
            <div>
              <p className="font-medium text-[#1D1D1F]">{item.product_name}</p>
              <p className="text-xs text-[#86868B]">SKU: {item.sku}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-red-500">{item.stock} left</p>
              <p className="text-[10px] text-[#86868B]">Reorder: {item.reorder_level}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Customer Loyalty Component ---
export const CustomersWidget = () => {
  const { data, isLoading } = useCustomersAnalytics();

  if (isLoading) return <div className="h-64 bg-white rounded-2xl animate-pulse" />;
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
      <h3 className="text-base font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
        <Users className="w-4 h-4 text-[#e39b00]" />
        Customer Loyalty
      </h3>
      <div className="mb-5 bg-[#F5F5F7] p-4 rounded-xl">
        <p className="text-sm text-[#86868B] uppercase tracking-wider font-semibold mb-1">Total Points Issued</p>
        <p className="text-2xl font-bold text-amber-600">{data.total_loyalty_points_issued}</p>
      </div>

      <h4 className="text-sm font-semibold text-[#1D1D1F] mb-3">Top Walk-in Customers</h4>
      <div className="space-y-3">
        {data.top_customers.slice(0, 5).map((customer: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center text-sm border-b border-[#F5F5F7] pb-2 last:border-0">
            <p className="font-medium text-[#1D1D1F]">{customer.name || customer.phone || 'Guest'}</p>
            <p className="font-semibold text-[#e38c00]">{customer.loyalty_points} pts</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Payment Methods Component ---
export const PaymentMethodsWidget = ({ params, currency }: { params: any, currency: string }) => {
  const { data, isLoading } = usePaymentMethodsAnalytics(params);

  if (isLoading) return <div className="h-48 bg-white rounded-2xl animate-pulse" />;
  if (!data || data.length === 0) return null;

  const total = data.reduce((acc: number, curr: any) => acc + curr.total_revenue, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
      <h3 className="text-base font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-[#e39b00]" />
        POS Payment Methods
      </h3>
      <div className="space-y-4">
        {data.map((method: any, idx: number) => {
          const pct = total > 0 ? (method.total_revenue / total) * 100 : 0;
          return (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-[#1D1D1F]">{method.payment_method}</span>
                <span className="font-semibold text-[#1D1D1F]">
                  {formatCurrency(method.total_revenue, currency)}{" "}
                  <span className="text-xs text-[#86868B]">({pct.toFixed(0)}%)</span>
                </span>
              </div>
              <div className="h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#e38c00] rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- Bundle Performance Component ---
export const BundlePerformanceWidget = ({ currency }: { currency: string }) => {
  const { data, isLoading } = useBundleAnalytics();

  if (isLoading) return <div className="h-64 bg-white rounded-2xl animate-pulse" />;
  if (!data || data.top_bundles.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
      <h3 className="text-base font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
        <Layers className="w-4 h-4 text-[#e38800]" />
        POS Bundle Performance
      </h3>
      <div className="mb-5 bg-[#F5F5F7] p-4 rounded-xl">
        <p className="text-sm text-[#86868B] uppercase tracking-wider font-semibold mb-1">Total Bundle Revenue</p>
        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(data.total_bundle_revenue, currency)}</p>
      </div>

      <h4 className="text-sm font-semibold text-[#1D1D1F] mb-3">Top Selling Bundles</h4>
      <div className="space-y-3">
        {data.top_bundles.map((bundle: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center text-sm border-b border-[#F5F5F7] pb-2 last:border-0 last:pb-0">
            <div>
              <p className="font-medium text-[#1D1D1F] flex items-center gap-2">
                {bundle.name}
                {!bundle.is_active && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded uppercase font-bold tracking-wider">Inactive</span>}
              </p>
              <p className="text-xs text-[#86868B]">{bundle.quantity_sold} sold</p>
            </div>
            <div className="text-right font-semibold text-[#e39400]">
              {formatCurrency(bundle.revenue, currency)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
