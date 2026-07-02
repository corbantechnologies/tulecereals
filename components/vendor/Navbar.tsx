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
  User,
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
      <nav className="bg-white border-b border-secondary/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo / Brand */}
            <div className="flex items-center">
              <Link
                href={isStrictlyPOSStaff ? "/pos/register" : "/vendor/dashboard"}
                className="flex-shrink-0 flex items-center gap-2"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </div>
                <span className="font-serif text-lg font-bold text-foreground">
                  {isStrictlyPOSStaff ? "Tule POS Portal" : "Tule Vendor Portal"}
                </span>
              </Link>
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center space-x-4">
              {/* Desktop User Info */}
              <div className="hidden md:flex md:items-center space-x-4">
                <div className="flex items-center gap-3 pl-6 border-l border-secondary/20">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-foreground">
                      {vendor?.first_name} {vendor?.last_name}
                    </p>
                    <p className="text-xs text-foreground/50 truncate max-w-[150px]">
                      {vendor?.email}
                      {isStrictlyPOSStaff && " (POS)"}
                    </p>
                  </div>
                  <div className="h-9 w-9 bg-secondary/10 rounded-full flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="p-2 text-foreground/50 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Toggle for Drawer */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground/60 hover:text-foreground hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-label="Open menu"
              >
                <Menu className="block h-6 w-6" />
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
            <div className="flex items-center justify-between px-4 h-16 border-b border-secondary/20">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                </div>
                <span className="font-serif text-md font-bold text-foreground">
                  Navigation
                </span>
              </div>
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground/60 hover:text-foreground hover:bg-secondary/10"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links Stack */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {filteredMainNavLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/5 text-primary"
                        : "text-foreground/70 hover:bg-secondary/5 hover:text-foreground"
                    }`}
                  >
                    <link.icon className={`w-5 h-5 mr-3 ${isActive ? "text-primary" : "text-foreground/40"}`} />
                    {link.name}
                  </Link>
                );
              })}

              {/* POS Multi-tier Dropdown section */}
              {filteredPosNavLinks.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => setIsPosDropdownOpen(!isPosDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium text-foreground/70 hover:bg-secondary/5 hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center">
                      <Store className="w-5 h-5 mr-3 text-foreground/40" />
                      Point of Sale
                    </div>
                    {isPosDropdownOpen ? (
                      <ChevronDown className="w-4 h-4 text-foreground/40" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-foreground/40" />
                    )}
                  </button>
                  
                  {isPosDropdownOpen && (
                    <div className="mt-1 space-y-1 pl-4 border-l border-secondary/10 ml-5">
                      {filteredPosNavLinks.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsDrawerOpen(false)}
                            className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-primary/5 text-primary"
                                : "text-foreground/70 hover:bg-secondary/5 hover:text-foreground"
                            }`}
                          >
                            <link.icon className={`w-4 h-4 mr-3 ${isActive ? "text-primary" : "text-foreground/40"}`} />
                            {link.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Footer Area inside Drawer */}
            <div className="px-4 py-4 border-t border-secondary/20 bg-secondary/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center text-primary">
                  <User className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-foreground truncate">
                    {vendor?.first_name} {vendor?.last_name}
                  </p>
                  <p className="text-xs text-foreground/50 truncate">
                    {vendor?.email}
                    {isStrictlyPOSStaff && " (POS)"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" /> Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}