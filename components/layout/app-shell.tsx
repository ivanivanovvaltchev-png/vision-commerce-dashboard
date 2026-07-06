import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export function AppShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppTopbar userEmail={userEmail} />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
