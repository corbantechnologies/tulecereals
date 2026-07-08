"use client";

import { useState } from "react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCategoriesVendor } from "@/hooks/categories/actions";
import { useFetchSubCategoriesVendor } from "@/hooks/subcategories/actions";
import { useFetchPickupStationsVendor } from "@/hooks/pickupstations/actions";
import { useFetchShippingZonesVendor } from "@/hooks/shippingzones/actions";
import { useFetchShop } from "@/hooks/shops/actions";
import {
  LayoutGrid,
  ListTree,
  MapPin,
  User as UserIcon,
  TrendingUp,
  Package,
  Plus,
  Edit,
  Truck,
  BarChart3,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { SkeletonRow } from "@/components/dashboard/DashboardSkeletons";
import { formatDate } from "@/components/dashboard/utils";
import VendorModal from "@/components/vendor/Modal";
import CreateCategory from "@/forms/categories/CreateCategory";
import UpdateCategory from "@/forms/categories/UpdateCategory";
import CreateSubCategory from "@/forms/subcategories/CreateSubCategory";
import UpdateSubCategory from "@/forms/subcategories/UpdateSubCategory";
import CreatePickupStation from "@/forms/pickupstations/CreatePickupStation";
import UpdatePickupStation from "@/forms/pickupstations/UpdatePickupStation";
import CreateShippingZone from "@/forms/shippingzones/CreateShippingZone";
import UpdateShippingZone from "@/forms/shippingzones/UpdateShippingZone";
import UpdateShopForm from "@/forms/shop/UpdateShop";
import { useFetchProductsVendor } from "@/hooks/products/actions";
import AnalyticsTab from "@/components/vendor/dashboard/AnalyticsTab";

// --- Main Page ---

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] =
    useState(false);
  const [isUpdateSubCategoryModalOpen, setIsUpdateSubCategoryModalOpen] =
    useState(false);
  const [isPickupStationModalOpen, setIsPickupStationModalOpen] =
    useState(false);
  const [isUpdatePickupStationModalOpen, setIsUpdatePickupStationModalOpen] =
    useState(false);
  const [isShippingZoneModalOpen, setIsShippingZoneModalOpen] = useState(false);
  const [isUpdateShippingZoneModalOpen, setIsUpdateShippingZoneModalOpen] = useState(false);
  const [isShopUpdateModalOpen, setIsShopUpdateModalOpen] = useState(false);

  // Selected Item States
  const [selectedCategoryReference, setSelectedCategoryReference] =
    useState("");
  const [selectedSubCategoryReference, setSelectedSubCategoryReference] =
    useState("");
  const [selectedPickupStationCode, setSelectedPickupStationCode] =
    useState("");
  const [selectedShippingZoneCode, setSelectedShippingZoneCode] = useState("");

  const { data: vendor, isLoading: isLoadingVendor } = useFetchAccount();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useFetchCategoriesVendor();
  const {
    data: subcategories,
    isLoading: isLoadingSubcategories,
    refetch: refetchSubcategories,
  } = useFetchSubCategoriesVendor();
  const {
    data: pickupStations,
    isLoading: isLoadingPickupStations,
    refetch: refetchPickupStations,
  } = useFetchPickupStationsVendor();
  const {
    data: shippingZones,
    isLoading: isLoadingShippingZones,
    refetch: refetchShippingZones,
  } = useFetchShippingZonesVendor();
  const {
    data: products,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useFetchProductsVendor();

  const { data: shopData, refetch: refetchShop } = useFetchShop(
    vendor?.shop?.shop_code || "",
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "categories", label: "Categories", icon: LayoutGrid },
    { id: "subcategories", label: "Subcategories", icon: ListTree },
    { id: "pickup-stations", label: "Pickup Stations", icon: MapPin },
    { id: "shipping-zones", label: "Shipping Zones", icon: Truck },
  ];

  const stats = [
    {
      title: "Total Categories",
      value: categories?.length || 0,
      icon: LayoutGrid,
      loading: isLoadingCategories,
    },
    {
      title: "Subcategories",
      value: subcategories?.length || 0,
      icon: ListTree,
      loading: isLoadingSubcategories,
    },
    {
      title: "Pickup Stations",
      value: pickupStations?.length || 0,
      icon: MapPin,
      loading: isLoadingPickupStations,
    },
    {
      title: "Shipping Zones",
      value: shippingZones?.length || 0,
      icon: Truck,
      loading: isLoadingShippingZones,
    },
    {
      title: "Products",
      value: products?.length || 0,
      icon: Package,
      loading: isLoadingProducts,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="flex-1">
            <span className="text-xs font-semibold text-[#e8a808] uppercase tracking-widest mb-2 block">
              Vendor Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
              Welcome back,{" "}
              <span className="text-[#e39b00]">
                {vendor?.first_name || "Merchant"}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-foreground/50 border-b border-secondary/30 pb-1 w-fit self-start md:self-auto">
            <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Account Status: </span>
            <span
              className={`font-semibold ${vendor?.is_active ? "text-green-600" : "text-red-500"}`}
            >
              {vendor?.is_active ? "Active" : "Pending"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-0 mb-8 gap-1 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id
                ? "bg-[#de9205] text-white shadow-md shadow-[#0071E3]/20"
                : "text-[#6E6E73] hover:bg-white hover:text-[#1D1D1F]"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8 md:space-y-12">
          {activeTab === "overview" && (
            <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
              {/* Analytics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <StatCard key={i} {...stat} />
                ))}
              </div>

              {/* Shop Information */}
              <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F5F5F7] bg-[#FAFAFA] flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#de9709]" />
                    Shop Profile
                  </h3>
                  <button
                    onClick={() => setIsShopUpdateModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#de9a06] hover:text-[#e89906] transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit Details
                  </button>
                </div>
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {[
                    { label: "Shop Name", value: shopData?.name || vendor?.shop?.name || "N/A" },
                    { label: "Shop Email", value: shopData?.email || vendor?.shop?.email || "N/A" },
                    { label: "Shop Code", value: shopData?.shop_code || vendor?.shop?.shop_code || "N/A" },
                    { label: "Country", value: shopData?.country || vendor?.shop?.country || "N/A" },
                    { label: "Registration Date", value: shopData?.created_at ? formatDate(shopData.created_at) : vendor?.shop?.created_at ? formatDate(vendor.shop.created_at) : "N/A" },
                    { label: "Reference ID", value: shopData?.reference || vendor?.shop?.reference || "N/A" },
                  ].map((field, i) => (
                    <div key={i}>
                      <p className="text-[10px] uppercase tracking-widest text-[#86868B] font-semibold mb-1">
                        {field.label}
                      </p>
                      {isLoadingVendor ? (
                        <div className="h-5 w-3/4 bg-[#F5F5F7] animate-pulse rounded-lg" />
                      ) : (
                        <p className="text-[#1D1D1F] font-semibold text-sm">{field.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && <AnalyticsTab />}

          {activeTab === "categories" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-start md:items-center mb-4">
                <SectionHeader
                  title="Categories"
                  description="Manage your product categories and their visibility."
                />
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#e09b06] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e18308] transition-all shadow-md shadow-[#0071E3]/20"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
              </div>
              <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto hidden sm:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7]">
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Name</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Reference</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Status</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Subcategories</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F7]">
                      {isLoadingCategories ? (
                        Array(3)
                          .fill(0)
                          .map((_, i) => <SkeletonRow key={i} />)
                      ) : categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <tr key={cat.reference} className="hover:bg-[#F5F5F7] transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-[#1D1D1F]">{cat.name}</td>
                            <td className="px-6 py-4 text-xs font-mono text-[#86868B]">{cat.reference}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${cat.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {cat.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#6E6E73]">{cat.subcategories.length} items</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => { setSelectedCategoryReference(cat.reference); setIsUpdateCategoryModalOpen(true); }}
                                className="text-[#86868B] hover:text-[#e39d06] transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-16">
                            <div className="flex flex-col items-center justify-center gap-3 text-center">
                              <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7] flex items-center justify-center">
                                <LayoutGrid className="w-5 h-5 text-[#D2D2D7]" />
                              </div>
                              <p className="text-sm font-semibold text-[#1D1D1F]">No categories yet</p>
                              <p className="text-xs text-[#86868B]">Create your first category to organise your tech products.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Categories View - Card based */}
                <div className="sm:hidden divide-y divide-[#F5F5F7]">
                  {isLoadingCategories ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="p-4 flex gap-4 animate-pulse">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#F5F5F7] rounded w-1/2" />
                          <div className="h-3 bg-[#F5F5F7] rounded w-1/4" />
                        </div>
                      </div>
                    ))
                  ) : categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <div key={cat.reference} className="p-4 flex justify-between items-center">
                        <div className="min-w-0 pr-4">
                          <p className="font-semibold text-[#1D1D1F] text-sm truncate">{cat.name}</p>
                          <p className="text-[10px] text-[#86868B] mt-0.5">{cat.subcategories.length} subcategories</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${cat.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {cat.is_active ? "Active" : "Inactive"}
                          </span>
                          <button
                            onClick={() => { setSelectedCategoryReference(cat.reference); setIsUpdateCategoryModalOpen(true); }}
                            className="p-2 text-[#86868B] hover:text-[#e3aa00] hover:bg-[#0071E3]/5 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-sm text-[#86868B]">No categories yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "subcategories" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-start md:items-center mb-4">
                <SectionHeader
                  title="Subcategories"
                  description="Deep dive into your product sub-classifications."
                />
                <button
                  onClick={() => setIsSubCategoryModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#dd9309] px-4 py-2 text-sm font-semibold text-white hover:bg-[#dc810a] transition-all shadow-md shadow-[#0071E3]/20"
                >
                  <Plus className="h-4 w-4" />
                  Add Subcategory
                </button>
              </div>
              <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto hidden sm:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7]">
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Name</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Parent Category</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Status</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Created</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F7]">
                      {isLoadingSubcategories ? (
                        Array(3)
                          .fill(0)
                          .map((_, i) => <SkeletonRow key={i} />)
                      ) : subcategories && subcategories.length > 0 ? (
                        subcategories.map((sub) => (
                          <tr key={sub.reference} className="hover:bg-[#F5F5F7] transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-[#1D1D1F]">{sub.name || "N/A"}</td>
                            <td className="px-6 py-4 text-xs font-mono text-[#86868B]">{sub.category}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${sub.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {sub.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-[#86868B]">{formatDate(sub.created_at)}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => { setSelectedSubCategoryReference(sub.reference); setIsUpdateSubCategoryModalOpen(true); }}
                                className="text-[#86868B] hover:text-[#e39308] transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-16">
                            <div className="flex flex-col items-center justify-center gap-3 text-center">
                              <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7] flex items-center justify-center">
                                <ListTree className="w-5 h-5 text-[#D2D2D7]" />
                              </div>
                              <p className="text-sm font-semibold text-[#1D1D1F]">No subcategories yet</p>
                              <p className="text-xs text-[#86868B]">Add subcategories to further organise your gear.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Subcategories View - Card based */}
                <div className="sm:hidden divide-y divide-[#F5F5F7]">
                  {isLoadingSubcategories ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="p-4 flex gap-4 animate-pulse">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#F5F5F7] rounded w-1/2" />
                          <div className="h-3 bg-[#F5F5F7] rounded w-1/4" />
                        </div>
                      </div>
                    ))
                  ) : subcategories && subcategories.length > 0 ? (
                    subcategories.map((sub) => (
                      <div key={sub.reference} className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 pr-4">
                            <p className="font-semibold text-[#1D1D1F] text-sm truncate">{sub.name || "N/A"}</p>
                            <p className="text-[10px] text-[#86868B] mt-0.5">Parent: {sub.category}</p>
                          </div>
                          <button
                            onClick={() => { setSelectedSubCategoryReference(sub.reference); setIsUpdateSubCategoryModalOpen(true); }}
                            className="p-2 text-[#86868B] hover:text-[#dd9308] hover:bg-[#0071E3]/5 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className={`px-2 py-0.5 rounded-full uppercase tracking-tighter ${sub.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {sub.is_active ? "Active" : "Inactive"}
                          </span>
                          <span className="text-[#86868B] font-medium">{formatDate(sub.created_at)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-sm text-[#86868B]">No subcategories yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "pickup-stations" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Pickup Stations</h2>
                  <p className="text-[#86868B] text-sm mt-1">Manage your delivery network and collection points.</p>
                </div>
                {vendor?.is_superuser && (
                  <button
                    onClick={() => setIsPickupStationModalOpen(true)}
                    className="flex items-center justify-center px-6 py-2.5 bg-[#e5a207] text-white rounded-xl text-sm font-bold hover:bg-[#e58e0b] transition-all shadow-md shadow-[#0071E3]/20"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Station
                  </button>
                )}
              </div>
              <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto hidden sm:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7]">
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Station Name</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Location</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Delivery Cost</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">ETA</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Status</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F7]">
                      {isLoadingPickupStations ? (
                        Array(3)
                          .fill(0)
                          .map((_, i) => <SkeletonRow key={i} />)
                      ) : pickupStations && pickupStations.length > 0 ? (
                        pickupStations.map((station) => (
                          <tr key={station.reference} className="hover:bg-[#F5F5F7] transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-foreground">
                                  {station.name}
                                </p>
                                <p className="text-[10px] font-mono text-foreground/40">
                                  {station.station_code}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-foreground/80">
                                  {station.city}
                                </span>
                                <span className="text-xs text-foreground/50">
                                  {station.location}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                              {vendor?.shop?.currency || "$"}{" "}
                              {station.cost_to_customer}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                              {station.estimated_delivery_days}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${station.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {station.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {vendor?.is_superuser && (
                                <button
                                  onClick={() => {
                                    setSelectedPickupStationCode(
                                      station.station_code,
                                    );
                                    setIsUpdatePickupStationModalOpen(true);
                                  }}
                                  className="text-foreground/50 hover:text-primary transition-colors"
                                  title="Edit Station"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-16">
                            <div className="flex flex-col items-center justify-center gap-3 text-center">
                              <div className="w-12 h-12 bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7] flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-[#D2D2D7]" />
                              </div>
                              <p className="text-sm font-semibold text-[#1D1D1F]">No pickup stations yet</p>
                              <p className="text-xs text-[#86868B]">Add pickup stations to offer delivery options to customers.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Pickup Stations View - Card based */}
                <div className="sm:hidden divide-y divide-[#F5F5F7]">
                  {isLoadingPickupStations ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="p-4 flex gap-4 animate-pulse">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#F5F5F7] rounded w-1/2" />
                          <div className="h-3 bg-[#F5F5F7] rounded w-1/4" />
                        </div>
                      </div>
                    ))
                  ) : pickupStations && pickupStations.length > 0 ? (
                    pickupStations.map((station) => (
                      <div key={station.reference} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-[#1D1D1F] text-sm">{station.name}</p>
                            <p className="text-[10px] text-[#86868B]">{station.city}, {station.location}</p>
                          </div>
                          {vendor?.is_superuser && (
                            <button
                              onClick={() => {
                                setSelectedPickupStationCode(station.station_code);
                                setIsUpdatePickupStationModalOpen(true);
                              }}
                              className="p-2 text-[#86868B] hover:text-[#d6880b] hover:bg-[#0071E3]/5 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex justify-between items-center bg-[#F5F5F7] p-3 rounded-xl border border-[#D2D2D7]">
                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-[#86868B] font-semibold mb-0.5">Delivery Cost</span>
                            <span className="text-xs font-bold text-[#1D1D1F]">{vendor?.shop?.currency || "$"}{station.cost_to_customer}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${station.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {station.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center mb-4">
                        <MapPin className="w-8 h-8 text-[#86868B]" />
                      </div>
                      <p className="text-lg font-bold text-[#1D1D1F]">No pickup stations yet</p>
                      <p className="text-sm text-[#86868B] mt-1 max-w-xs text-center">Add pickup stations to offer convenient delivery options to your customers.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "shipping-zones" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Shipping Zones</h2>
                  <p className="text-[#86868B] text-sm mt-1">Configure regional delivery routes and costs.</p>
                </div>
                {vendor?.is_superuser && (
                  <button
                    onClick={() => setIsShippingZoneModalOpen(true)}
                    className="flex items-center justify-center px-6 py-2.5 bg-[#d49008] text-white rounded-xl text-sm font-bold hover:bg-[#e47e09] transition-all shadow-md shadow-[#0071E3]/20"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Zone
                  </button>
                )}
              </div>
              <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto hidden sm:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7]">
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Zone Name</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Code</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Delivery Cost</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">ETA</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Status</th>
                        <th className="px-6 py-3.5 text-[10px] uppercase tracking-widest font-semibold text-[#e58b16]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F7]">
                      {isLoadingShippingZones ? (
                        Array(3)
                          .fill(0)
                          .map((_, i) => <SkeletonRow key={i} />)
                      ) : shippingZones && shippingZones.length > 0 ? (
                        shippingZones.map((zone) => (
                          <tr key={zone.zone_code} className="hover:bg-[#F5F5F7] transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-[#1D1D1F] text-sm">{zone.name}</p>
                              <p className="text-[10px] text-[#86868B] truncate max-w-[200px]">{zone.description}</p>
                            </td>
                            <td className="px-6 py-4 text-xs font-mono text-[#86868B]">{zone.zone_code}</td>
                            <td className="px-6 py-4 text-sm font-medium text-[#1D1D1F]">
                              {vendor?.shop?.currency || "$"}{zone.delivery_cost}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#6E6E73]">{zone.estimated_delivery_days} days</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${zone.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {zone.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {vendor?.is_superuser && (
                                <button
                                  onClick={() => { setSelectedShippingZoneCode(zone.zone_code); setIsUpdateShippingZoneModalOpen(true); }}
                                  className="text-[#86868B] hover:text-[#da7f10] transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center justify-center py-10">
                              <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center mb-4">
                                <Truck className="w-8 h-8 text-[#86868B]" />
                              </div>
                              <p className="text-lg font-bold text-[#1D1D1F]">No shipping zones yet</p>
                              <p className="text-sm text-[#86868B] mt-1 max-w-sm">Configure regional delivery routes and their associated costs for your customers.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <VendorModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          title="Create New Category"
        >
          <CreateCategory
            onSuccess={() => {
              setIsCategoryModalOpen(false);
              refetchCategories();
            }}
          />
        </VendorModal>

        <VendorModal
          isOpen={isSubCategoryModalOpen}
          onClose={() => setIsSubCategoryModalOpen(false)}
          title="Create New Subcategory"
        >
          <CreateSubCategory
            onSuccess={() => {
              setIsSubCategoryModalOpen(false);
              refetchSubcategories();
            }}
          />
        </VendorModal>

        <VendorModal
          isOpen={isShopUpdateModalOpen}
          onClose={() => setIsShopUpdateModalOpen(false)}
          title="Update Shop Details"
          maxWidth="max-w-2xl"
        >
          <UpdateShopForm
            onSuccess={() => {
              setIsShopUpdateModalOpen(false);
              if (refetchShop) refetchShop();
            }}
          />
        </VendorModal>

        <VendorModal
          isOpen={isUpdateCategoryModalOpen}
          onClose={() => setIsUpdateCategoryModalOpen(false)}
          title="Update Category"
        >
          {selectedCategoryReference && (
            <UpdateCategory
              reference={selectedCategoryReference}
              onSuccess={() => {
                setIsUpdateCategoryModalOpen(false);
                refetchCategories();
              }}
            />
          )}
        </VendorModal>

        <VendorModal
          isOpen={isUpdateSubCategoryModalOpen}
          onClose={() => setIsUpdateSubCategoryModalOpen(false)}
          title="Update Subcategory"
        >
          {selectedSubCategoryReference && (
            <UpdateSubCategory
              reference={selectedSubCategoryReference}
              onSuccess={() => {
                setIsUpdateSubCategoryModalOpen(false);
                refetchSubcategories();
              }}
            />
          )}
        </VendorModal>

        <VendorModal
          isOpen={isPickupStationModalOpen}
          onClose={() => setIsPickupStationModalOpen(false)}
          title="Create New Pickup Station"
        >
          <CreatePickupStation
            currency={vendor?.shop?.currency || "$"}
            onSuccess={() => {
              setIsPickupStationModalOpen(false);
              refetchPickupStations();
            }}
          />
        </VendorModal>

        <VendorModal
          isOpen={isUpdatePickupStationModalOpen}
          onClose={() => setIsUpdatePickupStationModalOpen(false)}
          title="Update Pickup Station"
        >
          {selectedPickupStationCode && (
            <UpdatePickupStation
              station_code={selectedPickupStationCode}
              currency={vendor?.shop?.currency || "$"}
              onSuccess={() => {
                setIsUpdatePickupStationModalOpen(false);
                refetchPickupStations();
              }}
            />
          )}
        </VendorModal>

        <VendorModal
          isOpen={isShippingZoneModalOpen}
          onClose={() => setIsShippingZoneModalOpen(false)}
          title="Create New Shipping Zone"
        >
          <CreateShippingZone
            currency={vendor?.shop?.currency || "$"}
            onSuccess={() => {
              setIsShippingZoneModalOpen(false);
              refetchShippingZones();
            }}
          />
        </VendorModal>

        <VendorModal
          isOpen={isUpdateShippingZoneModalOpen}
          onClose={() => setIsUpdateShippingZoneModalOpen(false)}
          title="Update Shipping Zone"
        >
          {selectedShippingZoneCode && (
            <UpdateShippingZone
              zone_code={selectedShippingZoneCode}
              currency={vendor?.shop?.currency || "$"}
              onSuccess={() => {
                setIsUpdateShippingZoneModalOpen(false);
                refetchShippingZones();
              }}
            />
          )}
        </VendorModal>
      </div>
    </div>
  );
}
