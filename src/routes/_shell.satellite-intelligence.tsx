import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, chartTheme } from "@/components/common/ChartContainer";
import { EmptyState, ErrorState } from "@/components/common/StatePanels";
import { useAnomalies } from "@/hooks/useThermoData";
import { confidenceBand, groupBy } from "@/lib/thermal";

export const Route = createFileRoute("/_shell/satellite-intelligence")({
  head: () => ({
    meta: [
      { title: "Satellite Intelligence — ThermoGuard AI" },
      { name: "description", content: "Observation quality and platform breakdown for NASA FIRMS thermal detections." },
      { property: "og:title", content: "Satellite Intelligence — ThermoGuard AI" },
      { property: "og:description", content: "Satellite platform and confidence analysis of thermal observations." },
    ],
  }),
  component: SatelliteIntelligence,
});

function SatelliteIntelligence() {
  const anomalies = useAnomalies();
  const list = anomalies.data ?? [];
  const bySat = groupBy(list, (a) => String(a.satellite ?? "Unknown"));
  const byConfidence = groupBy(list, (a) => confidenceBand(a.confidence));

  if (anomalies.isError) return <ErrorState onRetry={() => void anomalies.refetch()} className="panel" />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">SATELLITE INTELLIGENCE</h1>
        <p className="mono-label mt-1">Observation platforms and detection confidence</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ChartContainer title="DETECTIONS BY PLATFORM" question="Which satellites are observing these events?">
          {bySat.length === 0 ? (
            <EmptyState title="No satellite metadata available" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bySat}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="name" stroke={chartTheme.axis} fontSize={11} />
                <YAxis stroke={chartTheme.axis} fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        <ChartContainer title="DETECTION CONFIDENCE" question="How reliable are these observations?">
          {byConfidence.length === 0 ? (
            <EmptyState title="No confidence values reported" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byConfidence}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="name" stroke={chartTheme.axis} fontSize={11} />
                <YAxis stroke={chartTheme.axis} fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="value" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>
    </div>
  );
}
