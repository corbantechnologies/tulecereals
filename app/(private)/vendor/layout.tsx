"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import VendorNavbar from "@/components/vendor/Navbar";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { Loader2 } from "lucide-react";
import ProfileOnboarding from "@/components/vendor/ProfileOnboarding";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { data: vendor, isLoading, isError } = useFetchAccount();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !isLoading && vendor) {
      if (!vendor.is_vendor && !vendor.is_superuser) {
        // If loaded and NOT a vendor, redirect or show message.
        // Redirecting to login might be confusing if they are logged in as a customer.
        // But per requirements, they shouldn't be here.
        router.push("/login");
      }
    }
  }, [status, vendor, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Unable to load account</h2>
        <p className="text-muted-foreground mb-4">
          Please try refreshing the page or logging in again.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-sm"
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (!vendor?.is_vendor && !vendor?.is_superuser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <VendorNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileOnboarding vendorShop={vendor.shop} />
        {children}
      </main>
    </div>
  );
}
