import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
} from "recharts";
import { Activity, Factory, Flame, Gauge, Radio, Thermometer } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import { ThermalMap } from "@/components/map/ThermalMap";
import { RadarScanner } from "@/components/common/RadarScanner";
import { ChartContainer, chartTheme } from "@/components/common/ChartContainer";
import { IntelligencePipeline } from "@/components/common/IntelligencePipeline";
import { AnomalyDetailDrawer } from "@/components/anomaly/AnomalyDetailDrawer";
import { EmptyState, ErrorState } from "@/components/common/StatePanels";
import { useAnomalies, useFacilities } from "@/hooks/useThermoData";
import {
  anomalyTimestamp,
  bucketFrp,
  estimateRisk,
  groupBy,
  num,
  HIGH_FRP_THRESHOLD,
} from "@/lib/thermal";
import { useApiState } from "@/components/shell/SystemHealth";
import type { ThermalAnomaly } from "@/types/api";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center — ThermoGuard AI" },
      { name: "description", content: "Live thermal anomaly KPIs, geospatial command map and thermal radar." },
      { property: "og:title", content: "ThermoGuard AI Command Center" },
      { property: "og:description", content: "Thermal anomaly KPIs, command map, radar and risk analytics." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const anomalies = useAnomalies(60_000);
  const facilities = useFacilities();
  const apiState = useApiState();
  const [selected, setSelected] = useState<ThermalAnomaly | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const list = anomalies.data ?? [];

  const stats = useMemo(() => {
    const frps = list.map((a) => num(a.frp) ?? 0);
    const highFrp = frps.filter((f) => f >= HIGH_FRP_THRESHOLD).length;
    const avg = frps.length ? frps.reduce((a, b) => a + b, 0) / frps.length : 0;
    const risks = list.map((a) => estimateRisk(num(a.frp)));
    return {
      total: list.length,
      highRisk: risks.filter((r) => r !== "LOW").length,
      highFrp,
      avg,
      sparkline: frps.slice(-14),
      riskDist: (["LOW", "MEDIUM", "HIGH"] as const).map((level) => ({
        name: level,
        value: risks.filter((r) => r === level).length,
      })),
      overTime: Object.entries(
        list.reduce<Record<string, number>>((acc, a) => {
          const d = a.acq_date ? String(a.acq_date).slice(0, 10) : "Unknown";
          acc[d] = (acc[d] ?? 0) + 1;
          return acc;
        }, {}),
      )
        .filter(([d]) => d !== "Unknown")
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count })),
      satellites: groupBy(list, (a) => String(a.satellite ?? "Unknown")),
      frpBuckets: bucketFrp(list),
    };
  }, [list]);

  const facilityTypes = useMemo(
    () => groupBy(facilities.data ?? [], (f) => String(f.facility_type ?? "Unclassified")).slice(0, 6),
    [facilities.data],
  );

  const onSelect = (a: ThermalAnomaly) => {
    setSelected(a);
    setDrawerOpen(true);
  };

  if (anomalies.isError && facilities.isError) {
    return <ErrorState onRetry={() => void anomalies.refetch()} className="panel" />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">COMMAND CENTER</h1>
        <p className="mono-label mt-1">NASA FIRMS → Satellite → OSM → Correlation → Risk → Response</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Active thermal anomalies" value={stats.total} icon={<Flame className="h-4 w-4" />} accent="thermal" sparkline={stats.sparkline} />
        <KpiCard label="Elevated risk events" value={stats.highRisk} icon={<Gauge className="h-4 w-4" />} accent="alert" footer={<span className="mono-label">Rule-based engine</span>} />
        <KpiCard label="Industrial facilities" value={facilities.data?.length ?? 0} icon={<Factory className="h-4 w-4" />} accent="cyan" />
        <KpiCard label={`High FRP (≥${HIGH_FRP_THRESHOLD} MW)`} value={stats.highFrp} icon={<Thermometer className="h-4 w-4" />} accent="amber" />
        <KpiCard label="Average FRP" value={Number(stats.avg.toFixed(1))} unit="MW" icon={<Activity className="h-4 w-4" />} accent="emerald" />
        <KpiCard
          label="Monitoring status"
          value={apiState === "connected" ? "LIVE" : apiState === "checking" ? "SYNCING" : "API OFFLINE"}
          icon={<Radio className="h-4 w-4" />}
          accent={apiState === "connected" ? "emerald" : "alert"}
          animateValue={false}
          footer={<span className="mono-label">Polling every 60s</span>}
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_320px]">
        <ThermalMap
          className="h-[520px]"
          anomalies={list}
          facilities={facilities.data ?? []}
          selectedId={selected?.id ?? null}
          onSelect={onSelect}
          loading={anomalies.isLoading}
        />
        <RadarScanner
          anomalies={list}
          selected={selected}
          risk={selected ? estimateRisk(num(selected.frp)) : "LOW"}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ChartContainer title="RISK DISTRIBUTION" subtitle="Indicative rule-based classification" question="How is risk spread across the dataset?">
          {stats.total === 0 ? (
            <EmptyState title="No thermal anomalies detected in the current dataset." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={stats.riskDist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {stats.riskDist.map((d) => (
                    <Cell key={d.name} fill={chartTheme.risk[d.name]} stroke="var(--background)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTheme.tooltip} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        <ChartContainer title="THERMAL ACTIVITY" subtitle="Detections per acquisition date" question="When were thermal events observed?">
          {stats.overTime.length < 2 ? (
            <EmptyState title="Awaiting additional historical observations" description="Temporal analysis needs at least two distinct acquisition dates." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stats.overTime}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="date" stroke={chartTheme.axis} fontSize={11} />
                <YAxis stroke={chartTheme.axis} fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Line type="monotone" dataKey="count" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ChartContainer title="SATELLITE ANALYSIS" subtitle="Anomalies by reporting satellite" question="Which platforms are contributing observations?">
          {stats.satellites.length === 0 ? (
            <EmptyState title="No satellite metadata available" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={stats.satellites} dataKey="value" nameKey="name" outerRadius={90}>
                  {stats.satellites.map((d, i) => (
                    <Cell key={d.name} fill={chartTheme.palette[i % chartTheme.palette.length]} stroke="var(--background)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTheme.tooltip} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        <ChartContainer title="INDUSTRIAL CORRELATION" subtitle="Facility types available for proximity analysis" question="What infrastructure surrounds thermal events?">
          {facilityTypes.length === 0 ? (
            <EmptyState title="No industrial infrastructure mapped" description="Synchronize OpenStreetMap to enrich the risk model." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={facilityTypes}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="name" stroke={chartTheme.axis} fontSize={10} interval={0} angle={-15} height={46} textAnchor="end" />
                <YAxis stroke={chartTheme.axis} fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>

      <ChartContainer title="FRP DISTRIBUTION" subtitle="Fire Radiative Power buckets (MW)" question="How intense are the detected thermal signals?">
        {stats.total === 0 ? (
          <EmptyState title="No FRP measurements available" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.frpBuckets}>
              <CartesianGrid stroke={chartTheme.grid} vertical={false} />
              <XAxis dataKey="label" stroke={chartTheme.axis} fontSize={11} />
              <YAxis stroke={chartTheme.axis} fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={chartTheme.tooltip} />
              <Bar dataKey="count" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      <IntelligencePipeline />

      <AnomalyDetailDrawer
        anomaly={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        lastSeen={selected ? anomalyTimestamp(selected) : null}
      />
    </div>
  );
}
