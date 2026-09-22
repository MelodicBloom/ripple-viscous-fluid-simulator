import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RotateCcw, c as CircleDot, i as Tornado, n as Undo2, o as Droplets, s as Download, t as Waves } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BNC5JPU-.js
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
	},
	{
		id: "film",
		label: "Film"
	},
	{
		id: "oil",
		label: "Oil"
	},
	{
		id: "chrome",
		label: "Chrome"
	},
	{
		id: "cell",
		label: "Cell"
	},
	{
		id: "prism",
		label: "Prism"
	},
	{
		id: "nacre",
		label: "Nacre"
	}
];
var WAVE_MODES = [
	{
		id: "pulse",
		label: "Pulse",
		key: "Space"
	},
	{
		id: "ring",
		label: "Ring",
		key: "R"
	},
	{
		id: "swirl",
		label: "Swirl",
		key: "V"
	}
];
var STRENGTH_PRESETS = [
	{
		id: "soft",
		label: "Soft",
		value: .28,
		key: "1"
	},
	{
		id: "wake",
		label: "Wake",
		value: .62,
		key: "2"
	},
	{
		id: "gale",
		label: "Gale",
		value: 1,
		key: "3"
	}
];
var DEFAULT_PARAMS = {
	viscosity: .28,
	strength: .62,
	colorMap: "abyss",
	area: .42,
	thickness: .22,
	density: .24,
	bubbles: .12,
	frequency: .62,
	interference: .16,
	lightAz: .18,
	lightEl: .7,
	lightInt: .72,
	lightSoft: .32,
	waveMode: "pulse"
};
var RECIPES = [
	{
		id: "water",
		label: "Water",
		patch: {
			thickness: .22,
			density: .22,
			bubbles: .16,
			frequency: .62,
			interference: .22,
			viscosity: .28,
			colorMap: "abyss"
		}
	},
	{
		id: "oil",
		label: "Oil",
		patch: {
			thickness: .82,
			density: .84,
			bubbles: .38,
			frequency: .42,
			interference: .52,
			viscosity: .52,
			colorMap: "oil"
		}
	},
	{
		id: "soap",
		label: "Soap",
		patch: {
			thickness: .92,
			density: .48,
			bubbles: .86,
			frequency: .58,
			interference: .74,
			viscosity: .22,
			colorMap: "film"
		}
	},
	{
		id: "chrome",
		label: "Chrome",
		patch: {
			thickness: .62,
			density: .16,
			bubbles: .1,
			frequency: .48,
			interference: .36,
			viscosity: .4,
			lightSoft: .08,
			lightInt: .86,
			colorMap: "chrome"
		}
	},
	{
		id: "cell",
		label: "Cell",
		patch: {
			thickness: .56,
			density: .9,
			bubbles: .28,
			frequency: .36,
			interference: .38,
			viscosity: .6,
			colorMap: "cell"
		}
	},
	{
		id: "prism",
		label: "Prism",
		patch: {
			thickness: .72,
			density: .4,
			bubbles: .24,
			frequency: .74,
			interference: .88,
			viscosity: .2,
			colorMap: "prism"
		}
	}
];
var COLOR_INDEX = {
	abyss: 0,
	ember: 1,
	glacier: 2,
	ink: 3,
	bloom: 4,
	solar: 5,
	film: 6,
	oil: 7,
	chrome: 8,
	cell: 9,
	prism: 10,
	nacre: 11
};
var MAX_DROPS = 12;
var MAX_VORTICES = 6;
var UNDO_SLOTS = 4;
var SIM_STEP = 1 / 60;
var TIER_LONG = {
	low: 384,
	mid: 640,
	high: 960
};
var TIER_STEPS = {
	low: 1,
	mid: 2,
	high: 3
};
var TIER_DPR = {
	low: 1.5,
	mid: 2,
	high: 2
};
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
uniform sampler2D uFilm;
uniform vec2 uTexel;
uniform float uDamping;
uniform float uFreq;
uniform float uDensity;
out vec4 fragColor;

${COMMON}

vec2 mirrorUv(vec2 uv) {
  uv = abs(uv);
  uv = 1.0 - abs(uv - 1.0);
  return clamp(uv, 0.0, 1.0);
}

float sampleH(vec2 uv) {
  return decode(texture(uState, mirrorUv(uv)));
}

void main() {
  vec4 c = texture(uState, vUv);
  float h = decode(c);
#ifdef PACKED
  float p = c.g * 2.0 - 1.0;
#else
  float p = c.g;
#endif
  vec2 t = uTexel;
  float n4 =
    sampleH(vUv + vec2(t.x, 0.0)) +
    sampleH(vUv - vec2(t.x, 0.0)) +
    sampleH(vUv + vec2(0.0, t.y)) +
    sampleH(vUv - vec2(0.0, t.y));
  float n8 =
    sampleH(vUv + vec2( t.x,  t.y)) +
    sampleH(vUv + vec2(-t.x,  t.y)) +
    sampleH(vUv + vec2( t.x, -t.y)) +
    sampleH(vUv + vec2(-t.x, -t.y));
  float avg = (n4 + 0.5 * n8) / 6.0;
  vec3 film = texture(uFilm, vUv).rgb;
  float mass = film.r * 0.55 + film.g * 0.45;
  float lap = avg - h;
  float c2 = mix(0.52, 0.92, uFreq);
  float hNew = (2.0 * h - p + lap * c2) * uDamping;
  float edge = max(max(vUv.x, 1.0 - vUv.x), max(vUv.y, 1.0 - vUv.y));
  float wall = smoothstep(0.93, 1.0, edge);
  hNew *= mix(1.0, 0.9, wall);
  hNew *= mix(1.0, 0.988, mass * uDensity);
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
uniform int uMode;
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
    float r = length(d);
    float r2 = (r * r) / (sig * sig);
    float amp = uDrops[i].z;
    if (uMode == 1) {
      float ring = r / sig - 1.2;
      add += amp * 1.15 * exp(-ring * ring * 7.0);
    } else if (uMode == 2) {
      add += amp * 0.72 * exp(-r2 * 0.85);
      add += amp * 0.38 * exp(-r2) * (d.x + d.y) / max(sig, 0.001);
    } else {
      add += amp * exp(-r2);
    }
  }
  h = clamp(h + add, -2.8, 2.8);
  vec2 enc = encodePair(h, p);
  fragColor = vec4(enc, 0.0, 1.0);
}
`;
var FILM_SIM_FRAG = `
in vec2 vUv;
uniform sampler2D uFilm;
uniform sampler2D uHeight;
uniform vec2 uTexel;
uniform float uAspect;
uniform float uDensity;
uniform float uVisc;
uniform float uBubble;
uniform vec4 uVortex[6];
uniform int uVortexCount;
out vec4 fragColor;

${COMMON}

