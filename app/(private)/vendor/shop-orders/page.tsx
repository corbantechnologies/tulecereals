"use client";

import { useFetchShopOrders } from "@/hooks/shoporders/actions";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { SkeletonRow } from "@/components/dashboard/DashboardSkeletons";
import { formatDate } from "@/components/dashboard/utils";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function ShopOrdersPage() {
  const { data: orders, isLoading } = useFetchShopOrders();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
        <div className="flex justify-between items-start md:items-center mb-6">
          <SectionHeader
            title="Shop Orders"
            description="Manage and track your incoming orders."
          />
        </div>

        <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/5 border-b border-secondary/20">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                    Reference
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                    Tracking No.
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => <SkeletonRow key={i} />)
                ) : orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-secondary/5 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {order.reference}
                      </td>
                      <td className="px-6 py-4 text-xs text-foreground/60">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/80">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-foreground/50">
                        {order.tracking_number || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter font-medium
                            ${
                              order.status === "PLACED"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "COMPLETED"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "CANCELLED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/vendor/shop-orders/${order.reference}`}
                          className="text-foreground/50 hover:text-primary transition-colors flex items-center gap-1 text-xs"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-foreground/40 italic"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
