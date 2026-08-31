import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { CommandPalette, useCommandPalette } from "@/components/shell/CommandPalette";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

function ShellLayout() {
  const { open, setOpen } = useCommandPalette();
  const [presentation, setPresentation] = useState(false);

  return (
    <div className="space-bg flex min-h-screen">
      {!presentation && <Sidebar />}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onOpenPalette={() => setOpen(true)}
          onTogglePresentation={() => setPresentation((v) => !v)}
          presentation={presentation}
        />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cn("flex-1 p-3 md:p-5", presentation && "text-[1.05rem]")}
          data-presentation={presentation || undefined}
        >
          <Outlet />
        </motion.main>
        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground">
          <p className="font-display text-sm font-semibold text-foreground">ThermoGuard AI</p>
          <p className="mt-1 max-w-3xl">
            AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources Using NASA
            FIRMS, OSM &amp; Satellite Data.
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider">
            Data sources: NASA FIRMS · OpenStreetMap contributors · Satellite observations
          </p>
        </footer>
      </div>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </div>
  );
}
