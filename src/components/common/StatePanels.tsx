import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw, SatelliteDish } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-14 text-center", className)}>
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-2/60 text-primary">
        {icon ?? <SatelliteDish className="h-6 w-6" />}
      </div>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = "ThermoGuard cannot reach the intelligence server.",
  description = "Verify that the FastAPI backend is running and VITE_API_BASE_URL is configured correctly.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-14 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry connection
        </Button>
      )}
    </div>
  );
}

export function LoadingSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3 p-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full bg-surface-2/70" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex h-[260px] items-end gap-2 p-4">
      {[42, 68, 33, 80, 54, 71, 39, 62].map((h, i) => (
        <Skeleton key={i} className="w-full bg-surface-2/70" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export function MapScanningOverlay({ label = "ACQUIRING SATELLITE DATA" }: { label?: string }) {
  return (
    <div className="absolute inset-0 z-[500] flex items-center justify-center overflow-hidden bg-background/70 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/25 to-transparent [animation:tg-scanline_2.4s_linear_infinite]" />
      <p className="mono-label z-10 text-primary">{label}</p>
    </div>
  );
}
