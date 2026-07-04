"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchPickupStation } from "@/hooks/pickupstations/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { MapPin, ArrowLeft, Edit, ExternalLink, ShieldCheck, Clock, Map as MapIcon } from "lucide-react";
import UpdatePickupStation from "@/forms/pickupstations/UpdatePickupStation";
import VendorModal from "@/components/vendor/Modal";

export default function PickupStationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pickup_code = params.pickup_code as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: vendor } = useFetchAccount();
  const { data: station, isLoading, isError } = useFetchPickupStation(pickup_code);

  if (isLoading) return <div className="p-20 text-center text-[#86868B]">Loading station details...</div>;
  if (isError || !station) return (
    <div className="p-20 text-center">
      <p className="text-red-500 font-bold mb-4">Pickup station not found.</p>
      <button onClick={() => router.back()} className="text-[#e38800] hover:underline flex items-center gap-1 mx-auto">
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>
    </div>
  );

  const details = [
    { label: "Station Name", value: station.name, icon: MapPin },
    { label: "City / Region", value: station.city, icon: MapIcon },
    { label: "Delivery Cost", value: `${vendor?.shop?.currency || "$"} ${station.cost_to_customer}`, icon: ShieldCheck },
    { label: "Estimated Delivery", value: `${station.estimated_delivery_days} Days`, icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-8 md:py-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6">
        
        {/* Breadcrumb */}
        <button 
          onClick={() => router.push("/vendor/logistics")}
          className="flex items-center gap-2 text-sm font-semibold text-[#86868B] hover:text-[#efa11a] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Logistics
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Info Card */}
          <div className="flex-1 space-y-8">
            <div className="bg-white border border-[#D2D2D7] rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#e39400] bg-[#0071E3]/5 px-2.5 py-1 rounded-full mb-3 inline-block">
                    Pickup Point
                  </span>
                  <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">{station.name}</h1>
                  <p className="text-[#86868B] text-sm mt-1 font-mono">{station.station_code}</p>
                </div>
                {vendor?.is_superuser && (
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F7] text-[#1D1D1F] rounded-xl text-sm font-bold hover:bg-[#E5E5E7] transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Details
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-[#F5F5F7] pt-8">
                {details.map((detail, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center flex-shrink-0 text-[#0071E3]">
                      <detail.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868B] mb-0.5">{detail.label}</p>
                      <p className="font-bold text-[#1D1D1F] text-lg">{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#D2D2D7] rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#1D1D1F] mb-4">Location & Access</h3>
              <p className="text-[#6E6E73] leading-relaxed mb-6">
                {station.location}
              </p>
              {station.map_link && (
                <a 
                  href={station.map_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e38800] text-white rounded-xl text-sm font-bold hover:bg-[#0077ED] transition-all shadow-md shadow-[#0071E3]/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Google Maps
                </a>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white border border-[#D2D2D7] rounded-3xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-[#1D1D1F] mb-4">Status</h4>
              <div className={`p-4 rounded-2xl flex items-center justify-between ${station.is_active ? "bg-green-50" : "bg-red-50"}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${station.is_active ? "text-green-700" : "text-red-700"}`}>
                  {station.is_active ? "Operational" : "Inactive"}
                </span>
                <div className={`w-3 h-3 rounded-full ${station.is_active ? "bg-green-500" : "bg-red-500"} shadow-sm animate-pulse`} />
              </div>
            </div>

            <div className="bg-[#1D1D1F] p-6 rounded-3xl shadow-xl">
              <h4 className="text-sm font-bold text-white/50 mb-4 uppercase tracking-widest">Analytics Snippet</h4>
              <p className="text-white text-2xl font-bold mb-1">Coming Soon</p>
              <p className="text-white/40 text-xs leading-relaxed">Detailed metrics for this pickup station will appear here in the next update.</p>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <VendorModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          title="Update Pickup Station"
        >
          <UpdatePickupStation 
            station_code={station.station_code} 
            currency={vendor?.shop?.currency || "$"}
            onSuccess={() => setIsEditModalOpen(false)}
          />
        </VendorModal>
      </div>
    </div>
  );
}
