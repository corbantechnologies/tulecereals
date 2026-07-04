"use client";

import React from "react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import POSTillsSection from "@/components/vendor/pos/settings/POSTillsSection";
import POSStaffSection from "@/components/vendor/pos/settings/POSStaffSection";
import POSConfigSection from "@/components/vendor/pos/settings/POSConfigSection";
import { useFetchAccount } from "@/hooks/accounts/actions";

export default function POSSettingsPage() {
  const { data: vendor, isLoading } = useFetchAccount();

  if (isLoading) {
    return <div className="p-8">Loading settings...</div>;
  }

  if (!vendor?.is_vendor && !vendor?.is_superuser) {
    return <div className="p-8">You do not have permission to view this page.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="Point of Sale Settings"
        description="Manage your POS registers, cashier staff, and general POS configuration."
      />
      <POSConfigSection />
      <POSTillsSection />
      <POSStaffSection />
    </div>
  );
}