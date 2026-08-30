import { useCallback, useEffect, useRef, useState } from "react";
import { Droplets, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  COLOR_MAPS,
  DEFAULT_PARAMS,
  RippleEngine,
  type ColorMapId,
  type RippleParams,
} from "./engine";

const STORAGE_KEY = "wake.v1";

function loadSettings(): RippleParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PARAMS };
    const parsed = JSON.parse(raw) as Partial<RippleParams>;
    const colorMap = COLOR_MAPS.some((m) => m.id === parsed.colorMap)
      ? (parsed.colorMap as ColorMapId)
      : DEFAULT_PARAMS.colorMap;
    return {
      viscosity: clamp01(parsed.viscosity ?? DEFAULT_PARAMS.viscosity),
      strength: clamp01(parsed.strength ?? DEFAULT_PARAMS.strength),
      colorMap,
    };
  } catch {
    return { ...DEFAULT_PARAMS };
  }
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function saveSettings(params: RippleParams) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    /* private mode */
  }
}

export function WakeApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RippleEngine | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const overUiRef = useRef(false);
  const [params, setParams] = useState<RippleParams>(DEFAULT_PARAMS);
  const [hint, setHint] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const initial = loadSettings();
    setParams(initial);
    let engine: RippleEngine;
    try {
      engine = new RippleEngine(canvas, initial);
      engine.start();
      engineRef.current = engine;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start the surface.");
      return;
    }

    const cursor = cursorRef.current;
    let cx = window.innerWidth * 0.5;
    let cy = window.innerHeight * 0.5;
    let tx = cx;
    let ty = cy;
    let visible = false;
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      visible = e.pointerType === "mouse";
    };
    const onLeave = () => {
      visible = false;
    };
    const tick = () => {
      const k = reduced ? 1 : 0.22;
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      if (cursor) {
        cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        cursor.style.opacity = visible && !overUiRef.current ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    const onFirst = () => setHint(false);
    canvas.addEventListener("pointerdown", onFirst, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("pointerdown", onFirst);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const update = useCallback((patch: Partial<RippleParams>) => {
    setParams((prev) => {
      const next = { ...prev, ...patch };
      engineRef.current?.setParams(next);
      saveSettings(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    engineRef.current?.clear();
    setHint(true);
  }, []);

  return (
    <main className="relative h-dvh w-full select-none overflow-hidden bg-bg text-fg">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full cursor-none touch-none bg-bg"
        aria-label="Fluid ripple surface"
      />

      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-30 size-5 rounded-full border border-accent/70 opacity-0"
      />

      <header className="pointer-events-none absolute top-0 left-0 z-10 p-4 pt-[max(1rem,env(safe-area-inset-top))] md:p-8">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-sm bg-surface text-accent shadow-border">
            <Droplets className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-2xl leading-tight tracking-tight italic md:text-3xl">
              Wake
            </h1>
            <p className="text-xs tracking-wide text-muted">Fluid surface</p>
          </div>
        </div>
      </header>

      {hint && !error && (
        <p className="pointer-events-none absolute top-1/4 left-1/2 z-10 max-w-sm -translate-x-1/2 px-6 text-center font-display text-lg tracking-tight text-fg/80 italic md:text-xl">
          Drag across the surface
        </p>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
          <p className="max-w-sm rounded-lg bg-surface p-4 text-sm leading-normal text-muted shadow-border">
            {error}
          </p>
        </div>
      )}

      <aside
        className="absolute right-4 bottom-4 left-4 z-10 mb-[env(safe-area-inset-bottom)] md:right-auto md:bottom-6 md:left-6 md:w-80"
        onPointerEnter={() => {
          overUiRef.current = true;
        }}
        onPointerLeave={() => {
          overUiRef.current = false;
        }}
      >
        <div className="rounded-lg bg-surface/95 p-4 shadow-border backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <SliderField
              label="Viscosity"
              value={params.viscosity}
              onChange={(v) => update({ viscosity: v })}
            />
            <SliderField
              label="Wave strength"
              value={params.strength}
              onChange={(v) => update({ strength: v })}
            />

            <fieldset className="min-w-0">
              <legend className="mb-2 text-xs font-medium tracking-wide text-muted">
                Color map
              </legend>
              <div className="grid grid-cols-3 gap-1.5">
                {COLOR_MAPS.map((map) => {
                  const active = map.id === params.colorMap;
                  return (
                    <button
                      key={map.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => update({ colorMap: map.id })}
                      className={cn(
                        "h-11 rounded-sm text-sm font-medium tracking-wide",
                        "transition-[background-color,color,transform] duration-150 ease-out",
                        "active:scale-[0.96]",
                        active
                          ? "bg-accent text-accent-fg"
                          : "bg-surface-2 text-fg hover:bg-surface-2/80",
                      )}
                    >
                      {map.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={clear}
              className={cn(
                "flex h-11 w-full items-center justify-center gap-2 rounded-sm",
                "bg-surface-2 text-sm font-medium text-fg shadow-border",
                "transition-[background-color,transform] duration-150 ease-out",
                "hover:bg-surface-2/80 active:scale-[0.96]",
              )}
            >
              <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Clear surface
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = Math.round(value * 100);
  return (
    <label className="flex min-w-0 flex-col">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-muted">{label}</span>
        <span className="text-xs tabular-nums text-faint">{pct}</span>
      </span>
      <input
        className="wake-range"
        type="range"
        min={0}
        max={100}
        step={1}
        value={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={label}
        style={{ ["--fill" as string]: `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
      />
    </label>
  );
}
