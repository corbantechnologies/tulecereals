"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchPickupStationsVendor } from "@/hooks/pickupstations/actions";
import { useFetchShippingZonesVendor } from "@/hooks/shippingzones/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { MapPin, Truck, Plus, ChevronRight, Search, Filter } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { SkeletonRow } from "@/components/dashboard/DashboardSkeletons";
import VendorModal from "@/components/vendor/Modal";
import CreatePickupStation from "@/forms/pickupstations/CreatePickupStation";
import CreateShippingZone from "@/forms/shippingzones/CreateShippingZone";

export default function LogisticsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pickup" | "shipping">("pickup");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

  const { data: vendor } = useFetchAccount();
  const { data: pickupStations, isLoading: isLoadingPickup } = useFetchPickupStationsVendor();
  const { data: shippingZones, isLoading: isLoadingShipping } = useFetchShippingZonesVendor();

  const filteredPickup = pickupStations?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShipping = shippingZones?.filter(z => 
    z.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    z.zone_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-8 md:py-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <SectionHeader 
            title="Logistics Management" 
            description="Configure your delivery network, including physical pickup points and regional shipping zones."
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
              <input 
                type="text" 
                placeholder="Search logistics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#D2D2D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 transition-all shadow-sm"
              />
            </div>
            {vendor?.is_superuser && (
              <button 
                onClick={() => activeTab === "pickup" ? setIsPickupModalOpen(true) : setIsShippingModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#e38800] text-white rounded-xl text-sm font-bold hover:bg-[#f4bf4c] transition-all shadow-md shadow-[#0071E3]/20"
              >
                <Plus className="w-4 h-4" />
                Add {activeTab === "pickup" ? "Station" : "Zone"}
              </button>
            )}
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1 bg-[#E5E5E7] rounded-xl w-fit mb-8">
          <button 
            onClick={() => setActiveTab("pickup")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "pickup" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#6E6E73] hover:text-[#1D1D1F]"}`}
          >
            <MapPin className="w-4 h-4" />
            Pickup Stations
          </button>
          <button 
            onClick={() => setActiveTab("shipping")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "shipping" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#6E6E73] hover:text-[#1D1D1F]"}`}
          >
            <Truck className="w-4 h-4" />
            Shipping Zones
          </button>
        </div>

        <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#86868B]">Name & Details</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#86868B]">Location / Code</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#86868B]">Cost</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#86868B]">Delivery ETA</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#86868B]">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {activeTab === "pickup" ? (
                isLoadingPickup ? <SkeletonRow /> : filteredPickup?.map(station => (
                  <tr 
                    key={station.station_code} 
                    className="hover:bg-[#F5F5F7]/50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/vendor/logistics/pickupstations/${station.station_code}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1D1D1F] text-sm group-hover:text-[#e39b00] transition-colors">{station.name}</p>
                      <p className="text-[11px] text-[#86868B] mt-0.5">{station.station_code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#1D1D1F]">{station.city}</p>
                      <p className="text-[11px] text-[#86868B]">{station.location}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1D1D1F]">
                      {vendor?.shop?.currency || "$"}{station.cost_to_customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6E6E73]">{station.estimated_delivery_days} days</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${station.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {station.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-4 h-4 text-[#D2D2D7] group-hover:text-[#e38800] transition-colors inline" />
                    </td>
                  </tr>
                ))
              ) : (
                isLoadingShipping ? <SkeletonRow /> : filteredShipping?.map(zone => (
                  <tr 
                    key={zone.zone_code} 
                    className="hover:bg-[#F5F5F7]/50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/vendor/logistics/shippingzones/${zone.zone_code}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1D1D1F] text-sm group-hover:text-[#e38100] transition-colors">{zone.name}</p>
                      <p className="text-[11px] text-[#86868B] mt-0.5 truncate max-w-xs">{zone.description || "No description provided"}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-[#86868B]">{zone.zone_code}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1D1D1F]">
                      {vendor?.shop?.currency || "$"}{zone.delivery_cost}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6E6E73]">{zone.estimated_delivery_days} days</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${zone.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {zone.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-4 h-4 text-[#D2D2D7] group-hover:text-[#e39400] transition-colors inline" />
                    </td>
                  </tr>
                ))
              )}
              {((activeTab === "pickup" && !filteredPickup?.length) || (activeTab === "shipping" && !filteredShipping?.length)) && !isLoadingPickup && !isLoadingShipping && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <p className="text-sm text-[#86868B]">No results found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <VendorModal 
          isOpen={isPickupModalOpen} 
          onClose={() => setIsPickupModalOpen(false)} 
          title="Add Pickup Station"
        >
          <CreatePickupStation 
            currency={vendor?.shop?.currency || "$"} 
            onSuccess={() => setIsPickupModalOpen(false)} 
          />
        </VendorModal>

        <VendorModal 
          isOpen={isShippingModalOpen} 
          onClose={() => setIsShippingModalOpen(false)} 
          title="Add Shipping Zone"
        >
          <CreateShippingZone 
            currency={vendor?.shop?.currency || "$"} 
            onSuccess={() => setIsShippingModalOpen(false)} 
          />
        </VendorModal>
      </div>
    </div>
  );
}