void main() {
  float hL = decode(texture(uHeight, vUv + vec2(uTexel.x, 0.0)));
  float hR = decode(texture(uHeight, vUv - vec2(uTexel.x, 0.0)));
  float hU = decode(texture(uHeight, vUv + vec2(0.0, uTexel.y)));
  float hD = decode(texture(uHeight, vUv - vec2(0.0, uTexel.y)));
  vec2 grad = vec2(hL - hR, hD - hU);
  grad.x *= uAspect;
  vec2 curl = vec2(-grad.y, grad.x);
  vec2 flow = grad * (0.04 + uDensity * 0.22) + curl * (0.07 + uDensity * 0.18);
  for (int i = 0; i < 6; i++) {
    if (i >= uVortexCount) break;
    vec2 d = vUv - uVortex[i].xy;
    d.x *= uAspect;
    float rad = max(uVortex[i].w, 0.02);
    float env = exp(-dot(d, d) / (rad * rad));
    vec2 tang = vec2(-d.y, d.x);
    flow += tang * uVortex[i].z * env * 2.4;
  }

  vec2 srcUv = clamp(vUv - flow * 0.28, 0.001, 0.999);
  vec4 f = texture(uFilm, srcUv);
  float pigment = f.r;
  float thick = f.g;
  float foam = f.b;

  vec4 n1 = texture(uFilm, vUv + vec2(uTexel.x, 0.0));
  vec4 n2 = texture(uFilm, vUv - vec2(uTexel.x, 0.0));
  vec4 n3 = texture(uFilm, vUv + vec2(0.0, uTexel.y));
  vec4 n4 = texture(uFilm, vUv - vec2(0.0, uTexel.y));
  float pAvg = (n1.r + n2.r + n3.r + n4.r) * 0.25;
  float tAvg = (n1.g + n2.g + n3.g + n4.g) * 0.25;
  float lap = pAvg - pigment;

  float diff = mix(0.045, 0.006, uVisc);
  pigment = mix(pigment, pAvg, diff);
  thick = mix(thick, tAvg, diff * 0.7);

  float sep = uDensity * 2.2;
  pigment += clamp(lap * (pigment - 0.4) * sep, -0.14, 0.14);

  thick *= mix(0.9994, 0.9975, 1.0 - uVisc);
  thick += pigment * 0.0035 * uDensity;
  thick = clamp(thick, 0.0, 1.0);
  pigment = clamp(pigment, 0.0, 1.0);

  float hNow = decode(texture(uHeight, vUv));
  float thrash = length(grad) * 3.4 + max(-(hL + hR + hU + hD - 4.0 * hNow), 0.0) * 2.6 + max(hNow, 0.0);
  foam += thrash * uBubble * (0.22 + pigment * 0.55) * 0.055;
  foam *= mix(0.97, 0.945, uBubble);
  foam = clamp(foam, 0.0, 1.0);

  fragColor = vec4(pigment, thick, foam, 1.0);
}
`;
var FILM_DROP_FRAG = `
in vec2 vUv;
uniform sampler2D uFilm;
uniform vec4 uDrops[12];
uniform vec4 uMatter[12];
uniform int uCount;
uniform int uMode;
uniform float uAspect;
out vec4 fragColor;

void main() {
  vec4 f = texture(uFilm, vUv);
  for (int i = 0; i < 12; i++) {
    if (i >= uCount) break;
    vec2 d = vUv - uDrops[i].xy;
    d.x *= uAspect;
    float sig = max(uDrops[i].w, 0.0008);
    float r = length(d);
    float g = exp(-dot(d, d) / (sig * sig));
    if (uMode == 1) {
      float ring = r / sig - 1.15;
      g = exp(-ring * ring * 6.5);
    } else if (uMode == 2) {
      g *= 0.85;
    }
    f.r = clamp(f.r + uMatter[i].x * g, 0.0, 1.0);
    f.g = clamp(f.g + uMatter[i].y * g, 0.0, 1.0);
    f.b = clamp(f.b + uMatter[i].z * g, 0.0, 1.0);
  }
  fragColor = vec4(f.rgb, 1.0);
}
`;
var DISPLAY_FRAG = `
in vec2 vUv;
uniform sampler2D uState;
uniform sampler2D uFilm;
uniform vec2 uTexel;
uniform int uMap;
uniform float uTime;
uniform float uAspect;
uniform float uThickness;
uniform float uDensity;
uniform float uBubbles;
uniform float uFreq;
uniform float uInterfere;
uniform float uLightAz;
uniform float uLightEl;
uniform float uLightInt;
uniform float uLightSoft;
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

vec3 sampleF(vec2 uv) {
  vec2 res = vec2(1.0 / max(uTexel.x, 1e-6), 1.0 / max(uTexel.y, 1e-6));
  vec2 p = uv * res - 0.5;
  vec2 f = fract(p);
  vec2 i = floor(p);
  vec2 u0 = (i + 0.5) * uTexel;
  vec3 a = texture(uFilm, u0).rgb;
  vec3 b = texture(uFilm, u0 + vec2(uTexel.x, 0.0)).rgb;
  vec3 c = texture(uFilm, u0 + vec2(0.0, uTexel.y)).rgb;
  vec3 d = texture(uFilm, u0 + uTexel).rgb;
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
      vec3(0.28, 0.08, 0.05),
      vec3(0.62, 0.16, 0.06),
      vec3(0.98, 0.42, 0.16),
      vec3(1.0, 0.88, 0.52));
  }
  if (id == 2) {
    return ramp(t,
      vec3(0.12, 0.28, 0.4),
      vec3(0.16, 0.48, 0.62),
      vec3(0.42, 0.82, 0.92),
      vec3(0.92, 0.98, 1.0));
  }
  if (id == 3) {
    return ramp(t,
      vec3(0.18, 0.2, 0.24),
      vec3(0.32, 0.36, 0.42),
      vec3(0.58, 0.62, 0.68),
      vec3(0.92, 0.94, 0.96));
  }
  if (id == 4) {
    return ramp(t,
      vec3(0.06, 0.2, 0.14),
      vec3(0.06, 0.46, 0.28),
      vec3(0.22, 0.9, 0.52),
      vec3(0.86, 1.0, 0.76));
  }
  if (id == 5) {
    return ramp(t,
      vec3(0.08, 0.16, 0.36),
      vec3(0.08, 0.38, 0.74),
      vec3(0.16, 0.82, 0.78),
      vec3(0.98, 0.88, 0.36));
  }
  if (id == 6) {
    return ramp(t,
      vec3(0.16, 0.12, 0.32),
      vec3(0.08, 0.48, 0.78),
      vec3(0.95, 0.18, 0.62),
      vec3(0.98, 0.9, 0.42));
  }
  if (id == 7) {
    return ramp(t,
      vec3(0.08, 0.2, 0.26),
      vec3(0.06, 0.4, 0.48),
      vec3(0.82, 0.14, 0.48),
      vec3(0.98, 0.76, 0.18));
  }
  if (id == 8) {
    return ramp(t,
      vec3(0.28, 0.32, 0.38),
      vec3(0.42, 0.5, 0.58),
      vec3(0.7, 0.78, 0.86),
      vec3(0.96, 0.96, 0.94));
  }
  if (id == 9) {
    return ramp(t,
      vec3(0.08, 0.24, 0.24),
      vec3(0.08, 0.52, 0.42),
      vec3(0.86, 0.16, 0.48),
      vec3(0.98, 0.84, 0.28));
  }
  if (id == 10) {
    return ramp(t,
      vec3(0.1, 0.16, 0.32),
      vec3(0.06, 0.62, 0.92),
      vec3(0.95, 0.12, 0.58),
      vec3(0.98, 0.92, 0.2));
  }
  if (id == 11) {
    return ramp(t,
      vec3(0.32, 0.3, 0.36),
      vec3(0.52, 0.62, 0.74),
      vec3(0.88, 0.52, 0.7),
      vec3(0.98, 0.92, 0.78));
  }
  return ramp(t,
    vec3(0.06, 0.22, 0.28),
    vec3(0.08, 0.42, 0.5),
    vec3(0.22, 0.78, 0.82),
    vec3(0.9, 0.97, 0.94));
}

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

