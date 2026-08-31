import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { glyph: "●", label: "HIGH RISK", className: "text-risk-high" },
  { glyph: "●", label: "MEDIUM RISK", className: "text-risk-medium" },
  { glyph: "●", label: "LOW RISK", className: "text-risk-low" },
  { glyph: "◆", label: "INDUSTRIAL FACILITY", className: "text-cyan" },
  { glyph: "◎", label: "SELECTED EVENT", className: "text-foreground" },
  { glyph: "◌", label: "ANALYSIS RADIUS", className: "text-muted-foreground" },
];

export function MapLegend({ className }: { className?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={cn("panel w-[190px] overflow-hidden text-xs", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-surface-2/60"
      >
        <span className="mono-label">Legend</span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <ul className="space-y-1.5 border-t border-border px-3 py-2">
          {ITEMS.map((i) => (
            <li key={i.label} className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
              <span className={i.className}>{i.glyph}</span>
              {i.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
