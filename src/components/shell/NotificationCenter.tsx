import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Factory, Flame, RefreshCw, ShieldAlert } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAnomalies, useFacilities } from "@/hooks/useThermoData";
import { anomalyTimestamp, coord, estimateRisk, fmt, num } from "@/lib/thermal";
import { EmptyState } from "@/components/common/StatePanels";

/** Notifications are derived only from real backend records — never fabricated. */
export function NotificationCenter() {
  const anomalies = useAnomalies();
  const facilities = useFacilities();

  const items = useMemo(() => {
    const list = anomalies.data ?? [];
    const sorted = [...list].sort((a, b) => (anomalyTimestamp(b) ?? 0) - (anomalyTimestamp(a) ?? 0));
    const high = sorted.filter((a) => estimateRisk(num(a.frp)) !== "LOW").slice(0, 4);
    const latest = sorted.slice(0, 3);

    const notes = [
      ...high.map((a) => ({
        id: `high-${a.id}`,
        icon: ShieldAlert,
        tone: "text-alert",
        title: "ELEVATED THERMAL EVENT",
        body: `Event #${a.id} · FRP ${fmt(a.frp, 1)} MW · ${coord(a.latitude, a.longitude)}`,
        to: `/anomalies/${a.id}`,
      })),
      ...latest.map((a) => ({
        id: `new-${a.id}`,
        icon: Flame,
        tone: "text-thermal",
        title: "THERMAL ANOMALY RECORD",
        body: `Event #${a.id} · ${a.satellite ?? "satellite n/a"} · ${a.acq_date ?? "date n/a"}`,
        to: `/anomalies/${a.id}`,
      })),
    ];

    if ((facilities.data?.length ?? 0) > 0) {
      notes.push({
        id: "facilities",
        icon: Factory,
        tone: "text-cyan",
        title: "INDUSTRIAL CONTEXT AVAILABLE",
        body: `${facilities.data?.length} industrial facilities loaded for proximity analysis`,
        to: "/industrial-facilities",
      });
    }
    return notes.slice(0, 8);
  }, [anomalies.data, facilities.data]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {items.length > 0 && (
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-thermal shadow-[0_0_6px_var(--thermal)]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="mono-label">Notification centre</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => void anomalies.refetch()}
            aria-label="Refresh notifications"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        <div className="max-h-[340px] overflow-y-auto">
          {anomalies.isError ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Notifications unavailable while the intelligence server is offline.
            </p>
          ) : items.length === 0 ? (
            <EmptyState title="No alerts" description="Notifications appear when the backend reports thermal events." />
          ) : (
            <AnimatePresence initial={false}>
              {items.map((n, i) => {
                const Icon = n.icon;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={n.to}
                      className="flex gap-3 border-b border-border px-3 py-2.5 transition-colors hover:bg-surface-2/60"
                    >
                      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${n.tone}`} />
                      <span className="min-w-0">
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-foreground">
                          {n.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{n.body}</span>
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
