import { createFileRoute } from "@tanstack/react-router";
import { SystemHealthPanel } from "@/components/shell/SystemHealth";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "System Health & Settings — ThermoGuard AI" },
      { name: "description", content: "Backend connectivity, data source attribution and platform information." },
      { property: "og:title", content: "System Health — ThermoGuard AI" },
      { property: "og:description", content: "Monitor API, database and OpenStreetMap connectivity." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">SYSTEM HEALTH &amp; SETTINGS</h1>
        <p className="mono-label mt-1">Live connectivity checks against the intelligence backend</p>
      </div>

      <SystemHealthPanel />

      <section className="panel p-5 text-sm text-muted-foreground">
        <h2 className="font-display text-sm font-semibold text-foreground">Data sources &amp; attribution</h2>
        <ul className="mt-3 space-y-2">
          <li>NASA FIRMS — thermal anomaly observations (brightness, FRP, confidence).</li>
          <li>OpenStreetMap contributors — industrial facility geometry and classification.</li>
          <li>Satellite observations — acquisition platform metadata.</li>
        </ul>
        <p className="mt-4 text-xs">
          Risk levels are produced by a transparent rule-based engine using FRP and industrial proximity. AI
          classification of fire type is not connected yet and no predictions are simulated.
        </p>
      </section>
    </div>
  );
}
