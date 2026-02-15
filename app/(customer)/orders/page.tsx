"use client";

import { useFetchOrders } from "@/hooks/orders/actions";
import { formatCurrency, formatDate } from "@/components/dashboard/utils";
import {
  Loader2,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Filter,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data: ordersData, isLoading } = useFetchOrders({ page, status });

  const statuses = [
    { label: "All Orders", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle empty state separately only if no filters are applied
  if (
    (!ordersData || ordersData.results.length === 0) &&
    !status &&
    page === 1
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50">
        <div className="bg-white p-6 rounded-full shadow-sm">
          <ShoppingBag className="w-12 h-12 text-foreground/20" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground">
          No Orders Yet
        </h1>
        <p className="text-muted-foreground text-center max-w-sm">
          You haven&apos;t placed any orders yet. Start shopping to see your
          orders here.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              My Orders
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage and track your recent orders.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            Continue Shopping <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex justify-end">
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex items-center justify-center gap-2 rounded-sm bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {statuses.find((s) => s.value === status)?.label || "Filter"}
            </MenuButton>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {statuses.map((s) => (
                    <MenuItem key={s.value}>
                      {({ focus }) => (
                        <button
                          onClick={() => {
                            setStatus(s.value);
                            setPage(1); // Reset to first page on filter change
                          }}
                          className={`${
                            focus
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          } ${
                            status === s.value
                              ? "bg-secondary/10 font-medium"
                              : ""
                          } block w-full px-4 py-2 text-left text-sm`}
                        >
                          {s.label}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  <th className="px-6 py-4">Order Reference</th>
                  <th className="px-6 py-4">Date Placed</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordersData?.results.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground text-sm font-mono">
                        #{order.reference}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/80">
                      <div className="flex flex-col">
                        <span>{formatDate(order.created_at)}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {formatCurrency(parseFloat(order.total_amount), "KES")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          order.payment_status === "PAID" ||
                          order.payment_status === "COMPLETED"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : order.payment_status === "PENDING"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/60">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/orders/${order.reference}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-muted-foreground hover:text-primary hover:border-primary transition-colors shadow-sm"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {(!ordersData?.results || ordersData.results.length === 0) && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-muted-foreground italic"
                    >
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {ordersData && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/30">
              <span className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {ordersData.results.length}
                </span>{" "}
                orders
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!ordersData.previous}
                  className="p-2 rounded-sm border border-gray-200 bg-white text-muted-foreground hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-sm font-medium text-foreground min-w-[2rem] text-center">
                  {page}
                </div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!ordersData.next}
                  className="p-2 rounded-sm border border-gray-200 bg-white text-muted-foreground hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
