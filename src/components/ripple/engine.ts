export const COLOR_MAPS = [
  { id: "abyss", label: "Abyss" },
  { id: "ember", label: "Ember" },
  { id: "glacier", label: "Glacier" },
  { id: "ink", label: "Ink" },
  { id: "bloom", label: "Bloom" },
  { id: "solar", label: "Solar" },
] as const;

export type ColorMapId = (typeof COLOR_MAPS)[number]["id"];

export type RippleParams = {
  viscosity: number;
  strength: number;
  colorMap: ColorMapId;
};

export const DEFAULT_PARAMS: RippleParams = {
  viscosity: 0.28,
  strength: 0.62,
  colorMap: "abyss",
};

const COLOR_INDEX: Record<ColorMapId, number> = {
  abyss: 0,
  ember: 1,
  glacier: 2,
  ink: 3,
  bloom: 4,
  solar: 5,
};

const MAX_DROPS = 12;
const SIM_STEP = 1 / 60;
const MAX_STEPS = 3;
const SIM_LONG = 640;

type Target = {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
};

type PointerStroke = {
  x: number;
  y: number;
  down: boolean;
};

const VERT = `#version 300 es
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const COMMON = `
#ifdef PACKED
float decode(vec4 c) { return c.r * 2.0 - 1.0; }
vec2 encodePair(float h, float p) {
  return vec2(clamp(h * 0.5 + 0.5, 0.0, 1.0), clamp(p * 0.5 + 0.5, 0.0, 1.0));
}
#else
float decode(vec4 c) { return c.r; }
vec2 encodePair(float h, float p) { return vec2(h, p); }
#endif
`;

const SIM_FRAG = `
in vec2 vUv;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uDamping;
uniform float uDiffuse;
out vec4 fragColor;

${COMMON}

void main() {
  vec4 c = texture(uState, vUv);
  float h = decode(c);
#ifdef PACKED
  float p = c.g * 2.0 - 1.0;
#else
  float p = c.g;
#endif
  float n =
    decode(texture(uState, vUv + vec2(uTexel.x, 0.0))) +
    decode(texture(uState, vUv - vec2(uTexel.x, 0.0))) +
    decode(texture(uState, vUv + vec2(0.0, uTexel.y))) +
    decode(texture(uState, vUv - vec2(0.0, uTexel.y)));
  float hNew = (n * 0.5 - p) * uDamping;
  hNew = mix(hNew, n * 0.25, uDiffuse);
  hNew = clamp(hNew, -2.8, 2.8);
  vec2 enc = encodePair(hNew, h);
  fragColor = vec4(enc, 0.0, 1.0);
}
`;

const DROP_FRAG = `
in vec2 vUv;
uniform sampler2D uState;
uniform vec4 uDrops[12];
uniform int uCount;
uniform float uAspect;
out vec4 fragColor;

${COMMON}

void main() {
  vec4 c = texture(uState, vUv);
  float h = decode(c);
#ifdef PACKED
  float p = c.g * 2.0 - 1.0;
#else
  float p = c.g;
#endif
  float add = 0.0;
  for (int i = 0; i < 12; i++) {
    if (i >= uCount) break;
    vec2 d = vUv - uDrops[i].xy;
    d.x *= uAspect;
    float sig = max(uDrops[i].w, 0.0008);
    float r2 = dot(d, d) / (sig * sig);
    add += uDrops[i].z * exp(-r2);
  }
  h = clamp(h + add, -2.8, 2.8);
  vec2 enc = encodePair(h, p);
  fragColor = vec4(enc, 0.0, 1.0);
}
`;

const DISPLAY_FRAG = `
in vec2 vUv;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform int uMap;
uniform float uTime;
out vec4 fragColor;

${COMMON}

