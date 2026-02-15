"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFetchProductsVendor } from "@/hooks/products/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { SkeletonRow } from "@/components/dashboard/DashboardSkeletons";
import { formatDate } from "@/components/dashboard/utils";
import VendorModal from "@/components/vendor/Modal";
import { CreateProduct } from "@/forms/products/CreateProduct";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  MoreHorizontal,
} from "lucide-react";

export default function ProductsPage() {
  const { data: vendor } = useFetchAccount();
  const { data: products, isLoading, refetch } = useFetchProductsVendor();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter products
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? product.is_active
          : !product.is_active;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8">
          <div className="flex-1">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary mb-2 block font-medium">
              Product Management
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-tight">
              Products
            </h1>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border border-secondary/30 rounded-sm p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-secondary rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-foreground/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-secondary rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/5 border-b border-secondary/20">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary w-20">
                    Image
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                    Product Details
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-serif text-primary text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => <SkeletonRow key={i} />)
                ) : filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.reference}
                      className="hover:bg-secondary/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="h-12 w-12 rounded-sm bg-secondary/10 border border-secondary/20 overflow-hidden flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-foreground/20" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {product.name}
                          </p>
                          <p className="text-[10px] font-mono text-foreground/40 mt-0.5">
                            {product.product_code}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {product.total_stock} units
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${
                            product.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-foreground/50 hidden md:table-cell">
                        {formatDate(product.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/vendor/products/${product.reference}`}
                            className="p-1 px-3 text-xs md:text-sm text-foreground/50 hover:text-primary transition-colors border border-secondary/20 rounded-sm hover:border-primary/30 flex items-center"
                            title="Manage Product"
                          >
                            Manage
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-foreground/40 italic"
                    >
                      No products found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <VendorModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Product"
        >
          <CreateProduct
            onSuccess={() => {
              setIsCreateModalOpen(false);
              refetch();
            }}
          />
        </VendorModal>
      </div>
    </div>
  );
}
