"use client";

import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/store";
import {
  BarChart3,
  Home,
  Megaphone,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
};

function useOrderBadge(): number | undefined {
  const hasHydrated = useDashboardStore((s) => s.hasHydrated);
  const orders = useDashboardStore((s) => s.orders);
  if (!hasHydrated) return undefined;
  return orders.length > 0 ? orders.length : undefined;
}

const DISABLED_ITEMS: { label: string; icon: React.ElementType }[] = [
  { label: "Crecimiento", icon: Megaphone },
  { label: "Descuentos", icon: Percent },
];

export function AppSidebar() {
  const pathname = usePathname();
  const ordersBadge = useOrderBadge();

  const items: NavItem[] = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/orders", label: "Pedidos", icon: ShoppingBag, badge: ordersBadge },
    { href: "/products", label: "Productos", icon: Package },
    { href: "/customers", label: "Clientes", icon: Users },
    { href: "/reports", label: "Informes y estadísticas", icon: BarChart3 },
  ];

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.badge ? (
                <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-md bg-muted px-1.5 text-xs font-semibold text-muted-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}

        <div className="my-2 border-t" />

        {DISABLED_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              title="Próximamente"
              className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/35"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Configuración del día
        </Link>
      </div>
    </aside>
  );
}
