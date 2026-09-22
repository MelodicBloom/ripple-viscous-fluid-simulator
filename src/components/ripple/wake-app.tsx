import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Droplets, RotateCcw, Waves, CircleDot, Tornado, Undo2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  COLOR_MAPS,
  DEFAULT_PARAMS,
  RECIPES,
  RippleEngine,
  STRENGTH_PRESETS,
  WAVE_MODES,
  type ColorMapId,
  type RecipeId,
  type RippleParams,
  type WaveModeId,
} from "./engine";

const STORAGE_KEY = "wake.v4";
const LEGACY_KEYS = ["wake.v3", "wake.v2", "wake.v1"];

const PARAM_KEYS = [
  "viscosity",
  "strength",
  "area",
  "thickness",
  "density",
  "bubbles",
  "frequency",
  "interference",
  "lightAz",
  "lightEl",
  "lightInt",
  "lightSoft",
] as const;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function loadSettings(): RippleParams {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      LEGACY_KEYS.map((k) => localStorage.getItem(k)).find((v) => v != null);
    if (!raw) return { ...DEFAULT_PARAMS };
    const parsed = JSON.parse(raw) as Partial<RippleParams>;
    const colorMap = COLOR_MAPS.some((m) => m.id === parsed.colorMap)
      ? (parsed.colorMap as ColorMapId)
      : DEFAULT_PARAMS.colorMap;
    const waveMode = WAVE_MODES.some((m) => m.id === parsed.waveMode)
      ? (parsed.waveMode as WaveModeId)
      : DEFAULT_PARAMS.waveMode;
    const next: RippleParams = { ...DEFAULT_PARAMS, colorMap, waveMode };
    for (const key of PARAM_KEYS) {
      const value = parsed[key];
      next[key] = clamp01(typeof value === "number" ? value : DEFAULT_PARAMS[key]);
    }
    return next;
  } catch {
    return { ...DEFAULT_PARAMS };
  }
}

function saveSettings(params: RippleParams) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    /* private mode */
  }
}

function activeRecipe(params: RippleParams): RecipeId | null {
  for (const recipe of RECIPES) {
    const patch = recipe.patch as Partial<RippleParams>;
    let match = true;
    for (const [rawKey, rawWant] of Object.entries(patch)) {
      const key = rawKey as keyof RippleParams;
      if (rawWant === undefined) continue;
      if (key === "colorMap" || key === "waveMode") {
        if (params[key] !== rawWant) match = false;
        continue;
      }
      if (Math.abs((params[key] as number) - (rawWant as number)) >= 0.03) match = false;
    }
    if (match) return recipe.id;
  }
  return null;
}

type StudioTab = "matter" | "film" | "light";

