import {
  Activity,
  BarChart3,
  Factory,
  Flame,
  Gauge,
  LayoutDashboard,
  Map as MapIcon,
  Satellite,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/live-monitor", label: "Live Monitor", icon: Activity },
  { to: "/anomalies", label: "Thermal Events", icon: Flame },
  { to: "/industrial-facilities", label: "Industrial Facilities", icon: Factory },
  { to: "/risk-analysis", label: "Risk Analysis", icon: Gauge },
  { to: "/satellite-intelligence", label: "Satellite Intelligence", icon: Satellite },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/osm", label: "OSM Intelligence", icon: MapIcon },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;
