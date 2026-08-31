import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BarChart3, BrainCircuit, Flame, Globe2, Map as MapIcon, Radio, Rocket, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThermoLogo } from "@/components/brand/ThermoLogo";
import { IntelligencePipeline } from "@/components/common/IntelligencePipeline";
import { useAnomalies, useFacilities } from "@/hooks/useThermoData";
import { useCountUp } from "@/hooks/useCountUp";
import { estimateRisk, fmt, num } from "@/lib/thermal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThermoGuard AI — Industrial Fire & Thermal Source Intelligence" },
      {
        name: "description",
        content:
          "ThermoGuard AI detects, classifies and assesses industrial fires and persistent thermal sources using NASA FIRMS, OpenStreetMap and satellite observations.",
      },
      { property: "og:title", content: "ThermoGuard AI — Industrial Fire Intelligence Platform" },
      {
        property: "og:description",
        content:
          "Geospatial fire-monitoring command center combining NASA FIRMS thermal anomalies, OSM industrial context and rule-based risk assessment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const anomalies = useAnomalies();
  const facilities = useFacilities();
  const list = anomalies.data ?? [];
  const high = list.filter((a) => estimateRisk(num(a.frp)) === "HIGH").length;
  const avgFrp = list.length
    ? list.reduce((s, a) => s + (num(a.frp) ?? 0), 0) / list.length
    : 0;

  return (
    <div className="space-bg min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <ThermoLogo />
        <nav className="flex items-center gap-2" aria-label="Primary">
          <Button asChild variant="ghost" size="sm">
            <Link to="/analytics">Analytics</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/dashboard">Command Center</Link>
          </Button>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <EarthBackdrop />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 md:pt-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="max-w-3xl"
          >
            <Reveal>
              <span className="mono-label inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1">
                <Radio className="h-3 w-3 text-primary" /> Smart India Hackathon · Earth Observation Intelligence
              </span>
            </Reveal>
            <Reveal>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                THERMOGUARD <span className="text-gradient-thermal">AI</span>
              </h1>
            </Reveal>
            <Reveal>
              <p className="mt-4 text-lg text-foreground/90 md:text-xl">
                AI-Powered Industrial Fire &amp; Persistent Thermal Source Intelligence
              </p>
            </Reveal>
            <Reveal>
              <p className="mono-label mt-3 text-primary">Detect. Classify. Locate. Assess. Respond.</p>
            </Reveal>
            <Reveal>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                ThermoGuard AI fuses NASA FIRMS thermal anomaly observations with OpenStreetMap industrial
                infrastructure and geospatial proximity analysis to distinguish industrial fires and persistent
                thermal sources — and to get that intelligence to responders faster.
              </p>
            </Reveal>
            <Reveal>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/dashboard">
                    <Rocket className="mr-2 h-4 w-4" /> Launch Command Center
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/live-monitor">
                    <MapIcon className="mr-2 h-4 w-4" /> Explore Thermal Map
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link to="/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
                  </Link>
                </Button>
              </div>
            </Reveal>
          </motion.div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <HeroStat label="Thermal anomalies" value={list.length} icon={<Flame className="h-4 w-4" />} loading={anomalies.isLoading} error={anomalies.isError} />
            <HeroStat label="High-risk events" value={high} icon={<Satellite className="h-4 w-4" />} loading={anomalies.isLoading} error={anomalies.isError} />
            <HeroStat label="Industrial facilities" value={facilities.data?.length ?? 0} icon={<Globe2 className="h-4 w-4" />} loading={facilities.isLoading} error={facilities.isError} />
            <HeroStat label="Average FRP (MW)" value={Number(fmt(avgFrp, 1, "0"))} icon={<BrainCircuit className="h-4 w-4" />} loading={anomalies.isLoading} error={anomalies.isError} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <IntelligencePipeline />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="panel p-6">
          <h2 className="font-display text-lg font-semibold">About the Intelligence</h2>
          <div className="mt-4 grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <p>
              <strong className="text-foreground">NASA FIRMS</strong> provides thermal anomaly observations derived
              from satellite instruments, including brightness temperature and Fire Radiative Power (FRP).
            </p>
            <p>
              <strong className="text-foreground">OpenStreetMap</strong> contributes industrial facility context so
              thermal events can be interpreted against known infrastructure.
            </p>
            <p>
              <strong className="text-foreground">Geospatial proximity</strong> associates each thermal event with
              nearby industrial facilities; the current risk engine is a transparent rule-based assessment combining
              FRP with that proximity.
            </p>
            <p>
              <strong className="text-foreground">AI classification</strong> is the next stage of the pipeline: it
              will distinguish industrial fires and persistent thermal sources from agricultural burns and natural
              thermal events. The inference API is not connected yet, and no predictions are simulated.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8">
        <div className="mx-auto max-w-7xl">
          <ThermoLogo />
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources
          </p>
          <p className="mono-label mt-3">
            Data sources: NASA FIRMS · OpenStreetMap contributors · Satellite observations
          </p>
        </div>
      </footer>
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function HeroStat({
  label,
  value,
  icon,
  loading,
  error,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
  error: boolean;
}) {
  const counted = useCountUp(value, !loading && !error);
  return (
    <div className="panel flex items-center gap-3 p-4">
      <span className="rounded-md border border-border bg-surface-2/60 p-2 text-primary">{icon}</span>
      <span>
        <span className="mono-label block">{label}</span>
        <span className="font-display block text-2xl font-bold tabular-nums">
          {error ? "—" : loading ? "···" : counted.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
      </span>
    </div>
  );
}

function EarthBackdrop() {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    delay: (i % 7) * 0.6,
    size: 2 + (i % 3),
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="grid-overlay absolute inset-0 opacity-60" />
      <div className="absolute -bottom-[46rem] left-1/2 h-[64rem] w-[64rem] -translate-x-1/2 rounded-full border border-primary/20 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_oklab,var(--cyan)_18%,transparent),transparent_62%)]" />
      <div className="absolute -bottom-[44rem] left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full border border-thermal/15" />
      <div className="absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 [animation:tg-sweep_18s_linear_infinite] rounded-full border border-dashed border-primary/15" />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-thermal/70"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ opacity: [0.15, 0.9, 0.15], y: [0, -14, 0] }}
          transition={{ duration: 5 + (i % 5), repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  );
}
