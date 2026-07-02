"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { LogOut, Menu, X, ScanLine, Users, Monitor } from "lucide-react";

export default function POSNavbar() {
  const pathname = usePathname();
  const { data: user } = useFetchAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Register", href: "/pos/register", icon: ScanLine },
    { name: "Customers", href: "/pos/customers", icon: Users },
  ];

  return (
    <nav className="bg-[#1D1D1F] border-b border-[#333336] sticky top-0 z-50">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Monitor className="w-6 h-6 text-[#e38c00]" />
            <div className="border-l border-[#333336] ml-1 pl-2.5">
              <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">POS Terminal</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#e39b00] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: User + Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-white leading-none">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-white/50 mt-1 truncate max-w-[140px]">
                {user?.shop?.name || "Tulecereals"}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1D1D1F] border-t border-[#333336] shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0071E3]/20 text-[#e39b00]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="px-4 py-4 border-t border-[#333336] flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-white/50">
                {user?.shop?.name}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
