import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Factory, Flame, Satellite, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { NAV_ITEMS } from "./navigation";
import { useAnomalies, useFacilities } from "@/hooks/useThermoData";
import { coord } from "@/lib/thermal";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const anomalies = useAnomalies();
  const facilities = useFacilities();

  const anomalyResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = anomalies.data ?? [];
    if (!q) return list.slice(0, 5);
    return list
      .filter((a) =>
        [String(a.id), String(a.latitude), String(a.longitude), String(a.satellite ?? "")]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [anomalies.data, query]);

  const facilityResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = facilities.data ?? [];
    if (!q) return [];
    return list
      .filter((f) => `${f.name ?? ""} ${f.facility_type ?? ""}`.toLowerCase().includes(q))
      .slice(0, 5);
  }, [facilities.data, query]);

  const go = (to: string) => {
    onOpenChange(false);
    void navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search events, coordinates, facilities, satellites…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No matching intelligence records.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem key={item.to} value={`go ${item.label}`} onSelect={() => go(item.to)}>
                <Icon className="mr-2 h-4 w-4" />
                Go to {item.label}
              </CommandItem>
            );
          })}
          <CommandItem value="system health" onSelect={() => go("/settings")}>
            <Search className="mr-2 h-4 w-4" /> System Health
          </CommandItem>
        </CommandGroup>

        {anomalyResults.length > 0 && (
          <CommandGroup heading="Thermal events">
            {anomalyResults.map((a) => (
              <CommandItem
                key={`a-${a.id}`}
                value={`anomaly ${a.id} ${a.latitude} ${a.longitude} ${a.satellite ?? ""}`}
                onSelect={() => go(`/anomalies/${a.id}`)}
              >
                <Flame className="mr-2 h-4 w-4 text-thermal" />
                <span className="font-mono text-xs">
                  #{String(a.id)} · {coord(a.latitude, a.longitude)}
                </span>
                <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Satellite className="h-3 w-3" />
                  {a.satellite ?? "—"}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {facilityResults.length > 0 && (
          <CommandGroup heading="Industrial facilities">
            {facilityResults.map((f) => (
              <CommandItem
                key={`f-${f.id}`}
                value={`facility ${f.name ?? ""} ${f.facility_type ?? ""}`}
                onSelect={() => go("/industrial-facilities")}
              >
                <Factory className="mr-2 h-4 w-4 text-cyan" />
                <span className="truncate text-xs">{f.name || "Unnamed facility"}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">{f.facility_type ?? "—"}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}