export function WakeApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RippleEngine | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const overUiRef = useRef(false);
  const areaRef = useRef(DEFAULT_PARAMS.area);
  const updateRef = useRef<(patch: Partial<RippleParams>) => void>(() => {});
  const [params, setParams] = useState<RippleParams>(DEFAULT_PARAMS);
  const [hint, setHint] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<StudioTab>("matter");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const initial = loadSettings();
    setParams(initial);
    areaRef.current = initial.area;
    let engine: RippleEngine;
    try {
      engine = new RippleEngine(canvas, initial, {
        onParams: (patch) => updateRef.current(patch),
      });
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
        const px = 12 + areaRef.current * 36;
        cursor.style.width = `${px}px`;
        cursor.style.height = `${px}px`;
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

  const areaPx = 12 + params.area * 36;

  const update = useCallback((patch: Partial<RippleParams>) => {
    setParams((prev) => {
      const next = { ...prev, ...patch };
      areaRef.current = next.area;
      engineRef.current?.setParams(next);
      saveSettings(next);
      return next;
    });
  }, []);
  updateRef.current = update;

  const applyRecipe = useCallback(
    (id: RecipeId) => {
      const recipe = RECIPES.find((r) => r.id === id);
      if (!recipe) return;
      update(recipe.patch);
    },
    [update],
  );

  const clear = useCallback(() => {
    engineRef.current?.clear();
    setHint(true);
  }, []);

  const undo = useCallback(() => {
    engineRef.current?.undo();
  }, []);

  const freeze = useCallback(() => {
    void engineRef.current?.exportPng();
  }, []);

  const recipe = activeRecipe(params);

  return (
    <main className="relative h-dvh w-full select-none overflow-hidden bg-bg text-fg">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full cursor-none touch-none bg-[#1a5c66]"
        aria-label="Fluid ripple surface"
      />

      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-30 rounded-full border border-accent/70 opacity-0"
        style={{ width: areaPx, height: areaPx }}
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
            <p className="text-xs tracking-wide text-muted">Oil and water</p>
          </div>
        </div>
      </header>

      {hint && !error && (
        <p className="pointer-events-none absolute top-1/4 left-1/2 z-10 max-w-sm -translate-x-1/2 px-6 text-center font-display text-lg tracking-tight text-fg/80 italic md:text-xl">
          Drag to paint · Space pulse · R ring · V swirl · Z undo · F freeze
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
        <div className="max-h-[min(46dvh,520px)] overflow-y-auto overscroll-contain rounded-lg bg-surface/95 p-4 shadow-border backdrop-blur-sm md:max-h-[min(70dvh,640px)]">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-1 rounded-sm bg-surface-2 p-1">
              <TabButton active={tab === "matter"} onClick={() => setTab("matter")}>
                Matter
              </TabButton>
              <TabButton active={tab === "film"} onClick={() => setTab("film")}>
                Film
              </TabButton>
              <TabButton active={tab === "light"} onClick={() => setTab("light")}>
                Light
              </TabButton>
            </div>

            {tab === "matter" && (
              <>
                <fieldset className="min-w-0">
                  <legend className="mb-2 text-xs font-medium tracking-wide text-muted">
                    Wave
                  </legend>
                  <div className="grid grid-cols-3 gap-1.5">
                    {WAVE_MODES.map((item) => {
                      const active = params.waveMode === item.id;
                      const Icon = item.id === "pulse" ? Waves : item.id === "ring" ? CircleDot : Tornado;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => update({ waveMode: item.id })}
                          className={cn(
                            "flex h-11 items-center justify-center gap-1.5 rounded-sm text-sm font-medium tracking-wide",
                            "transition-[background-color,color,transform] duration-150 ease-out",
                            "active:scale-[0.96]",
                            active
                              ? "bg-accent text-accent-fg"
                              : "bg-surface-2 text-fg hover:bg-surface-2/80",
                          )}
                        >
                          <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {STRENGTH_PRESETS.map((item) => {
                      const active = Math.abs(params.strength - item.value) < 0.04;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => update({ strength: item.value })}
                          className={cn(
                            "h-11 rounded-sm text-sm font-medium tracking-wide",
                            "transition-[background-color,color,transform] duration-150 ease-out",
                            "active:scale-[0.96]",
                            active
                              ? "bg-accent text-accent-fg"
                              : "bg-surface-2 text-fg hover:bg-surface-2/80",
                          )}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className="mb-2 text-xs font-medium tracking-wide text-muted">
                    Medium
                  </legend>
                  <div className="grid grid-cols-3 gap-1.5">
                    {RECIPES.map((item) => {
                      const active = recipe === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => applyRecipe(item.id)}
                          className={cn(
                            "h-11 rounded-sm text-sm font-medium tracking-wide",
                            "transition-[background-color,color,transform] duration-150 ease-out",
                            "active:scale-[0.96]",
                            active
                              ? "bg-accent text-accent-fg"
                              : "bg-surface-2 text-fg hover:bg-surface-2/80",
                          )}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="min-w-0">
                  <legend className="mb-2 text-xs font-medium tracking-wide text-muted">
                    Color map
                  </legend>
                  <div className="grid grid-cols-4 gap-1.5">
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
                <SliderField
                  label="Area of effect"
                  value={params.area}
                  onChange={(v) => update({ area: v })}
                />
              </>
            )}

            {tab === "film" && (
              <>
                <SliderField
                  label="Thickness"
                  value={params.thickness}
                  onChange={(v) => update({ thickness: v })}
                />
                <SliderField
                  label="Density"
                  value={params.density}
                  onChange={(v) => update({ density: v })}
                />
                <SliderField
                  label="Bubbles"
                  value={params.bubbles}
                  onChange={(v) => update({ bubbles: v })}
                />
                <SliderField
                  label="Frequency"
                  value={params.frequency}
                  onChange={(v) => update({ frequency: v })}
                />
                <SliderField
                  label="Interference"
                  value={params.interference}
                  onChange={(v) => update({ interference: v })}
                />
              </>
            )}

            {tab === "light" && (
              <>
                <LightPad
                  az={params.lightAz}
                  el={params.lightEl}
                  onChange={(lightAz, lightEl) => update({ lightAz, lightEl })}
                />
                <SliderField
                  label="Intensity"
                  value={params.lightInt}
                  onChange={(v) => update({ lightInt: v })}
                />
                <SliderField
                  label="Quality"
                  value={params.lightSoft}
                  onChange={(v) => update({ lightSoft: v })}
                />
                <p className="text-xs leading-normal text-faint">
                  Drag the lamp. Arrows orbit · Q/E dim · WASD edge waves
                </p>
              </>
            )}

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={undo}
                className={cn(
                  "flex h-11 items-center justify-center gap-1.5 rounded-sm",
                  "bg-surface-2 text-sm font-medium text-fg",
                  "transition-[background-color,transform] duration-150 ease-out",
                  "hover:bg-surface-2/80 active:scale-[0.96]",
                )}
              >
                <Undo2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Undo
              </button>
              <button
                type="button"
                onClick={freeze}
                className={cn(
                  "flex h-11 items-center justify-center gap-1.5 rounded-sm",
                  "bg-surface-2 text-sm font-medium text-fg",
                  "transition-[background-color,transform] duration-150 ease-out",
                  "hover:bg-surface-2/80 active:scale-[0.96]",
                )}
              >
                <Download className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Freeze
              </button>
              <button
                type="button"
                onClick={clear}
                className={cn(
                  "flex h-11 items-center justify-center gap-1.5 rounded-sm",
                  "bg-surface-2 text-sm font-medium text-fg",
                  "transition-[background-color,transform] duration-150 ease-out",
                  "hover:bg-surface-2/80 active:scale-[0.96]",
                )}
              >
                <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-10 rounded-sm text-sm font-medium tracking-wide",
        "transition-[background-color,color,transform] duration-150 ease-out",
        "active:scale-[0.96]",
        active ? "bg-surface text-fg shadow-border" : "text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function LightPad({
  az,
  el,
  onChange,
}: {
  az: number;
  el: number;
  onChange: (az: number, el: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const apply = (clientX: number, clientY: number) => {
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const x = ((clientX - box.left) / Math.max(box.width, 1)) * 2 - 1;
    const y = ((clientY - box.top) / Math.max(box.height, 1)) * 2 - 1;
    const len = Math.min(1, Math.hypot(x, y));
    const ang = Math.atan2(x, -y);
    const nextAz = (ang / (Math.PI * 2) + 1) % 1;
    onChange(nextAz, 1 - len);
  };

  const onPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events have no active pointer */
    }
    apply(e.clientX, e.clientY);
  };

  const len = 1 - el;
  const ang = az * Math.PI * 2;
  const tx = Math.sin(ang) * len;
  const ty = -Math.cos(ang) * len;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wide text-muted">Lamp</span>
      <div
        ref={ref}
        role="slider"
        aria-label="Light direction"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(el * 100)}
        tabIndex={0}
        className="relative mx-auto size-24 touch-none rounded-full bg-surface-2 shadow-border"
        onPointerDown={onPointer}
        onPointerMove={(e) => {
          if (e.buttons) apply(e.clientX, e.clientY);
        }}
      >
        <span className="pointer-events-none absolute inset-[18%] rounded-full bg-surface/70" />
        <span
          className="pointer-events-none absolute size-3 rounded-full bg-accent shadow-border"
          style={{
            left: `${50 + tx * 42}%`,
            top: `${50 + ty * 42}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
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
