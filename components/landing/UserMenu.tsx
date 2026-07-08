"use client";

import Link from "next/link";
import { User, LogOut, ShoppingBag, Package, Store, Monitor } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useFetchAccount } from "@/hooks/accounts/actions";

export default function UserMenu() {
  const { data: session } = useSession();
  const { data: user } = useFetchAccount();

  if (!session) {
    return (
      <Link
        href="/login"
        className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-[#e38800] hover:text-[#ed7e00] transition-colors"
      >
        <User className="w-4 h-4" />
        Login
      </Link>
    );
  }

  const displayName = user?.first_name || user?.usercode || "Account";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="hidden md:flex items-center gap-2 text-[#1D1D1F] hover:text-[#e38800] transition-colors outline-none rounded-full">
          <div className="w-7 h-7 rounded-full bg-[#e38800] text-white text-xs font-bold flex items-center justify-center">
            {initials}
          </div>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[220px] bg-white border border-[#D2D2D7] rounded-2xl p-1.5 shadow-2xl shadow-black/10 animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          sideOffset={10}
          align="end"
        >
          {/* User info header */}
          <div className="px-3 py-3 mb-1 border-b border-[#F5F5F7]">
            <p className="text-sm font-semibold text-[#1D1D1F]">{displayName}</p>
            <p className="text-xs text-[#86868B] mt-0.5 truncate">{user?.email || ""}</p>
          </div>

          <DropdownMenu.Item asChild className="outline-none">
            <Link
              href="/account"
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl cursor-pointer transition-colors"
            >
              <User className="w-4 h-4 text-[#6E6E73]" />
              My Profile
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild className="outline-none">
            <Link
              href="/orders"
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl cursor-pointer transition-colors"
            >
              <Package className="w-4 h-4 text-[#6E6E73]" />
              My Orders
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild className="outline-none">
            <Link
              href="/cart"
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#6E6E73]" />
              Cart
            </Link>
          </DropdownMenu.Item>

          {user?.is_vendor && (
            <DropdownMenu.Item asChild className="outline-none">
              <Link
                href="/vendor/dashboard"
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl cursor-pointer transition-colors"
              >
                <Store className="w-4 h-4 text-[#6E6E73]" />
                Vendor Dashboard
              </Link>
            </DropdownMenu.Item>
          )}

          {user?.is_pos_staff && (
            <DropdownMenu.Item asChild className="outline-none">
              <Link
                href="/pos/register"
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl cursor-pointer transition-colors"
              >
                <Monitor className="w-4 h-4 text-[#6E6E73]" />
                POS Register
              </Link>
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Separator className="h-px bg-[#F5F5F7] my-1.5" />

          <DropdownMenu.Item
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors outline-none"
            onSelect={() => signOut()}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
