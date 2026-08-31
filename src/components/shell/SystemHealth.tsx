import { Database, Globe2, Server } from "lucide-react";
import { useSystemHealth } from "@/hooks/useThermoData";
import { API_BASE_URL } from "@/services/api";
import { cn } from "@/lib/utils";

type State = "connected" | "checking" | "offline";

function stateOf(q: { isLoading: boolean; isError: boolean }): State {
  if (q.isLoading) return "checking";
  return q.isError ? "offline" : "connected";
}

const DOT: Record<State, string> = {
  connected: "bg-emerald shadow-[0_0_8px_var(--emerald)]",
  checking: "bg-amber animate-pulse",
  offline: "bg-alert shadow-[0_0_8px_var(--alert)]",
};

const TEXT: Record<State, string> = {
  connected: "text-emerald",
  checking: "text-amber",
  offline: "text-alert",
};

const LABEL: Record<State, string> = {
  connected: "CONNECTED",
  checking: "CHECKING",
  offline: "OFFLINE",
};

export function useApiState(): State {
  const { api } = useSystemHealth();
  return stateOf(api);
}

export function SystemHealthPanel({ compact = false }: { compact?: boolean }) {
  const { api, db, osm } = useSystemHealth();
  const rows = [
    { label: "API", icon: Server, state: stateOf(api) },
    { label: "DATABASE", icon: Database, state: stateOf(db) },
    { label: "OSM", icon: Globe2, state: stateOf(osm) },
  ];

  return (
    <div className={cn("space-y-2", compact ? "" : "panel p-4")}>
      {!compact && (
        <div className="mb-3">
          <h2 className="font-display text-sm font-semibold">SYSTEM HEALTH</h2>
          <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">{API_BASE_URL}</p>
        </div>
      )}
      {rows.map((r) => {
        const Icon = r.icon;
        return (
          <div
            key={r.label}
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-2/40 px-3 py-2"
          >
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
              {r.label}
            </span>
            <span className={cn("flex items-center gap-2 font-mono text-[11px]", TEXT[r.state])}>
              <span className={cn("h-1.5 w-1.5 rounded-full", DOT[r.state])} />
              {LABEL[r.state]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
