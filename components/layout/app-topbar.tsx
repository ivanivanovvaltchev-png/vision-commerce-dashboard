"use client";

import { useDashboardStore } from "@/lib/store";
import { BarChart3, Bell, Menu, Search } from "lucide-react";

function getInitials(email: string): string {
  const localPart = email.split("@")[0] ?? "";
  return localPart.slice(0, 2).toUpperCase() || "VC";
}

export function AppTopbar({
  userEmail,
  onOpenMobileNav,
}: {
  userEmail: string;
  onOpenMobileNav: () => void;
}) {
  const hasHydrated = useDashboardStore((s) => s.hasHydrated);
  const orders = useDashboardStore((s) => s.orders);
  const hasPendingOrders = hasHydrated && orders.some((o) => o.status === "Processing");

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 bg-[#0d0d0f] px-2 text-white sm:gap-4 sm:px-4">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2a78d6]">
          <BarChart3 className="h-4 w-4 text-white" />
        </div>
        <span className="hidden text-sm font-semibold tracking-tight sm:inline">
          Vision Commerce
        </span>
      </div>

      <div className="flex min-w-0 flex-1 items-center md:justify-center">
        <div className="hidden w-full max-w-xl items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white/70 md:flex">
          <Search className="h-4 w-4" />
          <span className="flex-1">Buscar</span>
          <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          {hasPendingOrders && (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e34948]" />
          )}
        </button>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1baf7a] text-xs font-semibold">
          {getInitials(userEmail)}
        </div>
      </div>
    </header>
  );
}
