import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as RotateCcw, r as Droplets } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CAQ_6o1_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var COLOR_MAPS = [
	{
		id: "abyss",
		label: "Abyss"
	},
	{
		id: "ember",
		label: "Ember"
	},
	{
		id: "glacier",
		label: "Glacier"
	},
	{
		id: "ink",
		label: "Ink"
	},
	{
		id: "bloom",
		label: "Bloom"
	},
	{
		id: "solar",
		label: "Solar"
	}
];
var DEFAULT_PARAMS = {
	viscosity: .28,
	strength: .62,
	colorMap: "abyss"
};
var COLOR_INDEX = {
	abyss: 0,
	ember: 1,
	glacier: 2,
	ink: 3,
	bloom: 4,
	solar: 5
};
var MAX_DROPS = 12;
var SIM_STEP = 1 / 60;
var MAX_STEPS = 3;
var SIM_LONG = 640;
var VERT = `#version 300 es
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;
var COMMON = `
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
var SIM_FRAG = `
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
var DROP_FRAG = `
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
var DISPLAY_FRAG = `
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
function compile(gl, type, src) {
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
function link(gl, vertSrc, fragSrc) {
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
function shaderSrc(body, packed) {
	return `#version 300 es
${packed ? "#define PACKED 1" : ""}
precision highp float;
${body}`;
}
function simSize(cssW, cssH) {
	const aspect = cssW / Math.max(cssH, 1);
	let w;
	let h;
	if (aspect >= 1) {
		w = SIM_LONG;
		h = Math.max(96, Math.round(SIM_LONG / aspect));
	} else {
		h = SIM_LONG;
		w = Math.max(96, Math.round(SIM_LONG * aspect));
	}
	return {
		w: w & -2,
		h: h & -2
	};
}
function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
var RippleEngine = class {
	gl;
	canvas;
	packed = false;
	simW = 0;
	simH = 0;
	a;
	b;
	simProg;
	dropProg;
	displayProg;
	vao;
	params;
	drops = [];
	pointers = /* @__PURE__ */ new Map();
	raf = 0;
	acc = 0;
	lastT = 0;
	running = false;
	destroyed = false;
	reducedMotion = false;
	time = 0;
	ro = null;
	onLost;
	onRestored;
	onPointerDown;
	onPointerMove;
	onPointerUp;
	onKey;
	listeners = [];
	constructor(canvas, params) {
		this.canvas = canvas;
		this.params = { ...params };
		const gl = canvas.getContext("webgl2", {
			alpha: false,
			antialias: false,
			depth: false,
			stencil: false,
			premultipliedAlpha: false,
			preserveDrawingBuffer: false,
			powerPreference: "high-performance"
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
			if (e.code === "KeyC" && !e.metaKey && !e.ctrlKey && !e.altKey) this.clear();
		};
		this.initGpu();
		this.bindInput();
		this.warmStart();
	}
	setParams(next) {
		this.params = {
			...this.params,
			...next
		};
	}
	clear() {
		const gl = this.gl;
		for (const t of [this.a, this.b]) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
			gl.viewport(0, 0, this.simW, this.simH);
			gl.clearColor(this.packed ? .5 : 0, this.packed ? .5 : 0, 0, 1);
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
		const loop = (now) => {
			if (!this.running) return;
			const raw = (now - this.lastT) / 1e3;
			this.lastT = now;
			const dt = Math.min(raw, .1);
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
		for (const { type, fn, target } of this.listeners) target.removeEventListener(type, fn);
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
	listen(target, type, fn, opts) {
		target.addEventListener(type, fn, opts);
		this.listeners.push({
			type,
			fn,
			target
		});
	}
	initGpu() {
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
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			3,
			-1,
			-1,
			3
		]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		this.vao = vao;
		this.resize(true);
	}
	tryFloat() {
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
	makeTarget(w, h) {
		const gl = this.gl;
		const tex = gl.createTexture();
		const fbo = gl.createFramebuffer();
		if (!tex || !fbo) throw new Error("Unable to allocate surface.");
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		if (this.packed) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
		if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("Framebuffer incomplete.");
		gl.clearColor(this.packed ? .5 : 0, this.packed ? .5 : 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return {
			tex,
			fbo
		};
	}
	deleteTarget(t) {
		if (!t) return;
		this.gl.deleteTexture(t.tex);
		this.gl.deleteFramebuffer(t.fbo);
	}
	resize(force = false) {
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
	bindInput() {
		const canvas = this.canvas;
		canvas.style.touchAction = "none";
		this.listen(canvas, "pointerdown", this.onPointerDown);
		this.listen(canvas, "pointermove", this.onPointerMove);
		this.listen(canvas, "pointerup", this.onPointerUp);
		this.listen(canvas, "pointercancel", this.onPointerUp);
		this.listen(window, "keydown", this.onKey);
		this.listen(canvas, "webglcontextlost", this.onLost);
		this.listen(canvas, "webglcontextrestored", this.onRestored);
		this.listen(canvas, "contextmenu", (e) => e.preventDefault());
		this.ro = new ResizeObserver(() => {
			if (!this.destroyed) this.resize();
		});
		this.ro.observe(canvas.parentElement ?? canvas);
		window.__wake = {
			clear: () => this.clear(),
			drop: (x, y, amp = .45) => {
				this.queueDrop(x, y, amp, .032);
			}
		};
	}
	eventUv(e) {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: clamp((e.clientX - rect.left) / Math.max(rect.width, 1), 0, 1),
			y: clamp(1 - (e.clientY - rect.top) / Math.max(rect.height, 1), 0, 1)
		};
	}
	handleDown(e) {
		if (e.button !== 0 && e.pointerType === "mouse") return;
		e.preventDefault();
		this.canvas.setPointerCapture(e.pointerId);
		const uv = this.eventUv(e);
		this.pointers.set(e.pointerId, {
			...uv,
			down: true
		});
		const amp = this.dropAmp(1);
		this.queueDrop(uv.x, uv.y, amp, this.dropRadius());
	}
	handleMove(e) {
		const uv = this.eventUv(e);
		const prev = this.pointers.get(e.pointerId);
		const down = prev?.down || e.buttons > 0;
		if (!prev) {
			this.pointers.set(e.pointerId, {
				...uv,
				down: false
			});
			if (down) this.stroke(uv.x, uv.y, uv.x, uv.y, true);
			else this.hover(uv.x, uv.y, 0);
			return;
		}
		const dist = Math.hypot(uv.x - prev.x, uv.y - prev.y);
		if (down) this.stroke(prev.x, prev.y, uv.x, uv.y, true);
		else this.hover(uv.x, uv.y, dist);
		this.pointers.set(e.pointerId, {
			...uv,
			down
		});
	}
	handleUp(e) {
		const prev = this.pointers.get(e.pointerId);
		if (prev && e.type === "pointerup") {
			const uv = this.eventUv(e);
			this.stroke(prev.x, prev.y, uv.x, uv.y, true);
		}
		this.pointers.delete(e.pointerId);
		try {
			this.canvas.releasePointerCapture(e.pointerId);
		} catch {}
	}
	hover(x, y, dist) {
		if (dist < .002) return;
		const amp = this.dropAmp(.16 + Math.min(dist * 6, .28));
		this.queueDrop(x, y, amp, this.dropRadius() * .7);
	}
	stroke(x0, y0, x1, y1, strong) {
		const dist = Math.hypot(x1 - x0, y1 - y0);
		const steps = Math.max(1, Math.ceil(dist / .012));
		const impulse = strong ? .7 + Math.min(dist * 8, .9) : .2;
		const amp = this.dropAmp(impulse);
		const radius = this.dropRadius();
		for (let i = 1; i <= steps; i++) {
			const t = i / steps;
			this.queueDrop(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, amp, radius);
		}
	}
	dropAmp(impulse) {
		return (.045 + clamp(this.params.strength, 0, 1) * .4) * impulse;
	}
	dropRadius() {
		return .016 + clamp(this.params.strength, 0, 1) * .026;
	}
	queueDrop(x, y, amp, radius) {
		this.drops.push({
			x: clamp(x, 0, 1),
			y: clamp(y, 0, 1),
			amp,
			radius
		});
	}
	warmStart() {
		this.drops.push(...[
			{
				x: .3,
				y: .56,
				amp: .52,
				radius: .034
			},
			{
				x: .61,
				y: .4,
				amp: .4,
				radius: .03
			},
			{
				x: .47,
				y: .7,
				amp: .32,
				radius: .028
			},
			{
				x: .16,
				y: .32,
				amp: .24,
				radius: .04
			},
			{
				x: .8,
				y: .62,
				amp: .3,
				radius: .032
			},
			{
				x: .72,
				y: .24,
				amp: .22,
				radius: .026
			}
		]);
		this.flushDrops();
		for (let i = 0; i < 28; i++) this.simStep();
	}
	tick(dt) {
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
	damping() {
		return .996 - clamp(this.params.viscosity, 0, 1) ** .9 * .088;
	}
	diffuse() {
		return clamp(this.params.viscosity, 0, 1) * .07;
	}
	simStep() {
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
	flushDrops() {
		if (this.drops.length === 0) return;
		const gl = this.gl;
		const prog = this.dropProg;
		const aspect = this.simW / Math.max(this.simH, 1);
		while (this.drops.length > 0) {
			const batch = this.drops.splice(0, MAX_DROPS);
			const data = /* @__PURE__ */ new Float32Array(48);
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
	render() {
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
	swap() {
		const tmp = this.a;
		this.a = this.b;
		this.b = tmp;
	}
};
var STORAGE_KEY = "wake.v1";
function loadSettings() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULT_PARAMS };
		const parsed = JSON.parse(raw);
		const colorMap = COLOR_MAPS.some((m) => m.id === parsed.colorMap) ? parsed.colorMap : DEFAULT_PARAMS.colorMap;
		return {
			viscosity: clamp01(parsed.viscosity ?? DEFAULT_PARAMS.viscosity),
			strength: clamp01(parsed.strength ?? DEFAULT_PARAMS.strength),
			colorMap
		};
	} catch {
		return { ...DEFAULT_PARAMS };
	}
}
function clamp01(n) {
	if (!Number.isFinite(n)) return 0;
	return Math.min(1, Math.max(0, n));
}
function saveSettings(params) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
	} catch {}
}
function WakeApp() {
	const canvasRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const cursorRef = (0, import_react.useRef)(null);
	const overUiRef = (0, import_react.useRef)(false);
	const [params, setParams] = (0, import_react.useState)(DEFAULT_PARAMS);
	const [hint, setHint] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const initial = loadSettings();
		setParams(initial);
		let engine;
		try {
			engine = new RippleEngine(canvas, initial);
			engine.start();
			engineRef.current = engine;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to start the surface.");
			return;
		}
		const cursor = cursorRef.current;
		let cx = window.innerWidth * .5;
		let cy = window.innerHeight * .5;
		let tx = cx;
		let ty = cy;
		let visible = false;
		let raf = 0;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const onMove = (e) => {
			tx = e.clientX;
			ty = e.clientY;
			visible = e.pointerType === "mouse";
		};
		const onLeave = () => {
			visible = false;
		};
		const tick = () => {
			const k = reduced ? 1 : .22;
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
	const update = (0, import_react.useCallback)((patch) => {
		setParams((prev) => {
			const next = {
				...prev,
				...patch
			};
			engineRef.current?.setParams(next);
			saveSettings(next);
			return next;
		});
	}, []);
	const clear = (0, import_react.useCallback)(() => {
		engineRef.current?.clear();
		setHint(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full select-none overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 size-full cursor-none touch-none bg-bg",
				"aria-label": "Fluid ripple surface"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: cursorRef,
				"aria-hidden": "true",
				className: "pointer-events-none fixed top-0 left-0 z-30 size-5 rounded-full border border-accent/70 opacity-0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "pointer-events-none absolute top-0 left-0 z-10 p-4 pt-[max(1rem,env(safe-area-inset-top))] md:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 items-center justify-center rounded-sm bg-surface text-accent shadow-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, {
							className: "size-4",
							strokeWidth: 1.75,
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl leading-tight tracking-tight italic md:text-3xl",
						children: "Wake"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted",
						children: "Fluid surface"
					})] })]
				})
			}),
			hint && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute top-1/4 left-1/2 z-10 max-w-sm -translate-x-1/2 px-6 text-center font-display text-lg tracking-tight text-fg/80 italic md:text-xl",
				children: "Drag across the surface"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-20 flex items-center justify-center p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm rounded-lg bg-surface p-4 text-sm leading-normal text-muted shadow-border",
					children: error
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "absolute right-4 bottom-4 left-4 z-10 mb-[env(safe-area-inset-bottom)] md:right-auto md:bottom-6 md:left-6 md:w-80",
				onPointerEnter: () => {
					overUiRef.current = true;
				},
				onPointerLeave: () => {
					overUiRef.current = false;
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg bg-surface/95 p-4 shadow-border backdrop-blur-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
								label: "Viscosity",
								value: params.viscosity,
								onChange: (v) => update({ viscosity: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
								label: "Wave strength",
								value: params.strength,
								onChange: (v) => update({ strength: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "mb-2 text-xs font-medium tracking-wide text-muted",
									children: "Color map"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-1.5",
									children: COLOR_MAPS.map((map) => {
										const active = map.id === params.colorMap;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": active,
											onClick: () => update({ colorMap: map.id }),
											className: cn("h-11 rounded-sm text-sm font-medium tracking-wide", "transition-[background-color,color,transform] duration-150 ease-out", "active:scale-[0.96]", active ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg hover:bg-surface-2/80"),
											children: map.label
										}, map.id);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: clear,
								className: cn("flex h-11 w-full items-center justify-center gap-2 rounded-sm", "bg-surface-2 text-sm font-medium text-fg shadow-border", "transition-[background-color,transform] duration-150 ease-out", "hover:bg-surface-2/80 active:scale-[0.96]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
									className: "size-4",
									strokeWidth: 1.75,
									"aria-hidden": "true"
								}), "Clear surface"]
							})
						]
					})
				})
			})
		]
	});
}
function SliderField({ label, value, onChange }) {
	const pct = Math.round(value * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-w-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium tracking-wide text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tabular-nums text-faint",
				children: pct
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "wake-range",
			type: "range",
			min: 0,
			max: 100,
			step: 1,
			value: pct,
			"aria-valuemin": 0,
			"aria-valuemax": 100,
			"aria-valuenow": pct,
			"aria-label": label,
			style: { ["--fill"]: `${pct}%` },
			onChange: (e) => onChange(Number(e.target.value) / 100)
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WakeApp, {});
}
//#endregion
export { Home as component };
