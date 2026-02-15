/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFetchCart } from "@/hooks/cart/actions";
import { useFetchPickupStations } from "@/hooks/pickupstations/actions";
import { useCheckoutCart } from "@/hooks/cart/mutations";
import { formatCurrency } from "@/components/dashboard/utils";
import {
  Loader2,
  ShoppingBag,
  ShieldCheck,
  User,
  Phone as PhoneIcon,
  MapPin,
  CreditCard,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PickupStationSelector from "@/components/checkout/PickupStationSelector";
import { toast } from "react-hot-toast";
import { checkoutCart } from "@/services/cart";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: cart, isLoading: isCartLoading } = useFetchCart();
  const [checkingOut, setIsCheckingOut] = useState(false);
  const { data: pickupStations, isLoading: isStationsLoading } =
    useFetchPickupStations();
  const header = useAxiosAuth();
  const [selectedStationCode, setSelectedStationCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const selectedStation = pickupStations?.find(
    (s) => s.station_code === selectedStationCode,
  );

  const handleCheckout = async () => {
    if (!selectedStationCode) {
      toast.error("Please select a pickup station");
      return;
    }
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    try {
      setIsCheckingOut(true);

      const order = await checkoutCart(
        {
          pickup_station: selectedStationCode,
          phone_number: phoneNumber,
        },
        header,
      );

      // ── Only reaches here if request was successful ──
      toast.success("Order placed successfully!");

      router.push(`/checkout/orders/${order.order_reference}`);
    } catch (error: any) {
      console.error("Checkout failed:", error);

      // Try to show meaningful message
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.non_field_errors?.[0] ||
        error.message ||
        "Failed to place order. Please try again.";

      toast.error(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isCartLoading || isStationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-serif font-bold text-foreground">
          Your Cart is Empty
        </h1>
        <Link
          href="/shop"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const deliveryCost = selectedStation
    ? parseFloat(selectedStation.cost_to_customer)
    : 0;
  const deliveryCurrency = selectedStation?.shop_details?.currency || "KES";
  const grandTotal = cart.grand_total + deliveryCost;

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Main Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Account Details */}
            <section className="bg-background p-6 rounded-sm shadow">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                1. Account Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <div className="p-3 bg-secondary/10 rounded-sm text-foreground">
                    {session?.user?.first_name +
                      " " +
                      session?.user?.last_name || "Guest Checkout"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <div className="p-3 bg-secondary/10 rounded-sm text-foreground">
                    {session?.user?.email || "No email provided"}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1">
                    <PhoneIcon className="w-3 h-3" />
                    Mobile Number (M-PESA){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g 254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This number will be used for M-PESA payment requests and
                    order updates.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Delivery Method */}
            <section className="bg-background p-6 rounded-sm shadow">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                2. Delivery Method
              </h2>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Select a pickup station near you. Orders are typically ready
                  within 2-3 business days.
                </div>
                <PickupStationSelector
                  stations={pickupStations || []}
                  selectedStationCode={selectedStationCode}
                  onSelect={setSelectedStationCode}
                  isLoading={isStationsLoading}
                />
              </div>
            </section>

            {/* 3. Order Items Review */}
            <section className="bg-background p-6 rounded-sm shadow-sm">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                3. Order Items ({cart.items.length})
              </h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.reference} className="flex gap-4 py-4">
                    <div className="relative w-10 h-10 bg-secondary/10 rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={item.variant_image || "/logo.png"}
                        alt={item.variant_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-foreground line-clamp-2">
                            {item.variant_name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground bg-secondary/10 px-2 py-0.5 rounded-sm">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(
                            parseFloat(item.sub_total.toString()),
                            item.variant_shop_currency || "KES",
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-background p-6 rounded-sm shadow sticky top-24">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm mb-6 border-b border-border pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(cart.grand_total, "KES")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium text-foreground">
                    {selectedStation
                      ? formatCurrency(deliveryCost, deliveryCurrency)
                      : "--"}
                  </span>
                </div>
                {/* Tax or other lines can go here */}
              </div>

              <div className="flex justify-between text-lg font-bold text-foreground mb-8">
                <span>Total</span>
                <span>{formatCurrency(grandTotal, "KES")}</span>
              </div>

              {/* Payment Info */}
              <div className="rounded-sm bg-white shadow p-4 mb-6">
                <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </h3>
                <p className="text-sm">
                  We currently accept <strong>M-PESA</strong> only. You will
                  receive a payment prompt on the number provided (
                  {phoneNumber || "above"}).
                </p>
                <div className="mt-2 flex gap-2">
                  <div className="h-6 w-12 bg-white rounded-sm border border-gray-200 flex items-center justify-center text-[10px] font-bold text-green-600">
                    M-PESA
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut || !selectedStationCode || !phoneNumber}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-sm font-medium text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {checkingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Secure Checkout
                  </>
                )}
              </button>

              {!selectedStationCode && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Please select a pickup station to proceed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
