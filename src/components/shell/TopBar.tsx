import { Link } from "@tanstack/react-router";
import { Menu, MonitorPlay, Search, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThermoLogo } from "@/components/brand/ThermoLogo";
import { NotificationCenter } from "./NotificationCenter";
import { SidebarNav } from "./Sidebar";
import { useApiState } from "./SystemHealth";
import { cn } from "@/lib/utils";

export function TopBar({
  onOpenPalette,
  onTogglePresentation,
  presentation,
}: {
  onOpenPalette: () => void;
  onTogglePresentation: () => void;
  presentation: boolean;
}) {
  const apiState = useApiState();
  const online = apiState === "connected";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-xl">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] border-border bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <Link to="/" className="lg:hidden">
        <ThermoLogo size={26} showText={false} />
      </Link>

      <div className="hidden items-center gap-2 md:flex">
        <span className="mono-label">Region</span>
        <span className="rounded-md border border-border bg-surface-2/50 px-2 py-1 font-mono text-[11px] text-foreground">
          INDIA · SOUTH ASIA
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenPalette}
        className="ml-auto flex h-8 items-center gap-2 rounded-md border border-border bg-surface-2/50 px-2.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:w-64"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search intelligence…</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <span
        className={cn(
          "hidden items-center gap-2 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider sm:flex",
          online ? "border-emerald/40 bg-emerald/10 text-emerald" : "border-alert/40 bg-alert/10 text-alert",
        )}
        aria-live="polite"
      >
        <span className={cn("h-1.5 w-1.5 rounded-full bg-current", online && "animate-pulse")} />
        {online ? "LIVE" : "API OFFLINE"}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", presentation && "text-primary")}
        onClick={onTogglePresentation}
        aria-label="Toggle presentation mode"
        title="Presentation mode"
      >
        <MonitorPlay className="h-4 w-4" />
      </Button>

      <NotificationCenter />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Operator menu">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-mono text-[11px]">
            OPERATOR · SIH DEMO
            <span className="mt-1 block text-[10px] font-normal text-muted-foreground">
              Read/write access to intelligence records
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <ShieldCheck className="mr-2 h-4 w-4" /> System health &amp; settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