vec3 airyFilm(float d, float cosI, float freq) {
  float path = d * mix(1.4, 4.4, freq);
  float delta = 12.566371 * path * max(cosI, 0.05);
  vec3 lam = vec3(0.68, 0.53, 0.42);
  vec3 R = sin(delta / lam);
  R *= R;
  float envelope = smoothstep(0.012, 0.09, d);
  vec3 wet = vec3(0.12, 0.32, 0.38);
  return mix(wet, pow(R, vec3(0.82)), envelope);
}

void main() {
  float chroma = uInterfere * 0.018;
  vec2 offR = vec2(chroma, 0.0);
  vec2 offB = vec2(-chroma, chroma * 0.4);

  float h = sampleH(vUv);
  float hR = sampleH(vUv + offR);
  float hB = sampleH(vUv + offB);
  float hl = sampleH(vUv - vec2(uTexel.x, 0.0));
  float hr = sampleH(vUv + vec2(uTexel.x, 0.0));
  float hd = sampleH(vUv - vec2(0.0, uTexel.y));
  float hu = sampleH(vUv + vec2(0.0, uTexel.y));

  vec3 film = sampleF(vUv);
  float pigment = film.r;
  float thick = film.g;
  float foam = film.b;
  vec3 fL = sampleF(vUv - vec2(uTexel.x, 0.0));
  vec3 fR = sampleF(vUv + vec2(uTexel.x, 0.0));
  vec3 fD = sampleF(vUv - vec2(0.0, uTexel.y));
  vec3 fU = sampleF(vUv + vec2(0.0, uTexel.y));
  vec2 fGrad = vec2((fR.r + fR.g) - (fL.r + fL.g), (fU.r + fU.g) - (fD.r + fD.g));
  float vein = length(fGrad);
  float marbleAng = atan(fGrad.y, fGrad.x);

  vec3 n = normalize(vec3((hl - hr) * 4.2, 2.2, (hd - hu) * 4.2));
  float az = uLightAz * 6.283185;
  float el = mix(0.12, 1.38, uLightEl);
  vec3 light = normalize(vec3(cos(az) * cos(el), sin(el), sin(az) * cos(el)));
  vec3 view = vec3(0.0, 1.0, 0.0);
  float wrap = mix(0.0, 0.42, uLightSoft);
  float ndl = clamp((dot(n, light) + wrap) / (1.0 + wrap), 0.0, 1.0);
  vec3 halfV = normalize(light + view);
  float sharpness = mix(110.0, 16.0, uLightSoft);
  float spec = pow(clamp(dot(n, halfV), 0.0, 1.0), sharpness);
  float fres = pow(clamp(1.0 - n.y, 0.0, 1.0), 1.7);
  float ndv = max(dot(n, view), 0.04);

  float t = clamp(0.54 + h * 0.18 + ndl * 0.05, 0.28, 0.86);
  float marbleT = clamp(t + pigment * 0.22 + marbleAng * 0.04 + thick * 0.12, 0.2, 0.95);
  vec3 water = palette(uMap, t);
  vec3 marble = palette(uMap, marbleT);
  vec3 albedo = mix(water, marble, clamp(pigment * (0.4 + uDensity * 0.4), 0.0, 0.82));

  float pathH = mix(h, hR, 0.5);
  float h2 = sampleH(vUv + n.xz * (0.012 + uInterfere * 0.045));
  float beat = 0.5 + 0.5 * sin(pathH * (22.0 + uFreq * 56.0) + h2 * (16.0 + uInterfere * 36.0));
  float lap = (hl + hr + hu + hd) - 4.0 * h;
  float caustic = pow(clamp(-lap * 6.2, 0.0, 1.0), 1.2);
  caustic = mix(caustic, caustic * beat, uInterfere);
  float star = pow(caustic, 2.4) * (0.45 + 0.55 * abs(sin(pathH * 48.0 + uTime * 0.4)));

  float path = mix(0.12, 1.35, uThickness) * (0.18 + thick * 1.7 + abs(h) * 0.22 + pigment * 0.2);
  float cosI = mix(ndv, ndl, 0.58);
  vec3 filmCol = airyFilm(path, cosI, uFreq);
  float filmAmt = mix(0.03, 0.62, uThickness) * (thick * 1.05 + pigment * 0.75);

  vec3 specCol = mix(vec3(0.85, 0.93, 1.0), filmCol, 0.55);
  vec3 color = albedo * (0.78 + 0.28 * ndl);
  color += spec * specCol * mix(0.55, 1.35, 1.0 - uLightSoft);
  color += caustic * mix(albedo, specCol, 0.45) * 1.15;
  color += star * specCol * 0.55;
  color = mix(color, specCol, fres * 0.18);

  vec3 soap = color * 0.62 + filmCol * 1.15;
  color = mix(color, soap, clamp(filmAmt, 0.0, 0.55));

  vec3 veinCol = mix(vec3(0.98, 0.78, 0.28), mix(filmCol, albedo, 0.25), 0.4);
  color = mix(color, veinCol * 1.15, clamp(vein * (1.2 + uDensity * 2.4), 0.0, 0.7));

  float metal = smoothstep(0.28, 0.75, uThickness * (1.0 - uDensity * 0.45));
  vec3 env = airyFilm(0.34 + n.x * 0.5 + n.z * 0.3, ndv, 0.7);
  float band = abs(dot(normalize(n.xz + 1e-4), vec2(cos(az), sin(az))));
  float cateye = pow(1.0 - clamp(band, 0.0, 1.0), mix(2.2, 7.5, 1.0 - uLightSoft));
  vec3 chrome = mix(albedo * 0.32, env, 0.55 + fres * 0.4) + spec * vec3(0.96, 0.97, 1.0) * 1.55;
  chrome += cateye * mix(vec3(0.35, 0.82, 1.0), vec3(1.0, 0.78, 0.28), pigment) * 0.9;
  color = mix(color, chrome, metal * 0.72);

  if (uInterfere > 0.02) {
    vec3 split = vec3(
      palette(uMap, clamp(hR * 1.4 + 0.4, 0.0, 1.0)).r,
      albedo.g,
      palette(uMap, clamp(hB * 1.4 + 0.4, 0.0, 1.0)).b
    );
    color = mix(color, split, uInterfere * 0.32);
  }

  vec2 buv = vec2(vUv.x * uAspect, vUv.y) * mix(10.0, 28.0, 1.0 - uBubbles);
  vec2 gid = floor(buv);
  vec2 fuv = fract(buv);
  float dmin = 8.0;
  vec2 bOff = vec2(0.0);
  float bRad = 0.22;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 cell = gid + vec2(float(i), float(j));
      vec2 o = hash2(cell);
      float rad = 0.16 + hash(cell + 1.7) * 0.18;
      vec2 r = vec2(float(i), float(j)) + o - fuv;
      float d = length(r) / max(rad, 0.08);
      if (d < dmin) {
        dmin = d;
        bOff = r;
        bRad = rad;
      }
    }
  }
  float inside = 1.0 - smoothstep(0.82, 1.02, dmin);
  float live = inside * smoothstep(0.16, 0.52, foam) * uBubbles;
  vec3 bN = vec3(bOff / max(bRad, 0.08), sqrt(max(0.0, 1.0 - dmin * dmin)));
  bN = normalize(bN + vec3(0.0, 0.0, 0.001));
  float bNdv = max(bN.z, 0.04);
  float bSpec = pow(clamp(dot(bN, light), 0.0, 1.0), 42.0);
  float bRim = pow(1.0 - bNdv, 1.6);
  vec3 bFilm = airyFilm(0.22 + (1.0 - bNdv) * 0.7, bNdv, 0.8);
  vec3 bCol = mix(albedo, bFilm * 1.45, 0.72) + vec3(0.95, 0.97, 1.0) * bSpec * 1.8;
  bCol += bRim * mix(vec3(0.75, 0.9, 1.0), filmCol, 0.5) * 0.9;
  color = mix(color, bCol, clamp(live, 0.0, 0.88));

  float foamCap = smoothstep(0.16, 0.34, h) * (0.28 + foam);
  color = mix(color, mix(vec3(0.94, 0.97, 1.0), filmCol, 0.25), foamCap * 0.32);

  float spark = pow(hash(vUv * 480.0 + n.xz * 8.0), mix(16.0, 7.0, uBubbles));
  color += spark * spec * specCol * (0.16 + uThickness * 0.4);

  float breath = 0.97 + 0.03 * sin(uTime * 0.62);
  color *= mix(0.92, 1.28, uLightInt) * breath;
  float vig = 1.0 - 0.26 * dot(vUv - 0.5, vUv - 0.5);
  color *= vig;
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.025;
  color = max(color, vec3(0.0));
  color = pow(color, vec3(0.9));
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
function classifyTier() {
	const mem = navigator.deviceMemory ?? 8;
	const cores = navigator.hardwareConcurrency ?? 8;
	const mobile = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
	if (mem <= 4 || mobile && cores <= 6) return "low";
	if (!mobile && mem >= 8 && cores >= 8) return "high";
	return "mid";
}
function simSize(cssW, cssH, longSide) {
	const aspect = cssW / Math.max(cssH, 1);
	let w;
	let h;
	if (aspect >= 1) {
		w = longSide;
		h = Math.max(96, Math.round(longSide / aspect));
	} else {
		h = longSide;
		w = Math.max(96, Math.round(longSide * aspect));
	}
	return {
		w: w & -2,
		h: h & -2
	};
}
function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
var MODE_INDEX = {
	pulse: 0,
	ring: 1,
	swirl: 2
};
var GAME_CODES = /* @__PURE__ */ new Set([
	"Space",
	"KeyC",
	"KeyR",
	"KeyV",
	"KeyB",
	"KeyW",
	"KeyA",
	"KeyS",
	"KeyD",
	"Digit1",
	"Digit2",
	"Digit3",
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"BracketLeft",
	"BracketRight",
	"KeyQ",
	"KeyE",
	"KeyZ",
	"KeyF"
]);
var RippleEngine = class {
	gl;
	canvas;
	packed = false;
	simW = 0;
	simH = 0;
	a;
	b;
	filmA;
	filmB;
	simProg;
	dropProg;
	filmSimProg;
	filmDropProg;
	displayProg;
	vao;
	params;
	drops = [];
	vortices = [];
	undoH = [];
	undoF = [];
	undoCount = 0;
	strokeSnap = false;
	tier = "mid";
	slowFrames = 0;
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
	onKeyDown;
	onKeyUp;
	onBlur;
	keys = /* @__PURE__ */ new Set();
	lastPointer = {
		x: .5,
		y: .5
	};
	edgeCool = 0;
	onParams;
	listeners = [];
	constructor(canvas, params, opts) {
		this.canvas = canvas;
		this.params = {
			...DEFAULT_PARAMS,
			...params
		};
		this.onParams = opts?.onParams;
		this.tier = classifyTier();
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
		this.onKeyDown = (e) => this.handleKeyDown(e);
		this.onKeyUp = (e) => this.keys.delete(e.code);
		this.onBlur = () => this.keys.clear();
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
		for (const t of [this.filmA, this.filmB]) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
			gl.viewport(0, 0, this.simW, this.simH);
			gl.clearColor(0, 0, 0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		this.drops.length = 0;
		this.vortices.length = 0;
		this.undoCount = 0;
	}
	undo() {
		if (this.undoCount <= 0) return;
		this.undoCount -= 1;
		const h = this.undoH[this.undoCount];
		const f = this.undoF[this.undoCount];
		if (!h || !f) return;
		this.copyTarget(h, this.a);
		this.copyTarget(h, this.b);
		this.copyTarget(f, this.filmA);
		this.copyTarget(f, this.filmB);
	}
	exportPng() {
		this.render();
		return new Promise((resolve) => {
			this.canvas.toBlob((blob) => {
				if (!blob) {
					resolve();
					return;
				}
				const a = document.createElement("a");
				a.href = URL.createObjectURL(blob);
				a.download = `wake-${Date.now()}.png`;
				a.click();
				URL.revokeObjectURL(a.href);
				resolve();
			}, "image/png");
		});
	}
	snapshotUndo() {
		if (this.undoCount >= UNDO_SLOTS) {
			const h0 = this.undoH.shift();
			const f0 = this.undoF.shift();
			if (h0) this.undoH.push(h0);
			if (f0) this.undoF.push(f0);
			this.undoCount = 3;
		}
		const slot = this.undoCount;
		if (!this.undoH[slot] || !this.undoF[slot]) return;
		this.copyTarget(this.a, this.undoH[slot]);
		this.copyTarget(this.filmA, this.undoF[slot]);
		this.undoCount += 1;
	}
	copyTarget(src, dst) {
		const gl = this.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, src.fbo);
		gl.bindTexture(gl.TEXTURE_2D, dst.tex);
		gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, this.simW, this.simH);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	ageVortices(dt) {
		for (const v of this.vortices) v.life -= dt * .38;
		this.vortices = this.vortices.filter((v) => v.life > .02);
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
		gl.deleteProgram(this.filmSimProg);
		gl.deleteProgram(this.filmDropProg);
		gl.deleteProgram(this.displayProg);
		this.deleteTarget(this.a);
		this.deleteTarget(this.b);
		this.deleteTarget(this.filmA);
		this.deleteTarget(this.filmB);
		for (const t of this.undoH) this.deleteTarget(t);
		for (const t of this.undoF) this.deleteTarget(t);
		this.undoH = [];
		this.undoF = [];
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
		this.filmSimProg = link(gl, VERT, shaderSrc(FILM_SIM_FRAG, packed));
		this.filmDropProg = link(gl, VERT, shaderSrc(FILM_DROP_FRAG, packed));
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
	makeTarget(w, h, film) {
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
		if (film) gl.clearColor(0, 0, 0, 1);
		else gl.clearColor(this.packed ? .5 : 0, this.packed ? .5 : 0, 0, 1);
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
		const dprCap = TIER_DPR[this.tier];
		const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
		const cssW = Math.max(1, canvas.clientWidth);
		const cssH = Math.max(1, canvas.clientHeight);
		const pxW = Math.max(1, Math.round(cssW * dpr));
		const pxH = Math.max(1, Math.round(cssH * dpr));
		if (canvas.width !== pxW || canvas.height !== pxH) {
			canvas.width = pxW;
			canvas.height = pxH;
		}
		const { w, h } = simSize(cssW, cssH, TIER_LONG[this.tier]);
		if (!force && w === this.simW && h === this.simH) return;
		this.simW = w;
		this.simH = h;
		this.deleteTarget(this.a);
		this.deleteTarget(this.b);
		this.deleteTarget(this.filmA);
		this.deleteTarget(this.filmB);
		for (const t of this.undoH) this.deleteTarget(t);
		for (const t of this.undoF) this.deleteTarget(t);
		this.a = this.makeTarget(w, h, false);
		this.b = this.makeTarget(w, h, false);
		this.filmA = this.makeTarget(w, h, true);
		this.filmB = this.makeTarget(w, h, true);
		this.undoH = [];
		this.undoF = [];
		for (let i = 0; i < UNDO_SLOTS; i++) {
			this.undoH.push(this.makeTarget(w, h, false));
			this.undoF.push(this.makeTarget(w, h, true));
		}
		this.undoCount = 0;
	}
	bindInput() {
		const canvas = this.canvas;
		canvas.style.touchAction = "none";
		this.listen(canvas, "pointerdown", this.onPointerDown);
		this.listen(canvas, "pointermove", this.onPointerMove);
		this.listen(canvas, "pointerup", this.onPointerUp);
		this.listen(canvas, "pointercancel", this.onPointerUp);
		this.listen(window, "keydown", this.onKeyDown);
		this.listen(window, "keyup", this.onKeyUp);
		this.listen(window, "blur", this.onBlur);
		this.listen(document, "visibilitychange", this.onBlur);
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
				this.queueStroke(x, y, amp, this.dropRadius(), true, 0);
			},
			setParams: (p) => this.setParams(p),
			trigger: (mode, x = .5, y = .5) => {
				const m = MODE_INDEX[mode] ?? 0;
				this.emitWave(x, y, m, 1);
			},
			setKeys: (codes) => {
				this.keys.clear();
				for (const c of codes) this.keys.add(c);
			},
			getState: () => ({
				waveMode: this.params.waveMode,
				strength: this.params.strength,
				lightAz: this.params.lightAz,
				lightEl: this.params.lightEl,
				keys: [...this.keys],
				tier: this.tier,
				undo: this.undoCount
			}),
			undo: () => this.undo(),
			exportPng: () => void this.exportPng()
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
		try {
			this.canvas.setPointerCapture(e.pointerId);
		} catch {}
		const uv = this.eventUv(e);
		this.lastPointer = uv;
		this.pointers.set(e.pointerId, {
			...uv,
			down: true
		});
		if (!this.strokeSnap) {
			this.snapshotUndo();
			this.strokeSnap = true;
		}
		this.queueStroke(uv.x, uv.y, this.dropAmp(1), this.dropRadius(), true);
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
		this.lastPointer = uv;
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
		if (this.pointers.size === 0) this.strokeSnap = false;
		try {
			this.canvas.releasePointerCapture(e.pointerId);
		} catch {}
	}
	hover(x, y, dist) {
		if (dist < .002) return;
		const amp = this.dropAmp(.16 + Math.min(dist * 6, .28));
		this.queueStroke(x, y, amp, this.dropRadius() * .7, false, 0);
	}
	stroke(x0, y0, x1, y1, strong) {
		const dist = Math.hypot(x1 - x0, y1 - y0);
		const spacing = .016 + this.dropRadius() * .55;
		const steps = Math.max(1, Math.ceil(dist / spacing));
		const impulse = strong ? .5 + Math.min(dist * 5, .65) : .16;
		const amp = this.dropAmp(impulse);
		const radius = this.dropRadius();
		for (let i = 1; i <= steps; i++) {
			const t = i / steps;
			this.queueStroke(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, amp, radius, strong);
		}
	}
	dropAmp(impulse) {
		return (.09 + clamp(this.params.strength, 0, 1) * .46) * impulse;
	}
	dropRadius() {
		return .01 + clamp(this.params.area, 0, 1) * .055;
	}
	queueDrop(x, y, amp, radius) {
		this.queueStroke(x, y, amp, radius, true);
	}
	currentMode() {
		return MODE_INDEX[this.params.waveMode] ?? 0;
	}
	emitWave(x, y, mode, impulse) {
		this.snapshotUndo();
		const radius = this.dropRadius() * (mode === 1 ? 1.35 : mode === 2 ? 1.6 : 1);
		this.queueStroke(x, y, this.dropAmp(impulse), radius, true, mode);
	}
	queueStroke(x, y, amp, radius, paint, mode) {
		const density = clamp(this.params.density, 0, 1);
		const thickness = clamp(this.params.thickness, 0, 1);
		const bubbles = clamp(this.params.bubbles, 0, 1);
		const pigment = paint ? density * (.5 + Math.abs(amp) * 1.15) : density * .08;
		const thick = paint ? thickness * (.42 + Math.abs(amp) * .9) : thickness * .06;
		let foam = paint ? bubbles * (.28 + Math.abs(amp) * .7) : bubbles * .05;
		const m = mode ?? (paint ? this.currentMode() : 0);
		if (m === 2) {
			foam *= 1.35;
			const nx = clamp(x, 0, 1);
			const ny = clamp(y, 0, 1);
			const addK = (amp >= 0 ? 1 : -1) * (.28 + Math.abs(amp) * 1.8);
			const near = this.vortices.find((v) => Math.hypot(v.x - nx, v.y - ny) < .09);
			if (near) {
				near.k = near.k * .65 + addK * .55;
				near.life = Math.min(1, near.life + .4);
				near.rad = Math.max(near.rad, radius * 3.4);
				near.x = near.x * .7 + nx * .3;
				near.y = near.y * .7 + ny * .3;
			} else {
				this.vortices.unshift({
					x: nx,
					y: ny,
					k: addK,
					rad: Math.max(radius * 3.4, .06),
					life: 1
				});
				if (this.vortices.length > MAX_VORTICES) this.vortices.length = MAX_VORTICES;
			}
		}
		this.drops.push({
			x: clamp(x, 0, 1),
			y: clamp(y, 0, 1),
			amp,
			radius,
			pigment,
			thick,
			foam,
			mode: m
		});
	}
	warmStart() {
		for (const seed of [
			{
				x: .3,
				y: .56,
				amp: .52,
				radius: .034,
				mode: 0
			},
			{
				x: .61,
				y: .4,
				amp: .4,
				radius: .03,
				mode: 2
			},
			{
				x: .47,
				y: .7,
				amp: .32,
				radius: .028,
				mode: 1
			},
			{
				x: .16,
				y: .32,
				amp: .24,
				radius: .04,
				mode: 0
			},
			{
				x: .8,
				y: .62,
				amp: .3,
				radius: .032,
				mode: 2
			},
			{
				x: .72,
				y: .24,
				amp: .22,
				radius: .026,
				mode: 0
			}
		]) this.queueStroke(seed.x, seed.y, seed.amp, seed.radius, true, seed.mode);
		this.flushDrops();
		for (let i = 0; i < 28; i++) {
			this.simStep();
			this.filmStep();
		}
	}
	tick(dt) {
		this.time += this.reducedMotion ? 0 : dt;
		this.applyHeldKeys(dt);
		this.flushDrops();
		this.ageVortices(dt);
		this.acc += dt;
		let steps = 0;
		const maxSteps = TIER_STEPS[this.tier];
		while (this.acc >= SIM_STEP && steps < maxSteps) {
			this.simStep();
			this.filmStep();
			this.acc -= SIM_STEP;
			steps += 1;
		}
		this.watchdog(dt);
		this.render();
	}
	watchdog(dt) {
		if (dt > .033) this.slowFrames += 1;
		else this.slowFrames = Math.max(0, this.slowFrames - 1);
		if (this.slowFrames < 45) return;
		this.slowFrames = 0;
		if (this.tier === "high") this.tier = "mid";
		else if (this.tier === "mid") this.tier = "low";
		else return;
		this.resize(true);
	}
	damping() {
		return .9982 - clamp(this.params.viscosity, 0, 1) * .012;
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
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.filmA.tex);
		gl.uniform1i(gl.getUniformLocation(prog, "uFilm"), 1);
		gl.uniform2f(gl.getUniformLocation(prog, "uTexel"), 1 / this.simW, 1 / this.simH);
		gl.uniform1f(gl.getUniformLocation(prog, "uDamping"), this.damping());
		gl.uniform1f(gl.getUniformLocation(prog, "uFreq"), clamp(this.params.frequency, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uDensity"), clamp(this.params.density, 0, 1));
		gl.bindVertexArray(this.vao);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		this.swapHeight();
	}
	filmStep() {
		const gl = this.gl;
		const prog = this.filmSimProg;
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.filmB.fbo);
		gl.viewport(0, 0, this.simW, this.simH);
		gl.useProgram(prog);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.filmA.tex);
		gl.uniform1i(gl.getUniformLocation(prog, "uFilm"), 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.a.tex);
		gl.uniform1i(gl.getUniformLocation(prog, "uHeight"), 1);
		gl.uniform2f(gl.getUniformLocation(prog, "uTexel"), 1 / this.simW, 1 / this.simH);
		gl.uniform1f(gl.getUniformLocation(prog, "uAspect"), this.simW / Math.max(this.simH, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uDensity"), clamp(this.params.density, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uVisc"), clamp(this.params.viscosity, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uBubble"), clamp(this.params.bubbles, 0, 1));
		const vdata = /* @__PURE__ */ new Float32Array(24);
		const n = Math.min(this.vortices.length, MAX_VORTICES);
		for (let i = 0; i < n; i++) {
			const v = this.vortices[i];
			vdata[i * 4] = v.x;
			vdata[i * 4 + 1] = v.y;
			vdata[i * 4 + 2] = v.k * Math.max(v.life, 0);
			vdata[i * 4 + 3] = v.rad;
		}
		gl.uniform1i(gl.getUniformLocation(prog, "uVortexCount"), n);
		const vloc = gl.getUniformLocation(prog, "uVortex[0]");
		if (vloc) gl.uniform4fv(vloc, vdata);
		gl.bindVertexArray(this.vao);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		this.swapFilm();
	}
	flushDrops() {
		if (this.drops.length === 0) return;
		const gl = this.gl;
		const aspect = this.simW / Math.max(this.simH, 1);
		while (this.drops.length > 0) {
			const mode = this.drops[0].mode;
			const batch = [];
			while (this.drops.length > 0 && this.drops[0].mode === mode && batch.length < MAX_DROPS) batch.push(this.drops.shift());
			const data = /* @__PURE__ */ new Float32Array(48);
			const matter = /* @__PURE__ */ new Float32Array(48);
			for (let i = 0; i < batch.length; i++) {
				const d = batch[i];
				data[i * 4] = d.x;
				data[i * 4 + 1] = d.y;
				data[i * 4 + 2] = d.amp;
				data[i * 4 + 3] = d.radius;
				matter[i * 4] = d.pigment;
				matter[i * 4 + 1] = d.thick;
				matter[i * 4 + 2] = d.foam;
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.b.fbo);
			gl.viewport(0, 0, this.simW, this.simH);
			gl.useProgram(this.dropProg);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.a.tex);
			gl.uniform1i(gl.getUniformLocation(this.dropProg, "uState"), 0);
			gl.uniform1i(gl.getUniformLocation(this.dropProg, "uCount"), batch.length);
			gl.uniform1i(gl.getUniformLocation(this.dropProg, "uMode"), mode);
			gl.uniform1f(gl.getUniformLocation(this.dropProg, "uAspect"), aspect);
			const dloc = gl.getUniformLocation(this.dropProg, "uDrops[0]");
			if (dloc) gl.uniform4fv(dloc, data);
			gl.bindVertexArray(this.vao);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			this.swapHeight();
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.filmB.fbo);
			gl.viewport(0, 0, this.simW, this.simH);
			gl.useProgram(this.filmDropProg);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.filmA.tex);
			gl.uniform1i(gl.getUniformLocation(this.filmDropProg, "uFilm"), 0);
			gl.uniform1i(gl.getUniformLocation(this.filmDropProg, "uCount"), batch.length);
			gl.uniform1i(gl.getUniformLocation(this.filmDropProg, "uMode"), mode);
			gl.uniform1f(gl.getUniformLocation(this.filmDropProg, "uAspect"), aspect);
			const floc = gl.getUniformLocation(this.filmDropProg, "uDrops[0]");
			const mloc = gl.getUniformLocation(this.filmDropProg, "uMatter[0]");
			if (floc) gl.uniform4fv(floc, data);
			if (mloc) gl.uniform4fv(mloc, matter);
			gl.bindVertexArray(this.vao);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			this.swapFilm();
		}
	}
	render() {
		const gl = this.gl;
		const prog = this.displayProg;
		const p = this.params;
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		gl.useProgram(prog);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.a.tex);
		gl.uniform1i(gl.getUniformLocation(prog, "uState"), 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.filmA.tex);
		gl.uniform1i(gl.getUniformLocation(prog, "uFilm"), 1);
		gl.uniform2f(gl.getUniformLocation(prog, "uTexel"), 1 / this.simW, 1 / this.simH);
		gl.uniform1i(gl.getUniformLocation(prog, "uMap"), COLOR_INDEX[p.colorMap] ?? 0);
		gl.uniform1f(gl.getUniformLocation(prog, "uTime"), this.time);
		gl.uniform1f(gl.getUniformLocation(prog, "uAspect"), this.simW / Math.max(this.simH, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uThickness"), clamp(p.thickness, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uDensity"), clamp(p.density, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uBubbles"), clamp(p.bubbles, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uFreq"), clamp(p.frequency, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uInterfere"), clamp(p.interference, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uLightAz"), clamp(p.lightAz, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uLightEl"), clamp(p.lightEl, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uLightInt"), clamp(p.lightInt, 0, 1));
		gl.uniform1f(gl.getUniformLocation(prog, "uLightSoft"), clamp(p.lightSoft, 0, 1));
		gl.bindVertexArray(this.vao);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
	typingTarget(e) {
		const el = e.target;
		if (!el) return false;
		const tag = el.tagName;
		return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
	}
	handleKeyDown(e) {
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		if (this.typingTarget(e)) return;
		if (e.repeat && (e.code === "Space" || e.code === "KeyR" || e.code === "KeyV" || e.code === "KeyB" || e.code === "KeyC")) return;
		if (GAME_CODES.has(e.code)) e.preventDefault();
		this.keys.add(e.code);
		const at = this.lastPointer;
		if (e.code === "KeyC") this.clear();
		else if (e.code === "KeyZ") this.undo();
		else if (e.code === "KeyF") this.exportPng();
		else if (e.code === "Space") this.emitWave(at.x, at.y, this.currentMode(), 1.15);
		else if (e.code === "KeyR") this.emitWave(at.x, at.y, 1, 1.2);
		else if (e.code === "KeyV") this.emitWave(at.x, at.y, 2, 1.35);
		else if (e.code === "KeyB") this.bubbleBurst(at.x, at.y);
		else if (e.code === "Digit1") this.patchParams({ strength: .28 });
		else if (e.code === "Digit2") this.patchParams({ strength: .62 });
		else if (e.code === "Digit3") this.patchParams({ strength: 1 });
		else if (e.code === "KeyQ") this.patchParams({ lightInt: clamp(this.params.lightInt - .08, 0, 1) });
		else if (e.code === "KeyE") this.patchParams({ lightInt: clamp(this.params.lightInt + .08, 0, 1) });
		else if (e.code === "BracketLeft") this.patchParams({ frequency: clamp(this.params.frequency - .08, 0, 1) });
		else if (e.code === "BracketRight") this.patchParams({ frequency: clamp(this.params.frequency + .08, 0, 1) });
	}
	patchParams(patch) {
		this.setParams(patch);
		this.onParams?.(patch);
	}
	bubbleBurst(x, y) {
		const r = this.dropRadius() * 1.4;
		for (let i = 0; i < 5; i++) {
			const a = i / 5 * Math.PI * 2;
			this.queueStroke(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .6, this.dropAmp(.35), r * .55, true, 0);
		}
	}
	applyHeldKeys(dt) {
		let daz = 0;
		let del = 0;
		if (this.keys.has("ArrowLeft")) daz -= .2 * dt;
		if (this.keys.has("ArrowRight")) daz += .2 * dt;
		if (this.keys.has("ArrowDown")) del -= .2 * dt;
		if (this.keys.has("ArrowUp")) del += .2 * dt;
		if (daz !== 0 || del !== 0) {
			const az = (this.params.lightAz + daz + 1) % 1;
			const el = clamp(this.params.lightEl + del, 0, 1);
			this.patchParams({
				lightAz: az,
				lightEl: el
			});
		}
		this.edgeCool = Math.max(0, this.edgeCool - dt);
		if (this.edgeCool === 0) {
			const amp = this.dropAmp(.38);
			const r = this.dropRadius() * .85;
			let fired = false;
			if (this.keys.has("KeyW")) {
				this.edgeWave(.5, .97, 1, 0, amp, r);
				fired = true;
			}
			if (this.keys.has("KeyS")) {
				this.edgeWave(.5, .03, 1, 0, amp, r);
				fired = true;
			}
			if (this.keys.has("KeyA")) {
				this.edgeWave(.03, .5, 0, 1, amp, r);
				fired = true;
			}
			if (this.keys.has("KeyD")) {
				this.edgeWave(.97, .5, 0, 1, amp, r);
				fired = true;
			}
			if (fired) this.edgeCool = .2;
		}
	}
	edgeWave(x, y, alongX, alongY, amp, radius) {
		for (let i = -2; i <= 2; i++) this.queueStroke(x + alongX * i * .12, y + alongY * i * .12, amp, radius, true, 0);
	}
	swapHeight() {
		const tmp = this.a;
		this.a = this.b;
		this.b = tmp;
	}
	swapFilm() {
		const tmp = this.filmA;
		this.filmA = this.filmB;
		this.filmB = tmp;
	}
};
var STORAGE_KEY = "wake.v4";
var LEGACY_KEYS = [
	"wake.v3",
	"wake.v2",
	"wake.v1"
];
var PARAM_KEYS = [
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
	"lightSoft"
];
function clamp01(n) {
	if (!Number.isFinite(n)) return 0;
	return Math.min(1, Math.max(0, n));
}
function loadSettings() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY) ?? LEGACY_KEYS.map((k) => localStorage.getItem(k)).find((v) => v != null);
		if (!raw) return { ...DEFAULT_PARAMS };
		const parsed = JSON.parse(raw);
		const colorMap = COLOR_MAPS.some((m) => m.id === parsed.colorMap) ? parsed.colorMap : DEFAULT_PARAMS.colorMap;
		const waveMode = WAVE_MODES.some((m) => m.id === parsed.waveMode) ? parsed.waveMode : DEFAULT_PARAMS.waveMode;
		const next = {
			...DEFAULT_PARAMS,
			colorMap,
			waveMode
		};
		for (const key of PARAM_KEYS) {
			const value = parsed[key];
			next[key] = clamp01(typeof value === "number" ? value : DEFAULT_PARAMS[key]);
		}
		return next;
	} catch {
		return { ...DEFAULT_PARAMS };
	}
}
function saveSettings(params) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
	} catch {}
}
function activeRecipe(params) {
	for (const recipe of RECIPES) {
		const patch = recipe.patch;
		let match = true;
		for (const [rawKey, rawWant] of Object.entries(patch)) {
			const key = rawKey;
			if (rawWant === void 0) continue;
			if (key === "colorMap" || key === "waveMode") {
				if (params[key] !== rawWant) match = false;
				continue;
			}
			if (Math.abs(params[key] - rawWant) >= .03) match = false;
		}
		if (match) return recipe.id;
	}
	return null;
}
function WakeApp() {
	const canvasRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const cursorRef = (0, import_react.useRef)(null);
	const overUiRef = (0, import_react.useRef)(false);
	const areaRef = (0, import_react.useRef)(DEFAULT_PARAMS.area);
	const updateRef = (0, import_react.useRef)(() => {});
	const [params, setParams] = (0, import_react.useState)(DEFAULT_PARAMS);
	const [hint, setHint] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("matter");
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const initial = loadSettings();
		setParams(initial);
		areaRef.current = initial.area;
		let engine;
		try {
			engine = new RippleEngine(canvas, initial, { onParams: (patch) => updateRef.current(patch) });
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
	const update = (0, import_react.useCallback)((patch) => {
		setParams((prev) => {
			const next = {
				...prev,
				...patch
			};
			areaRef.current = next.area;
			engineRef.current?.setParams(next);
			saveSettings(next);
			return next;
		});
	}, []);
	updateRef.current = update;
	const applyRecipe = (0, import_react.useCallback)((id) => {
		const recipe = RECIPES.find((r) => r.id === id);
		if (!recipe) return;
		update(recipe.patch);
	}, [update]);
	const clear = (0, import_react.useCallback)(() => {
		engineRef.current?.clear();
		setHint(true);
	}, []);
	const undo = (0, import_react.useCallback)(() => {
		engineRef.current?.undo();
	}, []);
	const freeze = (0, import_react.useCallback)(() => {
		engineRef.current?.exportPng();
	}, []);
	const recipe = activeRecipe(params);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full select-none overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 size-full cursor-none touch-none bg-[#1a5c66]",
				"aria-label": "Fluid ripple surface"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: cursorRef,
				"aria-hidden": "true",
				className: "pointer-events-none fixed top-0 left-0 z-30 rounded-full border border-accent/70 opacity-0",
				style: {
					width: areaPx,
					height: areaPx
				}
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
						children: "Oil and water"
					})] })]
				})
			}),
			hint && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute top-1/4 left-1/2 z-10 max-w-sm -translate-x-1/2 px-6 text-center font-display text-lg tracking-tight text-fg/80 italic md:text-xl",
				children: "Drag to paint · Space pulse · R ring · V swirl · Z undo · F freeze"
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
					className: "max-h-[min(46dvh,520px)] overflow-y-auto overscroll-contain rounded-lg bg-surface/95 p-4 shadow-border backdrop-blur-sm md:max-h-[min(70dvh,640px)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-1 rounded-sm bg-surface-2 p-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
										active: tab === "matter",
										onClick: () => setTab("matter"),
										children: "Matter"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
										active: tab === "film",
										onClick: () => setTab("film"),
										children: "Film"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
										active: tab === "light",
										onClick: () => setTab("light"),
										children: "Light"
									})
								]
							}),
							tab === "matter" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
											className: "mb-2 text-xs font-medium tracking-wide text-muted",
											children: "Wave"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-3 gap-1.5",
											children: WAVE_MODES.map((item) => {
												const active = params.waveMode === item.id;
												const Icon = item.id === "pulse" ? Waves : item.id === "ring" ? CircleDot : Tornado;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													"aria-pressed": active,
													onClick: () => update({ waveMode: item.id }),
													className: cn("flex h-11 items-center justify-center gap-1.5 rounded-sm text-sm font-medium tracking-wide", "transition-[background-color,color,transform] duration-150 ease-out", "active:scale-[0.96]", active ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg hover:bg-surface-2/80"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
														className: "size-4",
														strokeWidth: 1.75,
														"aria-hidden": "true"
													}), item.label]
												}, item.id);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1.5 grid grid-cols-3 gap-1.5",
											children: STRENGTH_PRESETS.map((item) => {
												const active = Math.abs(params.strength - item.value) < .04;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-pressed": active,
													onClick: () => update({ strength: item.value }),
													className: cn("h-11 rounded-sm text-sm font-medium tracking-wide", "transition-[background-color,color,transform] duration-150 ease-out", "active:scale-[0.96]", active ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg hover:bg-surface-2/80"),
													children: item.label
												}, item.id);
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
										className: "mb-2 text-xs font-medium tracking-wide text-muted",
										children: "Medium"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-3 gap-1.5",
										children: RECIPES.map((item) => {
											const active = recipe === item.id;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-pressed": active,
												onClick: () => applyRecipe(item.id),
												className: cn("h-11 rounded-sm text-sm font-medium tracking-wide", "transition-[background-color,color,transform] duration-150 ease-out", "active:scale-[0.96]", active ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg hover:bg-surface-2/80"),
												children: item.label
											}, item.id);
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
										className: "mb-2 text-xs font-medium tracking-wide text-muted",
										children: "Color map"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-4 gap-1.5",
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
									label: "Area of effect",
									value: params.area,
									onChange: (v) => update({ area: v })
								})
							] }),
							tab === "film" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
									label: "Thickness",
									value: params.thickness,
									onChange: (v) => update({ thickness: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
									label: "Density",
									value: params.density,
									onChange: (v) => update({ density: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
									label: "Bubbles",
									value: params.bubbles,
									onChange: (v) => update({ bubbles: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
									label: "Frequency",
									value: params.frequency,
									onChange: (v) => update({ frequency: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
									label: "Interference",
									value: params.interference,
									onChange: (v) => update({ interference: v })
								})
							] }),
							tab === "light" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LightPad, {
									az: params.lightAz,
									el: params.lightEl,
									onChange: (lightAz, lightEl) => update({
										lightAz,
										lightEl
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
									label: "Intensity",
									value: params.lightInt,
									onChange: (v) => update({ lightInt: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
									label: "Quality",
									value: params.lightSoft,
									onChange: (v) => update({ lightSoft: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs leading-normal text-faint",
									children: "Drag the lamp. Arrows orbit · Q/E dim · WASD edge waves"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: undo,
										className: cn("flex h-11 items-center justify-center gap-1.5 rounded-sm", "bg-surface-2 text-sm font-medium text-fg", "transition-[background-color,transform] duration-150 ease-out", "hover:bg-surface-2/80 active:scale-[0.96]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, {
											className: "size-4",
											strokeWidth: 1.75,
											"aria-hidden": "true"
										}), "Undo"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: freeze,
										className: cn("flex h-11 items-center justify-center gap-1.5 rounded-sm", "bg-surface-2 text-sm font-medium text-fg", "transition-[background-color,transform] duration-150 ease-out", "hover:bg-surface-2/80 active:scale-[0.96]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
											className: "size-4",
											strokeWidth: 1.75,
											"aria-hidden": "true"
										}), "Freeze"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: clear,
										className: cn("flex h-11 items-center justify-center gap-1.5 rounded-sm", "bg-surface-2 text-sm font-medium text-fg", "transition-[background-color,transform] duration-150 ease-out", "hover:bg-surface-2/80 active:scale-[0.96]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
											className: "size-4",
											strokeWidth: 1.75,
											"aria-hidden": "true"
										}), "Clear"]
									})
								]
							})
						]
					})
				})
			})
		]
	});
}
function TabButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: cn("h-10 rounded-sm text-sm font-medium tracking-wide", "transition-[background-color,color,transform] duration-150 ease-out", "active:scale-[0.96]", active ? "bg-surface text-fg shadow-border" : "text-muted hover:text-fg"),
		children
	});
}
function LightPad({ az, el, onChange }) {
	const ref = (0, import_react.useRef)(null);
	const apply = (clientX, clientY) => {
		const node = ref.current;
		if (!node) return;
		const box = node.getBoundingClientRect();
		const x = (clientX - box.left) / Math.max(box.width, 1) * 2 - 1;
		const y = (clientY - box.top) / Math.max(box.height, 1) * 2 - 1;
		const len = Math.min(1, Math.hypot(x, y));
		onChange((Math.atan2(x, -y) / (Math.PI * 2) + 1) % 1, 1 - len);
	};
	const onPointer = (e) => {
		e.preventDefault();
		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
		apply(e.clientX, e.clientY);
	};
	const len = 1 - el;
	const ang = az * Math.PI * 2;
	const tx = Math.sin(ang) * len;
	const ty = -Math.cos(ang) * len;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium tracking-wide text-muted",
			children: "Lamp"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref,
			role: "slider",
			"aria-label": "Light direction",
			"aria-valuemin": 0,
			"aria-valuemax": 100,
			"aria-valuenow": Math.round(el * 100),
			tabIndex: 0,
			className: "relative mx-auto size-24 touch-none rounded-full bg-surface-2 shadow-border",
			onPointerDown: onPointer,
			onPointerMove: (e) => {
				if (e.buttons) apply(e.clientX, e.clientY);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-[18%] rounded-full bg-surface/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute size-3 rounded-full bg-accent shadow-border",
				style: {
					left: `${50 + tx * 42}%`,
					top: `${50 + ty * 42}%`,
					transform: "translate(-50%, -50%)"
				}
			})]
		})]
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
