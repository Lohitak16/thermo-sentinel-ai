import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, chartTheme } from "@/components/common/ChartContainer";
import { EmptyState, ErrorState } from "@/components/common/StatePanels";
import { useAnomalies, useFacilities } from "@/hooks/useThermoData";
import { bucketFrp, estimateRisk, groupBy, num } from "@/lib/thermal";

export const Route = createFileRoute("/_shell/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — ThermoGuard AI" },
      { name: "description", content: "Thermal intensity distribution, risk mix and industrial correlation analytics." },
      { property: "og:title", content: "Analytics — ThermoGuard AI" },
      { property: "og:description", content: "Charts covering FRP distribution, risk mix and facility types." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const anomalies = useAnomalies();
  const facilities = useFacilities();
  const list = anomalies.data ?? [];
  const riskDist = (["LOW", "MEDIUM", "HIGH"] as const).map((level) => ({
    name: level,
    value: list.filter((a) => estimateRisk(num(a.frp)) === level).length,
  }));
  const facilityTypes = groupBy(facilities.data ?? [], (f) => String(f.facility_type ?? "Unclassified")).slice(0, 8);

  if (anomalies.isError && facilities.isError) {
    return <ErrorState onRetry={() => void anomalies.refetch()} className="panel" />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">ANALYTICS</h1>
        <p className="mono-label mt-1">Derived entirely from live backend records</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ChartContainer title="FRP DISTRIBUTION" subtitle="Fire Radiative Power (MW)" question="How intense are detected signals?">
          {list.length === 0 ? (
            <EmptyState title="No thermal events available" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bucketFrp(list)}>
                <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="label" stroke={chartTheme.axis} fontSize={11} />
                <YAxis stroke={chartTheme.axis} fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        <ChartContainer title="RISK MIX" subtitle="Rule-based estimate" question="What share of events need attention?">
          {list.length === 0 ? (
            <EmptyState title="No thermal events available" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={riskDist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {riskDist.map((d) => (
                    <Cell key={d.name} fill={chartTheme.risk[d.name]} stroke="var(--background)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTheme.tooltip} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>

      <ChartContainer title="INDUSTRIAL CONTEXT" subtitle="Facility types available for correlation" question="What infrastructure is mapped?">
        {facilityTypes.length === 0 ? (
          <EmptyState title="No industrial facilities stored" description="Synchronize OpenStreetMap to enable correlation." />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facilityTypes}>
              <CartesianGrid stroke={chartTheme.grid} vertical={false} />
              <XAxis dataKey="name" stroke={chartTheme.axis} fontSize={10} angle={-15} height={48} textAnchor="end" interval={0} />
              <YAxis stroke={chartTheme.axis} fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={chartTheme.tooltip} />
              <Bar dataKey="value" fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>
    </div>
  );
}
