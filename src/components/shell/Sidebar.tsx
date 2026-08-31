import { Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { ThermoLogo } from "@/components/brand/ThermoLogo";
import { SystemHealthPanel } from "./SystemHealth";
import { NAV_ITEMS } from "./navigation";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-sidebar-border px-4 py-4">
        <Link to="/" aria-label="ThermoGuard AI home">
          <ThermoLogo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{
                className:
                  "border-primary/50 bg-primary/10 text-foreground shadow-[inset_2px_0_0_0_var(--primary)]",
              }}
              inactiveProps={{ className: "border-transparent text-muted-foreground hover:bg-sidebar-accent/60" }}
              className={cn(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-3">
        <SystemHealthPanel compact />
        <p className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <Radio className="h-3 w-3 text-primary" />
          NASA FIRMS · OSM · SATELLITE
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-[248px] shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
      <div className="sticky top-0 h-screen">
        <SidebarNav />
      </div>
    </aside>
  );
}
