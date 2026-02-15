"use client";

import React from "react";
import VendorModal from "@/components/vendor/Modal";
import UpdateShopForm from "@/forms/shop/UpdateShop";
import { Shop } from "@/services/shops";
import { useFetchAccount } from "@/hooks/accounts/actions";

interface ProfileOnboardingProps {
  vendorShop: Shop | null;
}

export default function ProfileOnboarding({
  vendorShop,
}: ProfileOnboardingProps) {
  const { refetch: refetchAccount } = useFetchAccount();

  if (!vendorShop) return null;

  // Define required fields
  const requiredFields = [
    vendorShop.country,
    vendorShop.city,
    vendorShop.address,
    vendorShop.return_policy,
    vendorShop.shipping_policy,
    vendorShop.refund_policy,
  ];

  // Check if any required field is missing (null or empty string)
  const isProfileIncomplete = requiredFields.some(
    (field) => !field || field.trim() === "",
  );

  if (!isProfileIncomplete) return null;

  return (
    <VendorModal
      isOpen={true} // Always open if incomplete
      onClose={() => {
        // Prevent closing
      }}
      title="Complete Your Shop Profile"
      maxWidth="max-w-2xl"
    >
      <div className="mb-4 text-sm text-muted-foreground p-3 bg-yellow-50 text-yellow-800 rounded-sm border border-yellow-200">
        <p>
          <strong>Action Required:</strong> Please complete your shop&apos;s
          address and policy information to proceed to the dashboard.
        </p>
      </div>
      <UpdateShopForm
        onSuccess={() => {
          refetchAccount();
        }}
      />
    </VendorModal>
  );
}
