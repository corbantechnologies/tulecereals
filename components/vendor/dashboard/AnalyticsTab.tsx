"use client";

import React, { useMemo } from "react";
import {
  useKPI,
  useSales,
  useCashierPerformance,
} from "@/hooks/analytics/actions";
import { useFetchAccount, useFetchPOSStaffList } from "@/hooks/accounts/actions";
import { useFetchPOSTills } from "@/hooks/postills/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import SectionHeader from "@/components/dashboard/SectionHeader";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  CreditCard,
  Percent,
  Calendar,
  BarChart3,
  Loader2,
  ScanLine,
  Globe,
  Users,
  MonitorSmartphone,
} from "lucide-react";
import {
  DailyAnalyticsWidget,
  TopSellersWidget,
  ShiftDiscrepanciesWidget,
  InventoryWidget,
  CustomersWidget,
  PaymentMethodsWidget,
} from "@/components/analytics/ExtendedAnalytics";

// --- Components ---

const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  colorClass = "bg-primary/5 text-primary",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  colorClass?: string;
}) => (
  <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5 flex items-start justify-between hover:shadow-md hover:border-[#0071E3]/30 transition-all duration-200 group">
    <div className="flex-1">
      <p className="text-xs uppercase tracking-widest text-[#86868B] font-semibold mb-2">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
        {value}
      </h3>
      {trend && (
        <p className="text-xs text-green-600 mt-1.5 flex items-center font-medium">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </p>
      )}
    </div>
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-4 ${colorClass}`}
    >
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

const SourceBadge = ({
  online,
  pos,
  currency,
}: {
  online: number;
  pos: number;
  currency: string;
}) => {
  const total = online + pos;
  const onlinePct = total > 0 ? (online / total) * 100 : 0;
  const posPct = total > 0 ? (pos / total) * 100 : 0;
  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
      <h3 className="text-base font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-[#e38800]" />
        Revenue by Channel
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center gap-1.5 text-[#6E6E73]">
              <Globe className="w-3.5 h-3.5" /> Online
            </span>
            <span className="font-semibold text-[#1D1D1F]">
              {formatCurrency(online, currency)}{" "}
              <span className="text-xs text-[#86868B]">
                ({onlinePct.toFixed(0)}%)
              </span>
            </span>
          </div>
          <div className="h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e3a300] rounded-full transition-all duration-700"
              style={{ width: `${onlinePct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center gap-1.5 text-[#6E6E73]">
              <ScanLine className="w-3.5 h-3.5" /> POS / Walk-in
            </span>
            <span className="font-semibold text-[#1D1D1F]">
              {formatCurrency(pos, currency)}{" "}
              <span className="text-xs text-[#86868B]">
                ({posPct.toFixed(0)}%)
              </span>
            </span>
          </div>
          <div className="h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${posPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesChart = ({
  data,
  isLoading,
  currency,
}: {
  data:
    | {
        date: string;
        total_revenue: number;
        online_revenue: number;
        pos_revenue: number;
      }[]
    | undefined;
  isLoading: boolean;
  currency: string;
}) => {
  const maxRevenue = useMemo(() => {
    // Check if data is missing, not an array, or empty
    if (!data || !Array.isArray(data) || data.length === 0) return 100;
    return Math.max(...data.map((d) => d.total_revenue)) * 1.1;
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-72 flex items-center justify-center bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7]">
        <Loader2 className="w-6 h-6 animate-spin text-[#e38800]" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center bg-[#F5F5F7] rounded-2xl border border-dashed border-[#D2D2D7] gap-3">
        <div className="w-12 h-12 bg-white rounded-2xl border border-[#D2D2D7] flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-[#D2D2D7]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#1D1D1F]">
            No sales data yet
          </p>
          <p className="text-xs text-[#86868B] mt-1">
            Data will appear here once you start making sales.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#1D1D1F] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#e3a600]" />
          Sales Overview
        </h3>
        <div className="flex items-center gap-3 text-xs text-[#86868B]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#e3ae00] inline-block" />
            Online
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
            POS
          </span>
        </div>
      </div>

      <div className="h-64 flex items-end gap-1.5 md:gap-3 overflow-x-auto pb-2">
        {Array.isArray(data) &&
          data.map((item, index) => {
            const totalHeight = (item.total_revenue / maxRevenue) * 100;
            const onlineHeight =
              item.total_revenue > 0
                ? (item.online_revenue / item.total_revenue) * totalHeight
                : 0;
            const posHeight = totalHeight - onlineHeight;
            return (
              <div
                key={index}
                className="group relative flex flex-col items-center flex-1 min-w-[28px]"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-[#1D1D1F] text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap pointer-events-none shadow-lg">
                  <p className="font-bold">
                    {formatCurrency(item.total_revenue, currency)}
                  </p>
                  <p className="text-[#86868B]">
                    Online: {formatCurrency(item.online_revenue, currency)}
                  </p>
                  <p className="text-emerald-400">
                    POS: {formatCurrency(item.pos_revenue, currency)}
                  </p>
                  <p className="text-[#86868B] mt-0.5">{item.date}</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1D1D1F]" />
                </div>

                {/* Stacked bar */}
                <div className="w-full flex flex-col-reverse rounded-t-lg overflow-hidden">
                  <div
                    className="w-full bg-[#e3ae00]/80 hover:bg-[#e3ae00] transition-colors"
                    style={{ height: `${onlineHeight * 2.56}px` }}
                  />
                  <div
                    className="w-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors"
                    style={{ height: `${posHeight * 2.56}px` }}
                  />
                </div>

                {/* X-Axis Label */}
                <div className="mt-2 text-[10px] text-[#86868B] font-mono truncate w-full text-center hidden md:block">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const CashierPerformanceTable = ({
  data,
  isLoading,
  currency,
}: {
  data: any[] | undefined;
  isLoading: boolean;
  currency: string;
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5 h-64 animate-pulse mt-6" />
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D2D2D7] overflow-hidden mt-6">
      <div className="px-5 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA] flex items-center gap-2">
        <ScanLine className="w-4 h-4 text-[#e39400]" />
        <h3 className="text-base font-bold text-[#1D1D1F]">
          Cashier Performance
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F5F5F7]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                Cashier
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                Sales Made
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                Total Revenue
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                Avg. Sale Value
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                Total Discounts
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((cashier, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#F5F5F7] last:border-0 hover:bg-[#F5F5F7]/50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-semibold text-[#1D1D1F]">
                    {cashier.cashier_name}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {cashier.total_sales}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-emerald-600">
                    {formatCurrency(cashier.total_revenue, currency)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-[#6E6E73]">
                    {formatCurrency(cashier.average_sale_value, currency)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-[#1D1D1F]">
                    {formatCurrency(cashier.total_discount_given || 0, currency)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AnalyticsTab() {
  const { data: user } = useFetchAccount();
  const currency = user?.shop?.currency || "KES";

  const [dateRange, setDateRange] = React.useState("last_30_days");
  const [customStart, setCustomStart] = React.useState("");
  const [customEnd, setCustomEnd] = React.useState("");
  const [groupBy, setGroupBy] = React.useState("day");

  const params = useMemo(() => {
    const p: {
      start_date?: string;
      end_date?: string;
      group_by?: string;
    } = {};

    if (groupBy !== "day") {
      p.group_by = groupBy;
    }

    const today = new Date();
    if (dateRange === "today") {
      p.start_date = today.toISOString().split("T")[0];
      p.end_date = today.toISOString().split("T")[0];
    } else if (dateRange === "last_7_days") {
      const start = new Date(today);
      start.setDate(today.getDate() - 7);
      p.start_date = start.toISOString().split("T")[0];
      p.end_date = today.toISOString().split("T")[0];
    } else if (dateRange === "last_30_days") {
      const start = new Date(today);
      start.setDate(today.getDate() - 30);
      p.start_date = start.toISOString().split("T")[0];
      p.end_date = today.toISOString().split("T")[0];
    } else if (dateRange === "this_month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      p.start_date = start.toISOString().split("T")[0];
      p.end_date = end.toISOString().split("T")[0];
    } else if (dateRange === "custom") {
      if (customStart) p.start_date = customStart;
      if (customEnd) p.end_date = customEnd;
    }

    return p;
  }, [dateRange, customStart, customEnd, groupBy]);

  const { data: kpi, isLoading: kpiLoading } = useKPI(params);
  const { data: sales, isLoading: salesLoading } = useSales(params);
  const { data: cashierPerformance, isLoading: cashierLoading } =
    useCashierPerformance(params);

  // New POS metrics
  const { data: posTills } = useFetchPOSTills();
  const { data: posStaffList } = useFetchPOSStaffList();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionHeader
          title="Analytics"
          description="Combined online + POS performance for your shop."
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-2 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white min-w-[100px]"
          >
            <option value="day">By Day</option>
            <option value="month">By Month</option>
            <option value="year">By Year</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white min-w-[140px]"
          >
            <option value="today">Today</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white"
              />
              <span className="text-[#86868B]">—</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpiLoading ? (
          Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-2xl border border-[#D2D2D7] animate-pulse"
              />
            ))
        ) : kpi ? (
          <>
            <KPICard
              title="Total Revenue"
              value={formatCurrency(kpi.total_revenue, currency)}
              icon={DollarSign}
              colorClass="bg-green-100 text-green-700"
            />
            <KPICard
              title="Online Orders"
              value={kpi.online_orders}
              icon={Globe}
              colorClass="bg-blue-100 text-blue-700"
            />
            <KPICard
              title="POS Sales"
              value={kpi.pos_sales}
              icon={ScanLine}
              colorClass="bg-violet-100 text-violet-700"
            />
            <KPICard
              title="Items Sold"
              value={kpi.items_sold}
              icon={Package}
              colorClass="bg-orange-100 text-orange-700"
            />
            <KPICard
              title="Total Profit"
              value={formatCurrency(kpi.total_profit, currency)}
              icon={TrendingUp}
              colorClass="bg-emerald-100 text-emerald-700"
            />
            <KPICard
              title="Profit Margin"
              value={`${kpi.profit_margin.toFixed(1)}%`}
              icon={Percent}
              colorClass="bg-pink-100 text-pink-700"
            />
            {/* Added POS Metrics */}
            <KPICard
              title="Active POS Tills"
              value={posTills ? posTills.length : 0}
              icon={MonitorSmartphone}
              colorClass="bg-indigo-100 text-indigo-700"
            />
            <KPICard
              title="POS Staff"
              value={posStaffList ? posStaffList.length : 0}
              icon={Users}
              colorClass="bg-cyan-100 text-cyan-700"
            />
          </>
        ) : (
          <div className="col-span-full py-16 text-center">
            <p className="text-sm font-semibold text-[#1D1D1F]">
              No KPI data available
            </p>
            <p className="text-xs text-[#86868B] mt-1">
              Start making sales to see your performance metrics here.
            </p>
          </div>
        )}
      </div>

      {/* Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart
            data={sales}
            isLoading={salesLoading}
            currency={currency}
          />
          <CashierPerformanceTable
            data={cashierPerformance}
            isLoading={cashierLoading}
            currency={currency}
          />
        </div>

        <div className="space-y-5">
          {/* Revenue by Channel */}
          {kpi && (
            <SourceBadge
              online={kpi.online_revenue}
              pos={kpi.pos_revenue}
              currency={currency}
            />
          )}

          {/* Performance Summary */}
          <div className="bg-white rounded-2xl border border-[#D2D2D7] p-5">
            <h3 className="text-base font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#e38800]" />
              Performance Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6E6E73]">Avg. Order Value</span>
                <span className="font-medium text-[#1D1D1F]">
                  {kpi
                    ? formatCurrency(kpi.average_order_value, currency)
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6E6E73]">Online Revenue</span>
                <span className="font-medium text-[#1D1D1F]">
                  {kpi ? formatCurrency(kpi.online_revenue, currency) : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6E6E73]">POS Revenue</span>
                <span className="font-medium text-emerald-600">
                  {kpi ? formatCurrency(kpi.pos_revenue, currency) : "—"}
                </span>
              </div>
              <div className="h-px bg-[#F5F5F7]" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6E6E73]">Busiest Day</span>
                <span className="font-medium text-[#1D1D1F]">
                  {sales && Array.isArray(sales) && sales.length > 0
                    ? new Date(
                        sales.reduce((a, b) =>
                          a.total_revenue > b.total_revenue ? a : b,
                        ).date,
                      ).toLocaleDateString("en-US", { weekday: "long" })
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Analytics Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DailyAnalyticsWidget currency={currency} />
          <TopSellersWidget params={params} currency={currency} />
          <ShiftDiscrepanciesWidget params={params} currency={currency} />
        </div>
        <div className="space-y-6">
          <InventoryWidget currency={currency} />
          <PaymentMethodsWidget params={params} currency={currency} />
          <CustomersWidget />
        </div>
      </div>
    </div>
  );
}
