"use client";

import React, { useState } from "react";
import { X, Search, Plus, Minus, Trash2 } from "lucide-react";
import { useFetchInventory } from "@/hooks/stockadjustments/actions";
import { useCreatePOSBundle } from "@/hooks/posbundles/actions";
import { InventoryItem } from "@/services/stockadjustments";

export default function CreateBundleModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bundlePrice, setBundlePrice] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<{ variant_id: string; quantity: number; product_name: string; price: number }[]>([]);

  const { data: inventory = [], isLoading } = useFetchInventory();
  const createMutation = useCreatePOSBundle();

  const filteredInventory = inventory.filter(
    (item: InventoryItem) =>
      item.product_name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addItem = (item: InventoryItem) => {
    if (!selectedItems.find((i) => i.variant_id === item.variant_id)) {
      setSelectedItems([...selectedItems, { variant_id: item.variant_id, quantity: 1, product_name: item.product_name, price: item.price }]);
    }
  };

  const updateQuantity = (variant_id: string, delta: number) => {
    setSelectedItems(
      selectedItems.map((item) => {
        if (item.variant_id === variant_id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const removeItem = (variant_id: string) => {
    setSelectedItems(selectedItems.filter((i) => i.variant_id !== variant_id));
  };

  const individualTotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async () => {
    if (!name || !bundlePrice || selectedItems.length === 0) return;
    
    const payload = {
      name,
      description,
      bundle_price: parseFloat(bundlePrice),
      items: selectedItems.map((i) => ({
        variant: i.variant_id,
        quantity: i.quantity,
      })),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F5F5F7] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1D1D1F]">Create POS Bundle</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#F5F5F7] text-[#86868B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#FAFAFA]">
          {/* Left: Product Selection */}
          <div className="flex-1 border-r border-[#F5F5F7] p-6 flex flex-col overflow-hidden">
            <h3 className="font-semibold text-sm mb-4">Select Products</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#D2D2D7] rounded-xl text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {isLoading ? (
                <div className="animate-pulse flex flex-col gap-2">
                  <div className="h-12 bg-[#E3E3E8] rounded-xl" />
                  <div className="h-12 bg-[#E3E3E8] rounded-xl" />
                </div>
              ) : (
                filteredInventory.map((item: InventoryItem) => (
                  <div key={item.variant_id} className="flex items-center justify-between p-3 bg-white border border-[#F5F5F7] rounded-xl">
                    <div>
                      <p className="text-sm font-semibold">{item.product_name}</p>
                      <p className="text-xs text-[#86868B]">{item.sku}</p>
                    </div>
                    <button onClick={() => addItem(item)} className="p-1.5 bg-[#0071E3]/10 text-[#e3aa00] rounded-lg hover:bg-[#0071E3] hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Bundle Details */}
          <div className="w-full md:w-[400px] p-6 overflow-y-auto flex flex-col space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1D1D1F] mb-1">Bundle Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#D2D2D7] rounded-xl text-sm"
                  placeholder="e.g. Weekend Special Bundle"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1D1D1F] mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#D2D2D7] rounded-xl text-sm"
                  rows={2}
                  placeholder="Optional details"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Selected Items ({selectedItems.length})</h3>
              {selectedItems.length === 0 ? (
                <p className="text-xs text-[#86868B]">No items selected yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedItems.map((item) => (
                    <div key={item.variant_id} className="flex items-center justify-between p-3 bg-white border border-[#F5F5F7] rounded-xl text-sm">
                      <span className="font-medium truncate flex-1">{item.product_name}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#F5F5F7] rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.variant_id, -1)} className="p-1 hover:bg-white rounded"><Minus className="w-3 h-3" /></button>
                          <span className="w-4 text-center text-xs font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variant_id, 1)} className="p-1 hover:bg-white rounded"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeItem(item.variant_id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#D2D2D7] space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#86868B]">Individual Total</span>
                <span className="font-semibold line-through text-[#86868B]">{individualTotal.toFixed(2)}</span>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1D1D1F] mb-1">Bundle Price <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={bundlePrice}
                  onChange={(e) => setBundlePrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#e08f04] rounded-xl text-sm font-semibold"
                  placeholder="0.00"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!name || !bundlePrice || selectedItems.length === 0 || createMutation.isPending}
                className="w-full py-3 bg-[#eda807] text-white font-semibold rounded-xl hover:bg-[#edb600] disabled:opacity-50 transition-colors"
              >
                {createMutation.isPending ? "Creating..." : "Create Bundle"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
