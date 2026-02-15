"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { useFetchOrder } from "@/hooks/orders/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = use(params);
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";
  const { data: order, isLoading } = useFetchOrder(reference);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#F9F7F2]">
        <AlertCircle className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-bold text-foreground">Order Not Found</h1>
        <Link
          href="/orders"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Orders
        </Link>
      </div>
    );
  }

  const isPaid =
    order.payment_status === "PAID" || order.payment_status === "COMPLETED";
  const currency = "KES";

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-8 md:py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Banner */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-sm p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="text-green-800 font-medium">Payment Successful</h3>
              <p className="text-green-700 text-sm mt-1">
                Your payment has been processed and your order is confirmed.
              </p>
            </div>
          </div>
        )}

        {/* Back Link */}
        <Link
          href="/orders"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to My Orders
        </Link>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-foreground">
              Order #{order.reference}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Placed on {new Date(
                order.created_at,
              ).toLocaleDateString()} at{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          {!isPaid && (
            <Link
              href={`/checkout/orders/${order.reference}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors shadow-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment
            </Link>
          )}
        </div>

        {/* Main Content Card (Receipt Style) */}
        <div className="bg-white rounded-sm shadow-sm border border-secondary/20 overflow-hidden relative">
          {/* Top Decoration */}
          <div className="h-1 bg-primary/80 w-full" />

          {/* Status Bar */}
          <div className="bg-secondary/5 px-6 py-4 border-b border-secondary/20 flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isPaid ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
            <span className="font-medium text-foreground text-sm uppercase tracking-wide">
              {order.payment_status}
            </span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground text-sm">
              {isPaid ? "Processing" : "Pending Payment"}
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Items Section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Items ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-sm bg-secondary/10 flex items-center justify-center text-xs font-bold text-foreground/70 shrink-0 border border-secondary/20">
                      {item.quantity}x
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {item.variant_sku}
                      </p>
                    </div>
                    <div className="font-bold text-foreground font-mono">
                      {formatCurrency(parseFloat(item.price), currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-secondary/20 w-full" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Delivery Info */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Delivery Method
                </h3>
                <div className="bg-secondary/5 rounded-sm p-4 border border-secondary/20">
                  <p className="font-medium text-foreground text-sm">
                    Pickup Station
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.pickup_station_name || "Standard Delivery"}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" /> Payment Details
                </h3>
                <div className="bg-secondary/5 rounded-sm p-4 border border-secondary/20">
                  <p className="font-medium text-foreground text-sm">
                    Method: M-Pesa
                  </p>
                  {order.phone_number && (
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                      +{order.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Receipt Divider */}
            <div className="border-t-2 border-dashed border-secondary/30 my-2 relative">
              <div className="absolute -left-10 -top-1.5 w-3 h-3 bg-white rounded-full border border-secondary/30" />
              <div className="absolute -right-10 -top-1.5 w-3 h-3 bg-white rounded-full border border-secondary/30" />
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(
                    parseFloat(order.total_amount) -
                      parseFloat(order.delivery_cost),
                    currency,
                  )}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Delivery Cost</span>
                <span>
                  {formatCurrency(parseFloat(order.delivery_cost), currency)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-secondary/10 mt-2">
                <span className="text-base font-bold text-foreground">
                  Total
                </span>
                <span className="text-2xl font-bold text-primary font-serif">
                  {formatCurrency(parseFloat(order.total_amount), currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Pattern */}
          <div className="bg-[#F9F7F2] h-3 w-full relative -bottom-1 opacity-50">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%)",
                backgroundSize: "8px 16px",
                backgroundPosition: "0 0",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
