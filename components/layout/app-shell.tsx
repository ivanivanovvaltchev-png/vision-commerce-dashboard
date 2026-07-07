"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export function AppShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppTopbar userEmail={userEmail} onOpenMobileNav={() => setMobileNavOpen(true)} />
      <div className="flex flex-1">
        <AppSidebar mobileOpen={mobileNavOpen} onMobileOpenChange={setMobileNavOpen} />
        <main className="min-w-0 flex-1 overflow-x-hidden bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
