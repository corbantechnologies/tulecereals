"use client";

import { useFetchShopOrder } from "@/hooks/shoporders/actions";
import { formatDate } from "@/components/dashboard/utils";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Edit,
} from "lucide-react";
import { useState } from "react";
import UpdateOrderModal from "@/forms/shoporders/UpdateOrderModal";

export default function ShopOrderDetailPage() {
  const { reference } = useParams() as { reference: string };
  const router = useRouter();
  const { data: order, isLoading, refetch } = useFetchShopOrder(reference);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-secondary/20 rounded mb-4" />
          <div className="h-4 w-32 bg-secondary/20 rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-serif text-foreground">Order Not Found</h1>
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-foreground/50 hover:text-primary transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Orders
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-serif text-foreground">
                  Order Details
                </h1>
                <span className="px-3 py-1 bg-secondary/10 text-foreground/60 text-xs font-mono rounded-sm">
                  #{order.order_reference}
                </span>
              </div>
              <p className="text-foreground/50 text-sm">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
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
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-secondary/20 bg-secondary/5 flex items-center justify-between">
                <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Order Items
                </h3>
                <span className="text-xs text-foreground/50">
                  {order.items.length} items
                </span>
              </div>
              <div className="divide-y divide-secondary/10">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                  >
                    <div className="w-16 h-16 bg-secondary/10 rounded-sm flex items-center justify-center text-foreground/20">
                      <Package className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground">
                            {item.variant}
                          </h4>
                          <p className="text-xs font-mono text-foreground/50 mt-1">
                            SKU: {item.variant_sku}
                          </p>
                        </div>
                        <p className="font-medium text-foreground">
                          ${item.price}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-foreground/60 bg-secondary/10 px-2 py-1 rounded-sm">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          Total: $
                          {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Customer & Info */}
          <div className="space-y-6">
            {/* Vendor Notes Card */}
            <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-secondary/20 bg-secondary/5">
                <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                  <Edit className="w-5 h-5 text-primary" />
                  Vendor Notes
                </h3>
              </div>
              <div className="p-6">
                {order.vendor_notes ? (
                  <p className="text-sm text-foreground/80 italic">
                    &quot;{order.vendor_notes}&quot;
                  </p>
                ) : (
                  <p className="text-sm text-foreground/40 italic">
                    No notes added by vendor yet.
                  </p>
                )}
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-secondary/20 bg-secondary/5">
                <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Customer Details
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                    Name
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {order.customer_name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                    Contact Info
                  </p>
                  <p className="text-sm text-foreground/80">
                    {order.customer_email}
                  </p>
                  <p className="text-sm text-foreground/80">
                    {order.customer_phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Info Card */}
            <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-secondary/20 bg-secondary/5">
                <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Shipping & Tracking
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                    Shipping Address
                  </p>
                  <p className="text-sm text-foreground/80">
                    {order.shipping_address}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                    Tracking Number
                  </p>
                  <p className="text-sm font-mono text-foreground">
                    {order.tracking_number || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdateOrderModal
        order={order}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
