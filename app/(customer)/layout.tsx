"use client";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

import { CartProvider } from "@/context/CartContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
    </CartProvider>
  );
}
