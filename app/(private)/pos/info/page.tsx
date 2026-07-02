"use client";

import React from "react";
import { ArrowLeft, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/dashboard/SectionHeader";

export default function POSInfoPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <Link
          href="/pos/register"
          className="inline-flex items-center gap-2 text-sm text-[#f1a604] hover:underline mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to POS Register
        </Link>
        
        <SectionHeader
          title="How to use the POS Register"
          description="A quick guide to processing in-store sales."
        />

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-[#D2D2D7]/60 p-6 md:p-8 space-y-8 max-w-4xl">
          <section>
            <h2 className="text-xl font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              1. Ringing up items
            </h2>
            <p className="text-[#6E6E73] leading-relaxed">
              Use the search bar on the left to quickly find products by name or SKU. Click on any product card to add it to the cart. If a product has variants (like different sizes or colors), make sure to select the correct variant from the grid. You can adjust the quantity of items directly in the cart using the + and - buttons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              2. Processing Payment
            </h2>
            <p className="text-[#6E6E73] leading-relaxed mb-4">
              Select the payment method used by the customer:
            </p>
            <ul className="list-disc list-inside text-[#6E6E73] space-y-2 ml-2">
              <li><strong>Cash:</strong> Standard physical cash transaction.</li>
              <li><strong>M-Pesa:</strong> If the customer pays via M-Pesa, you must enter the 10-character M-Pesa reference code to verify the transaction.</li>
              <li><strong>Card:</strong> For PDQ / Card machine payments.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1D1D1F] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              3. Completing the Sale
            </h2>
            <p className="text-[#6E6E73] leading-relaxed">
              Customer details (Name, Phone, Notes) are optional but recommended for building a customer database and tracking special requests. Once you hit <strong>Complete Sale</strong>, the transaction is logged, and the stock is automatically deducted from your inventory.
            </p>
          </section>

          <section className="bg-amber-50 border border-amber-200 p-4 rounded-xl mt-8">
            <h3 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Important Notes on Inventory
            </h3>
            <p className="text-sm text-amber-700">
              The POS will not allow you to sell items that are out of stock. If you physically have the item but it shows as out of stock, please update your inventory levels first in the <strong>Inventory</strong> tab. Voiding a sale will automatically return the items to your stock.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
