"use client";

import React, { useState } from "react";
import { useFetchPOSSaleReceipt, useEmailPOSSaleReceipt, useDownloadPOSSaleReceiptPdf } from "@/hooks/possales/actions";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, AlertCircle, XCircle, Printer, Mail, Loader2, Download } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { POSSaleItem, POSSalePayment } from "@/services/possales";
import { useParams } from "next/navigation";

export default function POSSaleDetailsPage() {
  const params = useParams();
  const reference = params.reference as string;
  const { data: receipt, isLoading, isError } = useFetchPOSSaleReceipt(reference);
  const emailMutation = useEmailPOSSaleReceipt();
  const downloadMutation = useDownloadPOSSaleReceiptPdf();
  
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const handleDownload = () => {
    downloadMutation.mutate(reference, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Receipt_${reference}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Receipt downloaded!");
      },
      onError: (err: any) => {
        // console.log(err);
        toast.error(err?.response?.data?.error || "Failed to download receipt.");
      }
    });
  };

  const handleSendEmail = () => {
    emailMutation.mutate(
      { reference, email: emailInput || undefined },
      {
        onSuccess: () => {
          toast.success("Receipt emailed successfully!");
          setShowEmailPrompt(false);
          setEmailInput("");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.error || "Failed to send receipt.");
        },
      }
    );
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Completed
          </span>
        );
      case "HELD":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-200">
            <AlertCircle className="w-4 h-4" /> Held
          </span>
        );
      case "VOIDED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm font-semibold border border-red-200">
            <XCircle className="w-4 h-4" /> Voided
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-[#86868B]">
        Loading sale details...
      </div>
    );
  }

  if (isError || !receipt) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#86868B]">
        <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        <h2 className="text-xl font-semibold text-[#1D1D1F]">Sale not found</h2>
        <p className="mt-2">The requested sale reference could not be found.</p>
        <Link href="/vendor/pos-sales" className="mt-6 text-[#e38800] hover:underline">
          Return to Sales History
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/vendor/pos-sales"
            className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#86868B]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1D1D1F] flex items-center gap-3">
              Sale {receipt.reference}
              {getStatusBadge(receipt.status)}
            </h1>
            <p className="text-[#6E6E73] mt-1">
              {format(new Date(receipt.sale_date), "MMM d, yyyy 'at' h:mm a")} • Served by {receipt.served_by_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <div className="relative">
            {showEmailPrompt ? (
              <div className="flex items-center gap-2 bg-white border border-[#D2D2D7] rounded-full p-1 pl-3 shadow-sm animate-in fade-in slide-in-from-right-4">
                <input
                  type="email"
                  placeholder="Customer email..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="text-sm outline-none w-40"
                  autoFocus
                />
                <button
                  onClick={handleSendEmail}
                  disabled={emailMutation.isPending}
                  className="p-1.5 bg-[#e38c00] text-white rounded-full hover:bg-[#ed7e00] disabled:opacity-50"
                >
                  {emailMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowEmailPrompt(false)}
                  className="p-1.5 text-[#86868B] hover:bg-[#F5F5F7] rounded-full"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowEmailPrompt(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D2D2D7] rounded-full text-sm font-semibold text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" /> Email Receipt
              </button>
            )}
          </div>
          <button 
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D2D2D7] rounded-full text-sm font-semibold text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors shadow-sm disabled:opacity-50"
          >
            {downloadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[#D2D2D7] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1D1D1F] mb-4">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#D2D2D7] text-xs uppercase tracking-wider text-[#86868B] font-semibold">
                    <th className="pb-3 pr-4">Item</th>
                    <th className="pb-3 px-4 text-center">Qty</th>
                    <th className="pb-3 px-4 text-right">Unit Price</th>
                    <th className="pb-3 px-4 text-right">Discount</th>
                    <th className="pb-3 pl-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F7]">
                  {receipt.items.map((item: POSSaleItem) => (
                    <tr key={item.id}>
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-[#1D1D1F]">{item.product_name}</p>
                        {item.variant_sku && (
                          <p className="text-xs text-[#86868B] font-mono mt-0.5">SKU: {item.variant_sku}</p>
                        )}
                        {Object.entries(item.variant_attributes || {}).map(([key, val]) => (
                          <span key={key} className="text-xs text-[#6E6E73] mr-2">
                            {key}: {val as React.ReactNode}
                          </span>
                        ))}
                      </td>
                      <td className="py-4 px-4 text-center text-[#1D1D1F] font-medium">{item.quantity}</td>
                      <td className="py-4 px-4 text-right text-[#6E6E73]">
                        {parseFloat(item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right text-[#6E6E73]">
                        {parseFloat(item.discount_amount) > 0 ? (
                          <span className="text-red-500">-{parseFloat(item.discount_amount).toFixed(2)}</span>
                        ) : "-"}
                      </td>
                      <td className="py-4 pl-4 text-right font-semibold text-[#1D1D1F]">
                        {item.line_total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Payments */}
        <div className="space-y-6">
          <div className="bg-[#F5F5F7] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#1D1D1F] mb-4">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#6E6E73]">
                <span>Subtotal</span>
                <span>{parseFloat(receipt.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[#6E6E73]">
                <span>Discount</span>
                <span className="text-red-500">-{parseFloat(receipt.discount_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[#6E6E73]">
                <span>Tax ({(parseFloat(receipt.shop_tax_rate) || 0).toString()}%)</span>
                <span>{parseFloat(receipt.tax_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-3 border-t border-[#D2D2D7] flex justify-between items-center">
                <span className="font-bold text-[#1D1D1F]">Grand Total</span>
                <span className="text-xl font-bold text-[#1D1D1F]">
                  {parseFloat(receipt.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#D2D2D7] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1D1D1F] mb-4">Payments</h2>
            <div className="space-y-3">
              {receipt.payments.map((payment: POSSalePayment) => (
                <div key={payment.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-[#1D1D1F]">{payment.payment_method.replace("_", " ")}</span>
                    {payment.mpesa_reference && (
                      <p className="text-xs text-[#86868B] font-mono mt-0.5">Ref: {payment.mpesa_reference}</p>
                    )}
                  </div>
                  <span className="font-semibold text-[#1D1D1F]">
                    {parseFloat(payment.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              {receipt.loyalty_points_redeemed > 0 && (
                <div className="flex justify-between items-center text-sm text-amber-600">
                  <span className="font-medium">Loyalty Redeemed</span>
                  <span className="font-semibold">-{receipt.loyalty_points_redeemed} pts</span>
                </div>
              )}
            </div>
          </div>

          {receipt.customer_name && (
            <div className="bg-white border border-[#D2D2D7] rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1D1D1F] mb-2">Customer</h2>
              <p className="font-medium text-[#1D1D1F]">{receipt.customer_name}</p>
              {receipt.loyalty_points_earned > 0 && (
                <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Earned {receipt.loyalty_points_earned} pts
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
