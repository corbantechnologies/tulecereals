"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import UserMenu from "./UserMenu";
import { useSession, signOut } from "next-auth/react";
import { useFetchCategories } from "@/hooks/categories/actions";
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { data: categories } = useFetchCategories();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemsCount =
    cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const activeCategories = categories?.filter((c) => c.is_active) || [];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary/20">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-serif font-bold text-foreground tracking-wide z-50 relative outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Tule Cereals
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
            >
              Home
            </Link>

            {/* Dynamic Shop Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <button
                className="flex items-center text-sm font-medium text-foreground/80 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
                aria-expanded={isShopOpen}
                onClick={() => setIsShopOpen(!isShopOpen)}
              >
                Shop <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {/* Dropdown Menu */}
              {isShopOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in duration-200">
                  <div className="bg-white rounded-sm shadow-sm border border-secondary/30 overflow-hidden">
                    {/* Shop All Link */}
                    <div className="group/cat relative">
                      <Link
                        href="/shop"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-secondary/5 hover:text-primary transition-colors font-medium flex justify-between items-center"
                      >
                        Shop All
                      </Link>
                    </div>
                    {activeCategories.length > 0 ? (
                      <div className="py-2">
                        {activeCategories.map((category) => (
                          <div
                            key={category.reference}
                            className="group/cat relative"
                          >
                            <Link
                              href={`/shop?category=${category.reference}`}
                              className="block px-4 py-2 text-sm text-foreground hover:bg-secondary/5 hover:text-primary transition-colors font-medium flex justify-between items-center"
                            >
                              {category.name}
                            </Link>
                            {/* Subcategories */}
                            {category.subcategories &&
                              category.subcategories.length > 0 && (
                                <div className="pl-4 pb-2 bg-secondary/5">
                                  {category.subcategories
                                    .filter((s) => s.is_active)
                                    .map((sub) => (
                                      <Link
                                        key={sub.reference}
                                        href={`/shop?subcategory=${sub.reference}`}
                                        className="block px-4 py-1.5 text-xs text-foreground/70 hover:text-primary transition-colors"
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-xs text-muted-foreground text-center">
                        No categories found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Added Desktop Links */}
            <Link
              href="/about"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
            >
              Our Story
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
            >
              Contact
            </Link>

            <Link
              href="/orders"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
            >
              Orders
            </Link>
          </div>

          {/* Icons & Mobile Toggle */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* User Dropdown or Login Link (Desktop) */}
            <UserMenu />

            <button
              onClick={() => setIsCartOpen(true)}
              className="text-foreground/80 hover:text-primary transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-foreground focus:outline-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu Overlay & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div
            className="relative z-[100] w-full sm:w-80 p-6 shadow-2xl h-full animate-in slide-in-from-right duration-300"
            style={{ backgroundColor: "#F9F7F2" }}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-serif font-bold text-foreground">
                  Menu
                </span>
                <button
                  className="text-foreground/70 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div className="flex flex-col space-y-6 text-lg">
                <Link
                  href="/"
                  className="text-foreground hover:text-primary transition-colors py-2 border-b border-secondary/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Mobile Shop Section */}
                <div>
                  <button
                    onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                    className="flex w-full items-center justify-between text-foreground font-medium py-2 border-b border-secondary/20 mb-2"
                  >
                    Shop
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMobileShopOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isMobileShopOpen && (
                    <div className="pl-4 flex flex-col space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      {activeCategories.map((category) => (
                        <div key={category.reference}>
                          <Link
                            href={`/shop?category=${category.reference}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base text-foreground/90 font-medium"
                          >
                            {category.name}
                          </Link>
                          {/* Mobile Subcategories */}
                          {category.subcategories &&
                            category.subcategories.length > 0 && (
                              <div className="pl-3 mt-1 flex flex-col space-y-2 border-l border-secondary/20 ml-1">
                                {category.subcategories
                                  .filter((s) => s.is_active)
                                  .map((sub) => (
                                    <Link
                                      key={sub.reference}
                                      href={`/shop?subcategory=${sub.reference}`}
                                      className="text-sm text-foreground/70"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {["Our Story", "Contact", "Orders"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-foreground hover:text-primary transition-colors py-2 border-b border-secondary/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                
                {session ? (
                  <>
                    <Link
                      href="/account"
                      className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-foreground hover:text-red-600 transition-colors py-2 flex items-center gap-2 text-left"
                    >
                      <LogOut className="w-5 h-5" /> Log out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" /> Login / Register
                  </Link>
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-secondary/30">
                <p className="text-xs text-foreground/50 text-center">
                  © 2026 Tule Cereals
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}