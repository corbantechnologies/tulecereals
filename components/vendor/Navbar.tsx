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
    User,
    ShoppingBag,
    LucideShoppingBasket,
    BarChart3,
} from "lucide-react";

export default function VendorNavbar() {
    const pathname = usePathname();
    const { data: vendor } = useFetchAccount();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        {
            name: "Dashboard",
            href: "/vendor/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Products", // Placeholder for when products page is ready
            href: "/vendor/products",
            icon: ShoppingBag,
        },
        {
            name: "Shop Orders",
            href: "/vendor/shop-orders",
            icon: LucideShoppingBasket,
        },
        {
            name: "Analytics",
            href: "/vendor/analytics",
            icon: BarChart3,
        },
        {
            name: "Settings",
            href: "/vendor/settings",
            icon: Settings,
        },
    ];

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <nav className="bg-white border-b border-secondary/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex items-center">
                        <Link href="/vendor/dashboard" className="flex-shrink-0 flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <LayoutDashboard className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-serif text-lg font-bold text-foreground">
                                Tule Vendor Portal
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors border-b-2 ${isActive
                                        ? "border-primary text-foreground"
                                        : "border-transparent text-foreground/60 hover:text-foreground hover:border-secondary"
                                        }`}
                                >
                                    <link.icon className={`w-4 h-4 mr-2 ${isActive ? "text-primary" : ""}`} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User & Logout (Desktop) */}
                    <div className="hidden md:flex md:items-center md:ml-6 space-x-4">
                        <div className="flex items-center gap-3 pl-6 border-l border-secondary/20">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-medium text-foreground">
                                    {vendor?.first_name} {vendor?.last_name}
                                </p>
                                <p className="text-xs text-foreground/50 truncate max-w-[150px]">
                                    {vendor?.email}
                                </p>
                            </div>
                            <div className="h-9 w-9 bg-secondary/10 rounded-full flex items-center justify-center text-primary">
                                <User className="w-5 h-5" />
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-foreground/50 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                            title="Log out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground/60 hover:text-foreground hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-secondary/20">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${isActive
                                        ? "bg-primary/5 text-primary"
                                        : "text-foreground/70 hover:bg-secondary/5 hover:text-foreground"
                                        }`}
                                >
                                    <link.icon className={`w-5 h-5 mr-3 ${isActive ? "text-primary" : "text-foreground/40"}`} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="pt-4 pb-4 border-t border-secondary/20 px-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center text-primary">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-base font-medium text-foreground">
                                    {vendor?.first_name} {vendor?.last_name}
                                </div>
                                <div className="text-sm font-medium text-foreground/50">
                                    {vendor?.email}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
