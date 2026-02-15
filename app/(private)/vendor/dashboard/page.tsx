"use client";

import { useState } from "react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCategoriesVendor } from "@/hooks/categories/actions";
import { useFetchSubCategoriesVendor } from "@/hooks/subcategories/actions";
import { useFetchPickupStationsVendor } from "@/hooks/pickupstations/actions";
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
import UpdateShopForm from "@/forms/shop/UpdateShop";
import { useFetchProductsVendor } from "@/hooks/products/actions";

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
  const [isShopUpdateModalOpen, setIsShopUpdateModalOpen] = useState(false);

  // Selected Item States
  const [selectedCategoryReference, setSelectedCategoryReference] =
    useState("");
  const [selectedSubCategoryReference, setSelectedSubCategoryReference] =
    useState("");
  const [selectedPickupStationCode, setSelectedPickupStationCode] =
    useState("");

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
    data: products,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useFetchProductsVendor();

  const { data: shopData, refetch: refetchShop } = useFetchShop(
    vendor?.shop?.shop_code || "",
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "categories", label: "Categories", icon: LayoutGrid },
    { id: "subcategories", label: "Subcategories", icon: ListTree },
    { id: "pickup-stations", label: "Pickup Stations", icon: MapPin },
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
      title: "Products",
      value: products?.length || 0,
      icon: Package,
      loading: isLoadingProducts,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="flex-1">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary mb-2 block font-medium">
              Vendor Portal
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-tight">
              Welcome back, <br className="hidden sm:block" />
              <span className="italic text-primary">
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

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-8 border-b border-secondary/20 gap-8 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-primary transition-colors"
                  : "text-foreground/40 hover:text-foreground/70"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in fade-in slide-in-from-bottom-1" />
              )}
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
              <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
                <div className="p-6 border-b border-secondary/20 bg-secondary/5 flex justify-between items-center">
                  <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    Shop Profile
                  </h3>
                  <button
                    onClick={() => setIsShopUpdateModalOpen(true)}
                    className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit Details
                  </button>
                </div>
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {[
                    {
                      label: "Shop Name",
                      value: shopData?.name || vendor?.shop?.name || "N/A",
                    },
                    {
                      label: "Shop Email",
                      value: shopData?.email || vendor?.shop?.email || "N/A",
                    },
                    {
                      label: "Shop Code",
                      value:
                        shopData?.shop_code || vendor?.shop?.shop_code || "N/A",
                    },
                    {
                      label: "Country",
                      value:
                        shopData?.country || vendor?.shop?.country || "N/A",
                    },
                    {
                      label: "Registration Date",
                      value: shopData?.created_at
                        ? formatDate(shopData.created_at)
                        : vendor?.shop?.created_at
                          ? formatDate(vendor.shop.created_at)
                          : "N/A",
                    },
                    {
                      label: "Reference ID",
                      value:
                        shopData?.reference || vendor?.shop?.reference || "N/A",
                    },
                  ].map((field, i) => (
                    <div key={i}>
                      <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                        {field.label}
                      </p>
                      {isLoadingVendor ? (
                        <div className="h-5 w-3/4 bg-secondary/10 animate-pulse rounded-sm" />
                      ) : (
                        <p className="text-foreground font-medium">
                          {field.value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-start md:items-center mb-6">
                <SectionHeader
                  title="Categories Management"
                  description="Manage your product categories and their visibility."
                />
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </button>
              </div>
              <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/5 border-b border-secondary/20">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Name
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Reference
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Status
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Subcategories
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {isLoadingCategories ? (
                        Array(3)
                          .fill(0)
                          .map((_, i) => <SkeletonRow key={i} />)
                      ) : categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <tr
                            key={cat.reference}
                            className="hover:bg-secondary/5 transition-colors group"
                          >
                            <td className="px-6 py-4 font-medium text-foreground">
                              {cat.name}
                            </td>
                            <td className="px-6 py-4 text-xs font-mono text-foreground/50">
                              {cat.reference}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${cat.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {cat.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground/60">
                              {cat.subcategories.length} items
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => {
                                  setSelectedCategoryReference(cat.reference);
                                  setIsUpdateCategoryModalOpen(true);
                                }}
                                className="text-foreground/50 hover:text-primary transition-colors"
                                title="Edit Category"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-foreground/40 italic"
                          >
                            No categories found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "subcategories" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-start md:items-center mb-6">
                <SectionHeader
                  title="Subcategories Overview"
                  description="Deep dive into your product sub-classifications."
                />
                <button
                  onClick={() => setIsSubCategoryModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subcategory
                </button>
              </div>
              <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/5 border-b border-secondary/20">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Name
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Parent Category
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Status
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Created
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {isLoadingSubcategories ? (
                        Array(3)
                          .fill(0)
                          .map((_, i) => <SkeletonRow key={i} />)
                      ) : subcategories && subcategories.length > 0 ? (
                        subcategories.map((sub) => (
                          <tr
                            key={sub.reference}
                            className="hover:bg-secondary/5 transition-colors border-b border-secondary/10"
                          >
                            <td className="px-6 py-4 font-medium text-foreground">
                              {sub.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-xs font-mono text-foreground/50">
                              {sub.category}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${sub.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {sub.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-foreground/60">
                              {formatDate(sub.created_at)}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => {
                                  setSelectedSubCategoryReference(
                                    sub.reference,
                                  );
                                  setIsUpdateSubCategoryModalOpen(true);
                                }}
                                className="text-foreground/50 hover:text-primary transition-colors"
                                title="Edit Subcategory"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-foreground/40 italic"
                          >
                            No subcategories found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pickup-stations" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-start md:items-center mb-6">
                <SectionHeader
                  title="Pickup Stations"
                  description="Customer delivery points and their operational status."
                />
                {vendor?.is_superuser && (
                  <button
                    onClick={() => setIsPickupStationModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Station
                  </button>
                )}
              </div>
              <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/5 border-b border-secondary/20">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Station Name
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Location
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Delivery Cost
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Status
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                      {isLoadingPickupStations ? (
                        Array(3)
                          .fill(0)
                          .map((_, i) => <SkeletonRow key={i} />)
                      ) : pickupStations && pickupStations.length > 0 ? (
                        pickupStations.map((station) => (
                          <tr
                            key={station.reference}
                            className="hover:bg-secondary/5 transition-colors"
                          >
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
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-foreground/40 italic"
                          >
                            No pickup stations found.
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
      </div>
    </div>
  );
}
