import { cn } from "@/lib/utils";

export function ThermoLogo({
  className,
  showText = true,
  size = 32,
}: {
  className?: string;
  showText?: boolean;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className="relative inline-flex shrink-0 items-center justify-center"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <defs>
            <linearGradient id="tg-logo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--cyan)" />
              <stop offset="100%" stopColor="var(--thermal)" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="17" fill="none" stroke="url(#tg-logo)" strokeWidth="1.6" />
          <circle cx="20" cy="20" r="11" fill="none" stroke="var(--border)" strokeWidth="1" />
          <path d="M3 20h34M20 3v34" stroke="var(--grid)" strokeWidth="1" />
          <circle cx="26" cy="14" r="3.4" fill="var(--thermal)" />
          <circle cx="14" cy="26" r="2" fill="var(--cyan)" />
        </svg>
      </span>
      {showText && (
        <span className="leading-none">
          <span className="font-display block text-sm font-bold tracking-wide text-foreground">
            THERMOGUARD <span className="text-primary">AI</span>
          </span>
          <span className="mono-label block pt-1 text-[9px]">Fire Intelligence</span>
        </span>
      )}
    </div>
  );
}
