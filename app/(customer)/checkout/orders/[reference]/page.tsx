"use client";

import { generateDepositSTKPush } from "@/services/mpesa";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { useFetchOrder } from "@/hooks/orders/actions";
import { formatCurrency } from "@/components/dashboard/utils";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronLeft,
  Smartphone,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@headlessui/react";

export default function OrderPaymentPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const router = useRouter();
  const { reference } = use(params);

  const { data: order, isLoading, refetch } = useFetchOrder(reference);
  const [isPolling, setIsPolling] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const pollPaymentStatus = async () => {
    setIsPolling(true);
    const maxRetries = 24;
    let tries = 0;

    const interval = setInterval(async () => {
      tries++;
      try {
        const result = await refetch();
        const currentStatus = result?.data?.payment_status;

        if (currentStatus === "PAID" || currentStatus === "COMPLETED") {
          clearInterval(interval);
          setPaymentMessage("Payment Successful! Redirecting...");
          toast.success("Payment Received!");
          setTimeout(() => {
            router.push(`/orders/${reference}?success=true`);
          }, 2000);
          setIsPolling(false);
        } else if (
          ["FAILED", "CANCELLED", "REVERSED"].includes(currentStatus || "")
        ) {
          clearInterval(interval);
          setPaymentMessage(
            `Payment ${
              currentStatus ? currentStatus.toLowerCase() : "failed"
            }. Please try again.`,
          );
          toast.error(`Payment ${currentStatus || "failed"}`);
          setIsPolling(false);
        } else if (tries >= maxRetries) {
          clearInterval(interval);
          setPaymentMessage(
            "Payment verification timed out. Please check your messages.",
          );
          toast("Taking longer than expected...", { icon: "⏳" });
          setIsPolling(false);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 5000);
  };

  if (isLoading && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1F2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C27848]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#FFF1F2]">
        <AlertCircle className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
        <Link
          href="/shop"
          className="text-[#C27848] hover:underline flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Return to Shop
        </Link>
      </div>
    );
  }

  const isPaid =
    order.payment_status === "PAID" || order.payment_status === "COMPLETED";
  const currency = "KES";

  const validationSchema = Yup.object().shape({
    phone_number: Yup.string()
      .required("Phone number is required")
      .matches(
        /^(2547|2541)\d{8}$/,
        "Phone number must start with 2547 or 2541 and be 12 digits",
      ),
  });

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/orders"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <Lock className="w-3 h-3" /> Secure Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: RECEIPT (Order Summary) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-sm shadow-sm border border-secondary/20 overflow-hidden relative">
              {/* Receipt Top Decoration */}
              <div className="h-2 bg-primary/80 w-full" />

              <div className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-serif font-bold text-foreground mb-1">
                    Order Receipt
                  </h1>
                  <p className="text-sm text-muted-foreground font-mono">
                    #{order.reference.toUpperCase()}
                  </p>
                </div>

                {/* Items List */}
                <div className="space-y-4 mb-8">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start text-sm group"
                    >
                      <div className="flex gap-3">
                        <span className="font-mono text-muted-foreground w-6 shrink-0 pt-0.5">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {item.variant_sku}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {item.variant_sku}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-foreground tabular-nums">
                        {formatCurrency(parseFloat(item.price), currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t-2 border-dashed border-secondary/30 my-6 relative">
                  <div className="absolute -left-10 -top-1.5 w-3 h-3 bg-[#F9F7F2] rounded-full" />
                  <div className="absolute -right-10 -top-1.5 w-3 h-3 bg-[#F9F7F2] rounded-full" />
                </div>

                {/* Totals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="tabular-nums">
                      {formatCurrency(
                        parseFloat(order.total_amount) -
                          parseFloat(order.delivery_cost),
                        currency,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="tabular-nums">
                      {formatCurrency(
                        parseFloat(order.delivery_cost),
                        currency,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 text-base font-bold text-foreground border-t border-secondary/10 mt-4">
                    <span>Total Due</span>
                    <span className="text-xl font-serif text-primary tabular-nums">
                      {formatCurrency(parseFloat(order.total_amount), currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt Bottom Decoration */}
              <div className="bg-[#F9F7F2] h-4 w-full relative -bottom-2">
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, transparent 33.333%, #F9F7F2 33.333%, #F9F7F2 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #F9F7F2 33.333%, #F9F7F2 66.667%, transparent 66.667%)",
                    backgroundSize: "12px 24px",
                    backgroundPosition: "0 0",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PAYMENT (Action) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-sm shadow-md border border-secondary/20 p-6 md:p-10 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              {!isPaid ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                      Details & Payment
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Complete your purchase securely via M-PESA.
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-8">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group cursor-pointer border-2 border-primary bg-primary/5 rounded-sm p-4 flex items-center gap-3 transition-all">
                        <div className="w-10 h-10 rounded-sm bg-white border border-secondary/20 flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">
                            M-PESA
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Mobile Money
                          </p>
                        </div>
                        <div className="absolute top-3 right-3 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white p-0.5 shadow-sm">
                          <Check className="w-full h-full" />
                        </div>
                      </div>
                      {/* Placeholder for Card/Other */}
                      <div className="relative border border-secondary/30 rounded-sm p-4 flex items-center gap-3 opacity-50 cursor-not-allowed grayscale">
                        <div className="w-10 h-10 rounded-sm bg-secondary/10 flex items-center justify-center shrink-0">
                          <div className="w-5 h-3 border-2 border-muted-foreground rounded-sm" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            Card
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Coming Soon
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Formik
                    initialValues={{ phone_number: order.phone_number || "" }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                      setPaymentMessage("Initiating M-PESA request...");
                      try {
                        const payload = {
                          phone_number: parseInt(values.phone_number, 10),
                          order_reference: reference,
                        };
                        await generateDepositSTKPush(payload);
                        toast.success("Push sent! Check your phone.");
                        setPaymentMessage("Action Required: Check your phone");
                        pollPaymentStatus();
                      } catch (error) {
                        console.error(error);
                        toast.error("Failed to initiate payment");
                        setPaymentMessage("Failed to initiate. Please retry.");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({ isSubmitting, errors, touched }) => (
                      <Form className="space-y-8">
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                            M-PESA Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                              <span className="text-foreground font-medium text-lg border-r border-secondary/30 pr-3 mr-1">
                                +254
                              </span>
                            </div>
                            <Field
                              name="phone_number"
                              type="tel"
                              className="block w-full py-4 pl-20 pr-4 text-lg bg-secondary/5 border border-secondary/30 rounded-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                              placeholder="7XX XXX XXX"
                            />
                            {errors.phone_number && touched.phone_number && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                                <AlertCircle className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          {errors.phone_number && touched.phone_number && (
                            <p className="mt-2 text-sm text-red-500 flex items-center gap-1 animate-pulse">
                              {errors.phone_number}
                            </p>
                          )}
                        </div>

                        {/* Status / Instructions */}
                        <div className="bg-secondary/10 rounded-sm p-4 border border-secondary/20">
                          {isPolling || paymentMessage ? (
                            <div className="flex flex-col gap-3">
                              <div
                                className={`flex items-center gap-3 font-medium ${paymentMessage.includes("Failed") ? "text-red-700" : "text-foreground"}`}
                              >
                                {isPolling && (
                                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                )}
                                <span>{paymentMessage}</span>
                              </div>
                              {isPolling && (
                                <div className="w-full bg-secondary/20 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-full bg-primary animate-progress-indeterminate" />
                                </div>
                              )}
                              {isPolling && (
                                <p className="text-sm text-muted-foreground">
                                  Please enter your PIN on the M-PESA prompt
                                  sent to your phone.
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="flex gap-4">
                              <div className="flex flex-col gap-1 flex-1">
                                <span className="text-xs font-bold text-primary uppercase">
                                  Step 1
                                </span>
                                <span className="text-sm text-foreground">
                                  Click &quot;Pay Now&quot; below
                                </span>
                              </div>
                              <div className="w-px bg-secondary/20" />
                              <div className="flex flex-col gap-1 flex-1">
                                <span className="text-xs font-bold text-primary uppercase">
                                  Step 2
                                </span>
                                <span className="text-sm text-foreground">
                                  Enter PIN on your phone
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting || isPolling}
                          className="w-full relative group overflow-hidden rounded-sm bg-foreground text-background py-4 transition-all hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          <div className="relative z-10 flex items-center justify-center gap-2 font-medium text-lg">
                            {isSubmitting ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <>
                                <span>Pay Now</span>
                                <span className="opacity-50">|</span>
                                <span>
                                  {formatCurrency(
                                    parseFloat(order.total_amount),
                                    currency,
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Button>

                        <button
                          type="button"
                          onClick={() => refetch()}
                          className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                        >
                          I&apos;ve already completed payment
                        </button>
                      </Form>
                    )}
                  </Formik>
                </>
              ) : (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-in zoom-in duration-500 shadow-sm border-4 border-white">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                    Payment Successful
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-sm">
                    Thank you! Your order{" "}
                    <strong>#{order.reference.toUpperCase()}</strong> has been
                    confirmed.
                  </p>
                  <Link
                    href="/orders"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-sm font-bold transition-all hover:bg-primary/90 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    View My Orders
                  </Link>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  <span>256-bit SSL Secured</span>
                </div>
                <div className="flex gap-2 opacity-50 grayscale">
                  {/* Icons for payment providers just for trust visuals */}
                  <div className="h-6 w-10 bg-secondary/20 rounded-sm" />
                  <div className="h-6 w-10 bg-secondary/20 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
