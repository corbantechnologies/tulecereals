"use client";

import { useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { updateShopOrder, ShopOrder } from "@/services/shoporders";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { X, Loader2 } from "lucide-react";

interface UpdateOrderModalProps {
  order: ShopOrder;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateOrderModal({
  order,
  isOpen,
  onClose,
  onSuccess,
}: UpdateOrderModalProps) {
  const authHeaders = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      status: order.status,
      vendor_notes: order.vendor_notes || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await updateShopOrder(order.reference, values, authHeaders);
        toast.success("Order updated successfully");
        onSuccess();
        onClose();
      } catch (error) {
        toast.error("Failed to update order");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-secondary/20 bg-secondary/5">
          <h2 className="font-serif text-lg text-foreground">Update Order</h2>
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Order Status
            </label>
            <select
              id="status"
              name="status"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
              className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-white"
            >
              <option value="PLACED">Placed</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="RECEIVED_AT_STATION">Received at Station</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="vendor_notes"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Vendor Notes
            </label>
            <textarea
              id="vendor_notes"
              name="vendor_notes"
              rows={4}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.vendor_notes}
              className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none"
              placeholder="Add internal notes about this order..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/10 rounded-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
