"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { useFetchPurchaseOrders } from "@/hooks/purchaseorders/actions";
import { updatePurchaseOrderStatus } from "@/services/purchaseorders";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Plus, Boxes, Calendar, PackageCheck, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import CreatePOModal from "@/components/vendor/pos/purchase-orders/CreatePOModal";

export default function PurchaseOrdersPage() {
  const { data: orders = [], isLoading } = useFetchPurchaseOrders();
  const queryClient = useQueryClient();
  const header = useAxiosAuth();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMarkReceived = async (reference: string) => {
    if (confirm("Mark this order as Received? This will automatically update your inventory stock levels.")) {
      setProcessingId(reference);
      try {
        await updatePurchaseOrderStatus(reference, "RECEIVED", header);
        queryClient.invalidateQueries({ queryKey: ["purchaseorders"] });
      } catch (error) {
        console.error(error);
        toast.error("Failed to update status.");
      } finally {
        setProcessingId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHeader
            title="Purchase Orders"
            description="Manage supplier orders and automatically restock inventory upon receipt."
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#e38800] text-white rounded-xl text-sm font-semibold hover:bg-[#fad06c] active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-2xl border border-[#D2D2D7] animate-pulse"></div>
             ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-4 bg-white rounded-3xl border border-dashed border-[#D2D2D7]">
            <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center">
              <Boxes className="w-8 h-8 text-[#86868B]" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-[#1D1D1F] mb-1">No Purchase Orders</h3>
              <p className="text-sm text-[#86868B] max-w-sm mx-auto">
                Create a purchase order to track incoming inventory from suppliers.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-[#f08e0e] text-sm font-semibold hover:underline"
            >
              Create your first order
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div key={order.reference} className="bg-white rounded-2xl border border-[#D2D2D7] overflow-hidden flex flex-col transition-shadow hover:shadow-md">
                {/* Header */}
                <div className="px-5 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA] flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-[#1D1D1F]">{order.supplier_name}</h3>
                      <span className="text-xs text-[#86868B] font-mono bg-[#E8E8ED] px-2 py-0.5 rounded-md">
                        {order.reference}
                      </span>
                    </div>
                    <p className="text-xs text-[#86868B] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Ordered: {new Date(order.order_date).toLocaleDateString()}
                      {order.expected_date && ` • Expected: ${new Date(order.expected_date).toLocaleDateString()}`}
                    </p>
                  </div>
                  
                  {order.status === "DRAFT" && <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Draft</span>}
                  {order.status === "ORDERED" && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Ordered</span>}
                  {order.status === "RECEIVED" && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Received</span>}
                  {order.status === "CANCELLED" && <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Cancelled</span>}
                </div>

                {/* Items */}
                <div className="p-5 flex-1">
                  <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-dashed border-[#E8E8ED] last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-[#1D1D1F]">{item.product_name}</p>
                          <p className="text-xs text-[#86868B] font-mono">{item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#1D1D1F]">{item.quantity} units</p>
                          <p className="text-xs text-[#86868B]">@ {item.cost_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <div className="mt-4 p-3 bg-[#F5F5F7] rounded-xl text-sm text-[#6E6E73]">
                      <span className="font-semibold text-[#1D1D1F]">Notes:</span> {order.notes}
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                {(order.status === "DRAFT" || order.status === "ORDERED") && (
                  <div className="p-4 border-t border-[#F5F5F7] bg-[#FAFAFA]">
                    <button
                      onClick={() => handleMarkReceived(order.reference)}
                      disabled={processingId === order.reference}
                      className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
                    >
                      {processingId === order.reference ? <Loader2 className="w-4 h-4 animate-spin"/> : <PackageCheck className="w-4 h-4" />}
                      Mark as Received (Restock Inventory)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && <CreatePOModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