float sampleH(vec2 uv) {
  vec2 res = vec2(1.0 / max(uTexel.x, 1e-6), 1.0 / max(uTexel.y, 1e-6));
  vec2 p = uv * res - 0.5;
  vec2 f = fract(p);
  vec2 i = floor(p);
  vec2 u0 = (i + 0.5) * uTexel;
  float a = decode(texture(uState, u0));
  float b = decode(texture(uState, u0 + vec2(uTexel.x, 0.0)));
  float c = decode(texture(uState, u0 + vec2(0.0, uTexel.y)));
  float d = decode(texture(uState, u0 + uTexel));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 ramp(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  t = clamp(t, 0.0, 1.0);
  float x = t * 3.0;
  if (x < 1.0) return mix(a, b, smoothstep(0.0, 1.0, x));
  if (x < 2.0) return mix(b, c, smoothstep(0.0, 1.0, x - 1.0));
  return mix(c, d, smoothstep(0.0, 1.0, x - 2.0));
}

vec3 palette(int id, float t) {
  if (id == 1) {
    return ramp(t,
      vec3(0.039, 0.016, 0.012),
      vec3(0.361, 0.094, 0.031),
      vec3(0.878, 0.408, 0.125),
      vec3(1.0, 0.886, 0.627));
  }
  if (id == 2) {
    return ramp(t,
      vec3(0.027, 0.063, 0.094),
      vec3(0.086, 0.275, 0.384),
      vec3(0.494, 0.784, 0.878),
      vec3(0.91, 0.965, 1.0));
  }
  if (id == 3) {
    return ramp(t,
      vec3(0.027, 0.027, 0.031),
      vec3(0.09, 0.098, 0.11),
      vec3(0.42, 0.45, 0.48),
      vec3(0.86, 0.88, 0.9));
  }
  if (id == 4) {
    return ramp(t,
      vec3(0.012, 0.078, 0.059),
      vec3(0.031, 0.22, 0.18),
      vec3(0.118, 0.788, 0.604),
      vec3(0.776, 1.0, 0.91));
  }
  if (id == 5) {
    return ramp(t,
      vec3(0.008, 0.016, 0.047),
      vec3(0.07, 0.227, 0.549),
      vec3(0.078, 0.768, 0.784),
      vec3(0.941, 0.878, 0.439));
  }
  return ramp(t,
    vec3(0.012, 0.027, 0.047),
    vec3(0.039, 0.239, 0.322),
    vec3(0.173, 0.722, 0.761),
    vec3(0.898, 0.969, 0.957));
}

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  float h = sampleH(vUv);
  float hl = sampleH(vUv - vec2(uTexel.x, 0.0));
  float hr = sampleH(vUv + vec2(uTexel.x, 0.0));
  float hd = sampleH(vUv - vec2(0.0, uTexel.y));
  float hu = sampleH(vUv + vec2(0.0, uTexel.y));

  vec3 n = normalize(vec3((hl - hr) * 10.0, 1.35, (hd - hu) * 10.0));
  vec3 light = normalize(vec3(
    0.42 + 0.1 * sin(uTime * 0.11),
    0.84,
    0.32 + 0.08 * cos(uTime * 0.09)
  ));
  vec3 view = vec3(0.0, 1.0, 0.0);
  float ndl = clamp(dot(n, light), 0.0, 1.0);
  vec3 halfV = normalize(light + view);
  float spec = pow(clamp(dot(n, halfV), 0.0, 1.0), 72.0);
  float fres = pow(clamp(1.0 - n.y, 0.0, 1.0), 2.2);

  float t = clamp(h * 1.55 + 0.42 + ndl * 0.18, 0.0, 1.0);
  vec3 albedo = palette(uMap, t);

  float lap = (hl + hr + hu + hd) - 4.0 * h;
  float caustic = pow(clamp(-lap * 5.5, 0.0, 1.0), 1.35);

  vec3 specCol = vec3(0.78, 0.88, 1.0);
  vec3 color = albedo * (0.18 + 0.82 * ndl);
  color += spec * specCol * 0.85;
  color += caustic * mix(albedo, specCol, 0.4) * 0.55;
  color = mix(color, specCol, fres * 0.22);

  float foam = smoothstep(0.14, 0.32, h);
  color = mix(color, vec3(0.93, 0.96, 1.0), foam * 0.42);

  float vig = 1.0 - 0.38 * dot(vUv - 0.5, vUv - 0.5);
  color *= vig;

  float g = (hash(gl_FragCoord.xy) - 0.5) * 0.028;
  color += g;

  color = max(color, vec3(0.0));
  color = pow(color, vec3(0.95));
  fragColor = vec4(color, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader.");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || "Shader compile failed.";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function link(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create program.");
  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || "Program link failed.";
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function shaderSrc(body: string, packed: boolean): string {
  return `#version 300 es
${packed ? "#define PACKED 1" : ""}
precision highp float;
${body}`;
}

function simSize(cssW: number, cssH: number): { w: number; h: number } {
  const aspect = cssW / Math.max(cssH, 1);
  let w: number;
  let h: number;
  if (aspect >= 1) {
    w = SIM_LONG;
    h = Math.max(96, Math.round(SIM_LONG / aspect));
  } else {
    h = SIM_LONG;
    w = Math.max(96, Math.round(SIM_LONG * aspect));
  }
  return { w: w & ~1, h: h & ~1 };
}

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

type Drop = { x: number; y: number; amp: number; radius: number };

export class RippleEngine {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private packed = false;
  private simW = 0;
  private simH = 0;
  private a!: Target;
  private b!: Target;
  private simProg!: WebGLProgram;
  private dropProg!: WebGLProgram;
  private displayProg!: WebGLProgram;
  private vao!: WebGLVertexArrayObject;
  private params: RippleParams;
  private drops: Drop[] = [];
  private pointers = new Map<number, PointerStroke>();
  private raf = 0;
  private acc = 0;
  private lastT = 0;
  private running = false;
  private destroyed = false;
  private reducedMotion = false;
  private time = 0;
  private ro: ResizeObserver | null = null;
  private onLost: (e: Event) => void;
  private onRestored: () => void;
  private onPointerDown: (e: PointerEvent) => void;
  private onPointerMove: (e: PointerEvent) => void;
  private onPointerUp: (e: PointerEvent) => void;
  private onKey: (e: KeyboardEvent) => void;
  private listeners: Array<{
    type: string;
    fn: EventListener;
    target: EventTarget;
  }> = [];

  constructor(canvas: HTMLCanvasElement, params: RippleParams) {
    this.canvas = canvas;
    this.params = { ...params };
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL2 is required for Wake.");
    this.gl = gl;

    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.onLost = (e) => {
      e.preventDefault();
      this.running = false;
      cancelAnimationFrame(this.raf);
    };
    this.onRestored = () => {
      if (this.destroyed) return;
      this.initGpu();
      this.warmStart();
      this.start();
    };
    this.onPointerDown = (e) => this.handleDown(e);
    this.onPointerMove = (e) => this.handleMove(e);
    this.onPointerUp = (e) => this.handleUp(e);
    this.onKey = (e) => {
      if (e.code === "KeyC" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        this.clear();
      }
    };

    this.initGpu();
    this.bindInput();
    this.warmStart();
  }

  setParams(next: Partial<RippleParams>) {
    this.params = { ...this.params, ...next };
  }

  clear() {
    const gl = this.gl;
    for (const t of [this.a, this.b]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.viewport(0, 0, this.simW, this.simH);
      gl.clearColor(this.packed ? 0.5 : 0, this.packed ? 0.5 : 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.drops.length = 0;
  }

  start() {
    if (this.running || this.destroyed) return;
    this.running = true;
    this.lastT = performance.now();
    this.acc = 0;
    const loop = (now: number) => {
      if (!this.running) return;
      const raw = (now - this.lastT) / 1000;
      this.lastT = now;
      const dt = Math.min(raw, 0.1);
      this.tick(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    this.ro = null;
    for (const { type, fn, target } of this.listeners) {
      target.removeEventListener(type, fn);
    }
    this.listeners = [];
    const gl = this.gl;
    gl.deleteProgram(this.simProg);
    gl.deleteProgram(this.dropProg);
    gl.deleteProgram(this.displayProg);
    this.deleteTarget(this.a);
    this.deleteTarget(this.b);
    gl.deleteVertexArray(this.vao);
    if (window.__wake) delete window.__wake;
  }

  private listen(target: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) {
    target.addEventListener(type, fn, opts);
    this.listeners.push({ type, fn, target });
  }

  private initGpu() {
    const gl = this.gl;
    const packed = !this.tryFloat();
    this.packed = packed;

    this.simProg = link(gl, VERT, shaderSrc(SIM_FRAG, packed));
    this.dropProg = link(gl, VERT, shaderSrc(DROP_FRAG, packed));
    this.displayProg = link(gl, VERT, shaderSrc(DISPLAY_FRAG, packed));

    const vao = gl.createVertexArray();
    const buf = gl.createBuffer();
    if (!vao || !buf) throw new Error("Unable to allocate geometry.");
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.vao = vao;

    this.resize(true);
  }

  private tryFloat(): boolean {
    const gl = this.gl;
    if (!gl.getExtension("EXT_color_buffer_float")) return false;
    const tex = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!tex || !fbo) return false;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 4, 4, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fbo);
    gl.deleteTexture(tex);
    return ok;
  }

  private makeTarget(w: number, h: number): Target {
    const gl = this.gl;
    const tex = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!tex || !fbo) throw new Error("Unable to allocate surface.");
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (this.packed) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error("Framebuffer incomplete.");
    }
    gl.clearColor(this.packed ? 0.5 : 0, this.packed ? 0.5 : 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex, fbo };
  }

  private deleteTarget(t: Target | undefined) {
    if (!t) return;
    this.gl.deleteTexture(t.tex);
    this.gl.deleteFramebuffer(t.fbo);
  }

  private resize(force = false) {
    const canvas = this.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = Math.max(1, canvas.clientWidth);
    const cssH = Math.max(1, canvas.clientHeight);
    const pxW = Math.max(1, Math.round(cssW * dpr));
    const pxH = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
    }
    const { w, h } = simSize(cssW, cssH);
    if (!force && w === this.simW && h === this.simH) return;
    this.simW = w;
    this.simH = h;
    this.deleteTarget(this.a);
    this.deleteTarget(this.b);
    this.a = this.makeTarget(w, h);
    this.b = this.makeTarget(w, h);
  }

  private bindInput() {
    const canvas = this.canvas;
    canvas.style.touchAction = "none";
    this.listen(canvas, "pointerdown", this.onPointerDown as EventListener);
    this.listen(canvas, "pointermove", this.onPointerMove as EventListener);
    this.listen(canvas, "pointerup", this.onPointerUp as EventListener);
    this.listen(canvas, "pointercancel", this.onPointerUp as EventListener);
    this.listen(window, "keydown", this.onKey as EventListener);
    this.listen(canvas, "webglcontextlost", this.onLost);
    this.listen(canvas, "webglcontextrestored", this.onRestored);
    this.listen(canvas, "contextmenu", (e) => e.preventDefault());

    this.ro = new ResizeObserver(() => {
      if (!this.destroyed) this.resize();
    });
    this.ro.observe(canvas.parentElement ?? canvas);

    window.__wake = {
      clear: () => this.clear(),
      drop: (x, y, amp = 0.45) => {
        this.queueDrop(x, y, amp, 0.032);
      },
    };
  }

  private eventUv(e: PointerEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
    const y = clamp(1 - (e.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
    return { x, y };
  }

  private handleDown(e: PointerEvent) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    const uv = this.eventUv(e);
    this.pointers.set(e.pointerId, { ...uv, down: true });
    const amp = this.dropAmp(1);
    this.queueDrop(uv.x, uv.y, amp, this.dropRadius());
  }

  private handleMove(e: PointerEvent) {
    const uv = this.eventUv(e);
    const prev = this.pointers.get(e.pointerId);
    const down = prev?.down || e.buttons > 0;
    if (!prev) {
      this.pointers.set(e.pointerId, { ...uv, down: false });
      if (down) this.stroke(uv.x, uv.y, uv.x, uv.y, true);
      else this.hover(uv.x, uv.y, 0);
      return;
    }
    const dist = Math.hypot(uv.x - prev.x, uv.y - prev.y);
    if (down) this.stroke(prev.x, prev.y, uv.x, uv.y, true);
    else this.hover(uv.x, uv.y, dist);
    this.pointers.set(e.pointerId, { ...uv, down });
  }

  private handleUp(e: PointerEvent) {
    const prev = this.pointers.get(e.pointerId);
    if (prev && e.type === "pointerup") {
      const uv = this.eventUv(e);
      this.stroke(prev.x, prev.y, uv.x, uv.y, true);
    }
    this.pointers.delete(e.pointerId);
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  private hover(x: number, y: number, dist: number) {
    if (dist < 0.002) return;
    const amp = this.dropAmp(0.16 + Math.min(dist * 6, 0.28));
    this.queueDrop(x, y, amp, this.dropRadius() * 0.7);
  }

  private stroke(x0: number, y0: number, x1: number, y1: number, strong: boolean) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const spacing = 0.012;
    const steps = Math.max(1, Math.ceil(dist / spacing));
    const impulse = strong ? 0.7 + Math.min(dist * 8, 0.9) : 0.2;
    const amp = this.dropAmp(impulse);
    const radius = this.dropRadius();
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      this.queueDrop(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, amp, radius);
    }
  }

  private dropAmp(impulse: number): number {
    const s = clamp(this.params.strength, 0, 1);
    return (0.045 + s * 0.4) * impulse;
  }

  private dropRadius(): number {
    const s = clamp(this.params.strength, 0, 1);
    return 0.016 + s * 0.026;
  }

  queueDrop(x: number, y: number, amp: number, radius: number) {
    this.drops.push({
      x: clamp(x, 0, 1),
      y: clamp(y, 0, 1),
      amp,
      radius,
    });
  }

  private warmStart() {
    const seeds: Drop[] = [
      { x: 0.3, y: 0.56, amp: 0.52, radius: 0.034 },
      { x: 0.61, y: 0.4, amp: 0.4, radius: 0.03 },
      { x: 0.47, y: 0.7, amp: 0.32, radius: 0.028 },
      { x: 0.16, y: 0.32, amp: 0.24, radius: 0.04 },
      { x: 0.8, y: 0.62, amp: 0.3, radius: 0.032 },
      { x: 0.72, y: 0.24, amp: 0.22, radius: 0.026 },
    ];
    this.drops.push(...seeds);
    this.flushDrops();
    for (let i = 0; i < 28; i++) this.simStep();
  }

  private tick(dt: number) {
    this.time += this.reducedMotion ? 0 : dt;
    this.flushDrops();
    this.acc += dt;
    let steps = 0;
    while (this.acc >= SIM_STEP && steps < MAX_STEPS) {
      this.simStep();
      this.acc -= SIM_STEP;
      steps += 1;
    }
    this.render();
  }

  private damping(): number {
    const v = clamp(this.params.viscosity, 0, 1);
    const t = v ** 0.9;
    return 0.996 - t * 0.088;
  }

  private diffuse(): number {
    return clamp(this.params.viscosity, 0, 1) * 0.07;
  }

  private simStep() {
    const gl = this.gl;
    const prog = this.simProg;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.b.fbo);
    gl.viewport(0, 0, this.simW, this.simH);
    gl.useProgram(prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.a.tex);
    gl.uniform1i(gl.getUniformLocation(prog, "uState"), 0);
    gl.uniform2f(gl.getUniformLocation(prog, "uTexel"), 1 / this.simW, 1 / this.simH);
    gl.uniform1f(gl.getUniformLocation(prog, "uDamping"), this.damping());
    gl.uniform1f(gl.getUniformLocation(prog, "uDiffuse"), this.diffuse());
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.swap();
  }

  private flushDrops() {
    if (this.drops.length === 0) return;
    const gl = this.gl;
    const prog = this.dropProg;
    const aspect = this.simW / Math.max(this.simH, 1);
    while (this.drops.length > 0) {
      const batch = this.drops.splice(0, MAX_DROPS);
      const data = new Float32Array(MAX_DROPS * 4);
      for (let i = 0; i < batch.length; i++) {
        const d = batch[i];
        data[i * 4] = d.x;
        data[i * 4 + 1] = d.y;
        data[i * 4 + 2] = d.amp;
        data[i * 4 + 3] = d.radius;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.b.fbo);
      gl.viewport(0, 0, this.simW, this.simH);
      gl.useProgram(prog);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.a.tex);
      gl.uniform1i(gl.getUniformLocation(prog, "uState"), 0);
      gl.uniform1i(gl.getUniformLocation(prog, "uCount"), batch.length);
      gl.uniform1f(gl.getUniformLocation(prog, "uAspect"), aspect);
      const loc = gl.getUniformLocation(prog, "uDrops[0]");
      if (loc) gl.uniform4fv(loc, data);
      gl.bindVertexArray(this.vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      this.swap();
    }
  }

  private render() {
    const gl = this.gl;
    const prog = this.displayProg;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.a.tex);
    gl.uniform1i(gl.getUniformLocation(prog, "uState"), 0);
    gl.uniform2f(gl.getUniformLocation(prog, "uTexel"), 1 / this.simW, 1 / this.simH);
    gl.uniform1i(gl.getUniformLocation(prog, "uMap"), COLOR_INDEX[this.params.colorMap] ?? 0);
    gl.uniform1f(gl.getUniformLocation(prog, "uTime"), this.time);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private swap() {
    const tmp = this.a;
    this.a = this.b;
    this.b = tmp;
  }
}

declare global {
  interface Window {
    __wake?: {
      clear: () => void;
      drop: (x: number, y: number, amp?: number) => void;
    };
  }
}
