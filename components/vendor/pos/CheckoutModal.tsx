"use client";

import React, { useState, useEffect } from "react";
import { useFetchPOSSale } from "@/hooks/possales/actions";
import { createPOSSale, triggerMpesaSTKPush } from "@/services/possales";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { X, CreditCard, Banknote, Smartphone, CheckCircle2, Loader2, AlertCircle, Plus, Trash2, Signal } from "lucide-react";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "MPESA_MANUAL", label: "M-Pesa Manual", icon: Smartphone },
  { value: "MPESA_STK", label: "M-Pesa STK", icon: Signal },
  { value: "CARD", label: "Card", icon: CreditCard },
] as const;

export const CheckoutModal = ({
  cart,
  cartTotal,
  currency,
  customerData,
  onClose,
  onSuccess,
}: {
  cart: any[];
  cartTotal: number;
  currency: string;
  customerData: {
    name: string;
    phone: string;
    pointsToRedeem: number;
  };
  onClose: () => void;
  onSuccess: (ref: string) => void;
}) => {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Split payments state
  const [payments, setPayments] = useState<{ method: string; amount: number; ref?: string }[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("CASH");
  const [amountInput, setAmountInput] = useState("");
  const [mpesaRefInput, setMpesaRefInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [globalDiscount, setGlobalDiscount] = useState(0);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(0, cartTotal - globalDiscount - customerData.pointsToRedeem - totalPaid);

  // STK Polling State
  const [stkSaleRef, setStkSaleRef] = useState<string | null>(null);
  const { data: polledSale } = useFetchPOSSale(stkSaleRef || "", stkSaleRef ? 3000 : undefined);

  useEffect(() => {
    if (stkSaleRef && polledSale) {
      if (polledSale.mpesa_stk_status === "COMPLETED") {
        onSuccess(stkSaleRef);
      } else if (polledSale.mpesa_stk_status === "FAILED") {
        setErrorMsg(`STK Push failed: ${polledSale.mpesa_stk_status}`);
        setStkSaleRef(null);
      }
    }
  }, [polledSale, stkSaleRef, onSuccess]);

  useEffect(() => {
    setAmountInput(remaining.toString());
  }, [remaining]);

  const handleAddPayment = () => {
    setErrorMsg("");
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }
    if (amount > remaining) {
      setErrorMsg("Amount cannot exceed the remaining balance.");
      return;
    }
    if (selectedMethod === "MPESA_MANUAL" && !mpesaRefInput.trim()) {
      setErrorMsg("M-Pesa transaction reference is required.");
      return;
    }
    if (selectedMethod === "MPESA_STK" && (!mpesaRefInput.trim() || mpesaRefInput.length < 9)) {
      setErrorMsg("M-Pesa phone number is required for STK push.");
      return;
    }

    setPayments([
      ...payments,
      { method: selectedMethod, amount, ref: mpesaRefInput },
    ]);
    setMpesaRefInput("");
  };

  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleCompleteSale = async () => {
    if (remaining > 0) {
      setErrorMsg("Full amount not yet paid.");
      return;
    }

    setIsSubmitting(true);
    try {
      const items = cart
        .filter((c: any) => c.type === "variant")
        .map((c: any) => ({
          variant: c.item.variant_id,
          quantity: c.quantity,
        }));

      const bundle_ids: string[] = [];
      cart
        .filter((c: any) => c.type === "bundle")
        .forEach((c: any) => {
          for (let i = 0; i < c.quantity; i++) {
            bundle_ids.push(c.item.id);
          }
        });

      // Map split payments for backend if it supports split, otherwise use the primary one for now
      // Assuming backend uses `payment_method` for primary and `mpesa_reference`
      const primaryPayment = payments.length > 0 ? payments[0] : { method: "CASH", ref: "" };

      const sale = await createPOSSale({
        items,
        bundle_ids: bundle_ids.length > 0 ? bundle_ids : undefined,
        payment_method: primaryPayment.method as any,
        mpesa_reference: primaryPayment.method === "MPESA_MANUAL" ? primaryPayment.ref : undefined,
        mpesa_phone_number: primaryPayment.method === "MPESA_STK" ? primaryPayment.ref : undefined,
        customer_name: customerData.name || undefined,
        customer_phone: customerData.phone || undefined,
        discount_amount: globalDiscount,
        loyalty_points_to_redeem: customerData.pointsToRedeem,
      }, header);

      queryClient.invalidateQueries({ queryKey: ["possales"] });

      if (primaryPayment.method === "MPESA_STK") {
        try {
          await triggerMpesaSTKPush(sale.reference, primaryPayment.ref as string, header);
          setStkSaleRef(sale.reference);
        } catch (stkError: any) {
          setErrorMsg(stkError?.response?.data?.detail || "Failed to trigger STK push.");
        }
      } else {
        onSuccess(sale.reference);
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || "Failed to process sale.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F5F5F7] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1D1D1F]">Checkout</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F5F5F7] text-[#86868B] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8 bg-[#FAFAFA]">
          {/* Left: Balances */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#D2D2D7] shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#6E6E73] text-sm">Cart Total</span>
                <span className="font-semibold text-[#1D1D1F]">{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-red-600">
                <span className="text-sm">Discount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={globalDiscount}
                  onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 bg-red-50 border border-red-200 rounded text-right font-semibold outline-none"
                />
              </div>
              {customerData.pointsToRedeem > 0 && (
                <div className="flex justify-between items-center mb-2 text-emerald-600">
                  <span className="text-sm">Loyalty Points Applied</span>
                  <span className="font-semibold">-{customerData.pointsToRedeem.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px bg-[#F5F5F7] my-3" />
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-[#1D1D1F]">Amount Due</span>
                <span className="text-2xl font-bold text-[#1D1D1F]">{remaining.toFixed(2)}</span>
              </div>

              {/* Added Payments */}
              {payments.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-[#F5F5F7]">
                  <p className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Applied Payments</p>
                  {payments.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#F5F5F7] rounded-xl text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1D1D1F]">{p.method.replace("_", " ")}</span>
                        {p.ref && <span className="text-xs text-[#86868B] font-mono bg-white px-1.5 py-0.5 rounded border border-[#D2D2D7]">{p.ref}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#d49903]">{p.amount.toFixed(2)}</span>
                        <button onClick={() => handleRemovePayment(i)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm flex gap-2 items-start border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}
          </div>

          {/* Right: Payment Entry */}
          <div className="flex-1 flex flex-col">
            {remaining > 0 ? (
              <div className="bg-white p-5 rounded-2xl border border-[#D2D2D7] shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#1D1D1F] mb-2">Add Payment</h3>
                
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedMethod(value)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${
                        selectedMethod === value
                          ? "border-[#e39b00] bg-[#0071E3]/5 text-[#e39700]"
                          : "border-[#D2D2D7] text-[#6E6E73] hover:border-[#e39700]/40"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-lg font-bold focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
                  />
                </div>

                {selectedMethod === "MPESA_MANUAL" && (
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">M-Pesa Ref</label>
                    <input
                      type="text"
                      placeholder="e.g. RKQ1234XYZ"
                      value={mpesaRefInput}
                      onChange={(e) => setMpesaRefInput(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm font-mono focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
                    />
                  </div>
                )}
                
                {selectedMethod === "MPESA_STK" && (
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">Customer Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 254700000000"
                      value={mpesaRefInput}
                      onChange={(e) => setMpesaRefInput(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm font-mono focus:bg-white focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all outline-none"
                    />
                  </div>
                )}

                <button
                  onClick={handleAddPayment}
                  className="w-full py-3 border-2 border-[#da9705] text-[#e38800] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#0071E3]/5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Payment
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl flex flex-col items-center justify-center text-center h-full">
                {stkSaleRef ? (
                  <>
                    <Signal className="w-16 h-16 text-emerald-500 mb-4 animate-pulse" />
                    <h3 className="text-xl font-bold text-emerald-800">Awaiting PIN...</h3>
                    <p className="text-sm text-emerald-600 mt-2">STK push sent to customer. Waiting for payment completion.</p>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                    <h3 className="text-xl font-bold text-emerald-800">Fully Paid</h3>
                    <p className="text-sm text-emerald-600 mt-2">The balance has been settled. You can complete the sale.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#F5F5F7] bg-white flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-[#F5F5F7] text-[#1D1D1F] font-bold rounded-xl hover:bg-[#E8E8ED] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCompleteSale}
            disabled={remaining > 0 || isSubmitting}
            className="flex-[2] py-3.5 bg-[#e3ae00] text-white font-bold rounded-xl hover:bg-[#f1bf40] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};
