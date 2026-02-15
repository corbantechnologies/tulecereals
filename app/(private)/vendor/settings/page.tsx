"use client";

import React, { useState } from "react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { User, Phone, Mail, MapPin, Shield, Edit } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import VendorModal from "@/components/vendor/Modal";
import UpdateAccountForm from "@/forms/account/UpdateAccount";

export default function VendorSettings() {
  const {
    data: vendor,
    isLoading,
    refetch: refetchAccount,
  } = useFetchAccount();
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] =
    useState(false);

  const profileFields = [
    {
      label: "Full Name",
      value: `${vendor?.first_name || ""} ${vendor?.last_name || ""}`,
      icon: User,
    },
    {
      label: "Email Address",
      value: vendor?.email,
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: vendor?.phone_number || "Not provided",
      icon: Phone,
    },
    {
      label: "Location",
      value:
        `${vendor?.town || ""}, ${vendor?.county || ""}, ${vendor?.country || ""}`
          .replace(/^, /, "")
          .replace(/, $/, "")
          .replace(/^,/, "") || "Not specified",
      icon: MapPin,
    },
    {
      label: "Account Role",
      value: vendor?.is_superuser ? "Super Administrator" : "Vendor",
      icon: Shield,
    },
    {
      label: "Vendor Code",
      value: vendor?.usercode,
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="Account Settings"
        description="View and manage your personal account details."
      />

      <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-secondary/20 bg-secondary/5 flex justify-between items-center">
          <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Profile
          </h3>
          <button
            onClick={() => setIsUpdateAccountModalOpen(true)}
            className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            <Edit className="w-3 h-3" />
            Edit Profile
          </button>
        </div>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {profileFields.map((field, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-secondary/5 transition-colors border border-transparent hover:border-secondary/10"
              >
                <div className="p-2 bg-primary/10 rounded-md text-primary mt-0.5">
                  <field.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-medium mb-1">
                    {field.label}
                  </p>
                  {isLoading ? (
                    <div className="h-5 w-3/4 bg-secondary/10 animate-pulse rounded-sm" />
                  ) : (
                    <p className="text-foreground font-medium text-sm sm:text-base break-words">
                      {field.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VendorModal
        isOpen={isUpdateAccountModalOpen}
        onClose={() => setIsUpdateAccountModalOpen(false)}
        title="Update Profile Details"
        maxWidth="max-w-2xl"
      >
        <UpdateAccountForm
          onSuccess={() => {
            setIsUpdateAccountModalOpen(false);
            refetchAccount();
          }}
        />
      </VendorModal>
    </div>
  );
}
