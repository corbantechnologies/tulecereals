"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  LucideShoppingBasket,
  BarChart3,
  Truck,
  ScanLine,
  Boxes,
  Users,
  Receipt,
  ClipboardList,
  Store,
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react";

export default function VendorNavbar() {
  const pathname = usePathname();
  const { data: vendor } = useFetchAccount();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isPosDropdownOpen, setIsPosDropdownOpen] = useState(false);

  // Grouped Navigation Links
  const mainNavLinks = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/vendor/products", icon: ShoppingBag },
    { name: "Logistics", href: "/vendor/logistics", icon: Truck },
    { name: "Shop Orders", href: "/vendor/shop-orders", icon: LucideShoppingBasket },
    { name: "Purchase Orders", href: "/vendor/purchase-orders", icon: Boxes },
    { name: "Inventory", href: "/vendor/inventory", icon: Boxes },
    { name: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
    { name: "Settings", href: "/vendor/settings", icon: Settings },
  ];

  const posNavLinks = [
    { name: "POS Sales", href: "/vendor/pos-sales", icon: Receipt },
    { name: "POS Shifts", href: "/vendor/pos-shifts", icon: ClipboardList },
    { name: "Customers", href: "/pos/customers", icon: Users },
    { name: "POS Register", href: "/pos/register", icon: ScanLine },
    { name: "Manage Bundles", href: "/pos/bundles", icon: Layers },
    { name: "POS Settings", href: "/pos/settings", icon: Settings },
  ];

  const isStrictlyPOSStaff = vendor?.is_pos_staff && !vendor?.is_vendor && !vendor?.is_superuser;

  const filteredMainNavLinks = isStrictlyPOSStaff
    ? mainNavLinks.filter((link) => ["Inventory"].includes(link.name))
    : mainNavLinks;

  const filteredPosNavLinks = isStrictlyPOSStaff
    ? posNavLinks.filter((link) => ["POS Register", "Customers", "Manage Bundles"].includes(link.name))
    : posNavLinks;

  // Open the dropdown automatically if we are currently on a POS page
  React.useEffect(() => {
    const isPosActive = posNavLinks.some(
      (link) => pathname === link.href || pathname.startsWith(link.href + "/")
    );
    if (isPosActive) {
      setIsPosDropdownOpen(true);
    }
  }, [pathname]);

  return (
    <>
      <nav className="bg-white border-b border-[#D2D2D7] sticky top-0 z-50">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">

            <div className="flex items-center gap-3">
              {/* Brand */}
              <Link
                href={isStrictlyPOSStaff ? "/pos/register" : "/vendor/dashboard"}
                className="flex items-center gap-2 flex-shrink-0 transition-opacity hover:opacity-90"
              >
                <img src="/logo.svg" alt="GearHouse" className="h-7 w-auto" />
                <div className="hidden sm:block border-l border-[#D2D2D7] ml-1 pl-2.5">
                  <span className="text-xs text-[#86868B] font-semibold uppercase tracking-wider">
                    {isStrictlyPOSStaff ? "POS Portal" : "Vendor Portal"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: User + Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-[#1D1D1F] leading-none">
                  {vendor?.first_name} {vendor?.last_name}
                </p>
                <p className="text-[10px] text-[#86868B] mt-0.5 truncate max-w-[140px]">
                  {vendor?.email}
                  {isStrictlyPOSStaff && " (POS)"}
                </p>
              </div>
              <div className="w-8 h-8 bg-[#e38800] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {vendor?.first_name?.slice(0, 1) || ""}{vendor?.last_name?.slice(0, 1) || ""}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-[#86868B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors hidden sm:flex"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              
              {/* Drawer Toggle */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 -mr-2 rounded-lg text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Side Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative z-[100] w-full max-w-[280px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#F5F5F7]">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="GearHouse" className="h-6 w-auto" />
                <span className="text-xs text-[#86868B] font-semibold uppercase tracking-wider border-l border-[#D2D2D7] ml-2 pl-2">Vendor</span>
              </div>
              <button
                className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors outline-none rounded p-1"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {filteredMainNavLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#0071E3]/10 text-[#e38800]"
                        : "text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}

              {/* POS Dropdown */}
              {filteredPosNavLinks.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => setIsPosDropdownOpen(!isPosDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5" />
                      Point of Sale
                    </div>
                    {isPosDropdownOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isPosDropdownOpen && (
                    <div className="mt-1 space-y-1 pl-4">
                      {filteredPosNavLinks.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsDrawerOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-[#0071E3]/10 text-[#e38800]"
                                : "text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                            }`}
                          >
                            <link.icon className="w-4 h-4" />
                            {link.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer / User Mobile */}
            <div className="px-4 py-4 border-t border-[#F5F5F7] bg-[#FAFAFA]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#e38800] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {vendor?.first_name?.slice(0, 1) || ""}{vendor?.last_name?.slice(0, 1) || ""}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-[#1D1D1F] truncate">
                    {vendor?.first_name} {vendor?.last_name}
                  </p>
                  <p className="text-xs text-[#86868B] truncate">
                    {vendor?.email}
                    {isStrictlyPOSStaff && " (POS)"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
