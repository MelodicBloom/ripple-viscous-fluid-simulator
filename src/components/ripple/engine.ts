export const COLOR_MAPS = [
  { id: "abyss", label: "Abyss" },
  { id: "ember", label: "Ember" },
  { id: "glacier", label: "Glacier" },
  { id: "ink", label: "Ink" },
  { id: "bloom", label: "Bloom" },
  { id: "solar", label: "Solar" },
  { id: "film", label: "Film" },
  { id: "oil", label: "Oil" },
  { id: "chrome", label: "Chrome" },
  { id: "cell", label: "Cell" },
  { id: "prism", label: "Prism" },
  { id: "nacre", label: "Nacre" },
] as const;

export type ColorMapId = (typeof COLOR_MAPS)[number]["id"];

export const WAVE_MODES = [
  { id: "pulse", label: "Pulse", key: "Space" },
  { id: "ring", label: "Ring", key: "R" },
  { id: "swirl", label: "Swirl", key: "V" },
] as const;

export type WaveModeId = (typeof WAVE_MODES)[number]["id"];

export const STRENGTH_PRESETS = [
  { id: "soft", label: "Soft", value: 0.28, key: "1" },
  { id: "wake", label: "Wake", value: 0.62, key: "2" },
  { id: "gale", label: "Gale", value: 1, key: "3" },
] as const;

export type RippleParams = {
  viscosity: number;
  strength: number;
  colorMap: ColorMapId;
  area: number;
  thickness: number;
  density: number;
  bubbles: number;
  frequency: number;
  interference: number;
  lightAz: number;
  lightEl: number;
  lightInt: number;
  lightSoft: number;
  waveMode: WaveModeId;
};

export const DEFAULT_PARAMS: RippleParams = {
  viscosity: 0.28,
  strength: 0.62,
  colorMap: "abyss",
  area: 0.42,
  thickness: 0.22,
  density: 0.24,
  bubbles: 0.18,
  frequency: 0.62,
  interference: 0.16,
  lightAz: 0.18,
  lightEl: 0.7,
  lightInt: 0.72,
  lightSoft: 0.32,
  waveMode: "pulse",
};

export const RECIPES = [
  {
    id: "water",
    label: "Water",
    patch: {
      thickness: 0.22,
      density: 0.22,
      bubbles: 0.16,
      frequency: 0.62,
      interference: 0.22,
      viscosity: 0.28,
      colorMap: "abyss" as const,
    },
  },
  {
    id: "oil",
    label: "Oil",
    patch: {
      thickness: 0.82,
      density: 0.84,
      bubbles: 0.38,
      frequency: 0.42,
      interference: 0.52,
      viscosity: 0.52,
      colorMap: "oil" as const,
    },
  },
  {
    id: "soap",
    label: "Soap",
    patch: {
      thickness: 0.92,
      density: 0.48,
      bubbles: 0.86,
      frequency: 0.58,
      interference: 0.74,
      viscosity: 0.22,
      colorMap: "film" as const,
    },
  },
  {
    id: "chrome",
    label: "Chrome",
    patch: {
      thickness: 0.62,
      density: 0.16,
      bubbles: 0.1,
      frequency: 0.48,
      interference: 0.36,
      viscosity: 0.4,
      lightSoft: 0.08,
      lightInt: 0.86,
      colorMap: "chrome" as const,
    },
  },
  {
    id: "cell",
    label: "Cell",
    patch: {
      thickness: 0.56,
      density: 0.9,
      bubbles: 0.28,
      frequency: 0.36,
      interference: 0.38,
      viscosity: 0.6,
      colorMap: "cell" as const,
    },
  },
  {
    id: "prism",
    label: "Prism",
    patch: {
      thickness: 0.72,
      density: 0.4,
      bubbles: 0.24,
      frequency: 0.74,
      interference: 0.88,
      viscosity: 0.2,
      colorMap: "prism" as const,
    },
  },
] as const;

export type RecipeId = (typeof RECIPES)[number]["id"];

const COLOR_INDEX: Record<ColorMapId, number> = {
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
  nacre: 11,
};

const MAX_DROPS = 12;
const SIM_STEP = 1 / 60;
const MAX_STEPS = 2;
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
  float wave = (2.0 * avg - p);
  float drive = mix(0.28, 0.55, uFreq);
  float hNew = mix(h, wave, drive) * uDamping;
  hNew *= mix(1.0, 0.975, mass * uDensity);
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
      float ang = atan(d.y, d.x);
      add += amp * 1.05 * exp(-r2 * 0.7) * sin(ang * 2.0 + r / sig * 3.6);
    } else {
      add += amp * exp(-r2);
    }
  }
  h = clamp(h + add, -2.8, 2.8);
  vec2 enc = encodePair(h, p);
  fragColor = vec4(enc, 0.0, 1.0);
}
`;

const FILM_SIM_FRAG = `
in vec2 vUv;
uniform sampler2D uFilm;
uniform sampler2D uHeight;
uniform vec2 uTexel;
uniform float uAspect;
uniform float uDensity;
uniform float uVisc;
uniform float uBubble;
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
  vec2 flow = grad * (0.05 + uDensity * 0.32) + curl * (0.09 + uDensity * 0.24);
  flow.y += uBubble * 0.008;

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

  float edge = abs(lap);
  float crest = max(decode(texture(uHeight, vUv)), 0.0);
  foam = foam * mix(0.993, 0.978, uBubble) + (edge * 0.7 + crest * 0.35) * uBubble * (0.32 + pigment) * 0.05;
  foam = clamp(foam, 0.0, 1.0);

  fragColor = vec4(pigment, thick, foam, 1.0);
}
`;

const FILM_DROP_FRAG = `
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
      float ang = atan(d.y, d.x);
      float spiral = 0.5 + 0.5 * sin(ang * 4.0 + r / sig * 7.5);
      g *= 0.25 + spiral * 0.95;
    }
    f.r = clamp(f.r + uMatter[i].x * g, 0.0, 1.0);
    f.g = clamp(f.g + uMatter[i].y * g, 0.0, 1.0);
    f.b = clamp(f.b + uMatter[i].z * g, 0.0, 1.0);
  }
  fragColor = vec4(f.rgb, 1.0);
}
`;

const DISPLAY_FRAG = `
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
  vec3 black = vec3(0.08, 0.16, 0.2);
  return mix(black, pow(R, vec3(0.82)), envelope);
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

  vec3 n = normalize(vec3((hl - hr) * 12.0, 1.2, (hd - hu) * 12.0));
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

  float t = clamp(h * 1.15 + 0.5 + ndl * 0.14, 0.0, 1.0);
  float marbleT = fract(t + pigment * 0.62 + marbleAng * 0.08 + thick * 0.28);
  vec3 water = palette(uMap, t);
  vec3 marble = palette(uMap, marbleT);
  vec3 albedo = mix(water, marble, clamp(pigment * (0.55 + uDensity * 0.5), 0.0, 0.92));

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
  float filmAmt = mix(0.04, 0.88, uThickness) * (thick * 1.15 + pigment * 0.9);

  vec3 specCol = mix(vec3(0.85, 0.93, 1.0), filmCol, 0.55);
  vec3 color = albedo * (0.48 + 0.62 * ndl);
  color += spec * specCol * mix(0.85, 1.7, 1.0 - uLightSoft);
  color += caustic * mix(albedo, specCol, 0.5) * 0.85;
  color += star * specCol * 0.7;
  color = mix(color, specCol, fres * 0.28);

  vec3 transmitted = albedo * (1.0 - filmCol * 0.35);
  vec3 soap = mix(transmitted, filmCol * 1.55, 0.5) + filmCol * filmAmt;
  color = mix(color, soap, clamp(filmAmt, 0.0, 0.78));

  vec3 veinCol = mix(vec3(0.98, 0.78, 0.28), mix(filmCol, albedo, 0.25), 0.4);
  color = mix(color, veinCol * 1.15, clamp(vein * (1.2 + uDensity * 2.4), 0.0, 0.7));

  float metal = smoothstep(0.28, 0.75, uThickness * (1.0 - uDensity * 0.45));
  vec3 env = airyFilm(0.34 + n.x * 0.5 + n.z * 0.3, ndv, 0.7);
  float band = abs(dot(normalize(n.xz + 1e-4), vec2(cos(az), sin(az))));
  float cateye = pow(1.0 - clamp(band, 0.0, 1.0), mix(2.2, 7.5, 1.0 - uLightSoft));
  vec3 chrome = mix(albedo * 0.32, env, 0.55 + fres * 0.4) + spec * vec3(0.96, 0.97, 1.0) * 1.55;
  chrome += cateye * mix(vec3(0.35, 0.82, 1.0), vec3(1.0, 0.78, 0.28), pigment) * 0.9;
  color = mix(color, chrome, metal);

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
  float live = inside * (0.18 + foam * 1.05) * mix(0.12, 1.0, uBubbles);
  vec3 bN = vec3(bOff / max(bRad, 0.08), sqrt(max(0.0, 1.0 - dmin * dmin)));
  bN = normalize(bN + vec3(0.0, 0.0, 0.001));
  float bNdv = max(bN.z, 0.04);
  float bSpec = pow(clamp(dot(bN, light), 0.0, 1.0), 42.0);
  float bRim = pow(1.0 - bNdv, 1.6);
  vec3 bFilm = airyFilm(0.22 + (1.0 - bNdv) * 0.7, bNdv, 0.8);
  vec3 bCol = mix(vec3(0.08, 0.1, 0.14), bFilm * 1.6, 0.72) + vec3(0.95, 0.97, 1.0) * bSpec * 1.8;
  bCol += bRim * mix(vec3(0.75, 0.9, 1.0), filmCol, 0.5) * 0.9;
  color = mix(color * mix(1.0, 0.45, live * 0.7), bCol, clamp(live, 0.0, 0.92));

  float foamCap = smoothstep(0.16, 0.34, h) * (0.28 + foam);
  color = mix(color, mix(vec3(0.94, 0.97, 1.0), filmCol, 0.25), foamCap * 0.32);

  float spark = pow(hash(vUv * 480.0 + n.xz * 8.0), mix(16.0, 7.0, uBubbles));
  color += spark * spec * specCol * (0.16 + uThickness * 0.4);

  float breath = 0.97 + 0.03 * sin(uTime * 0.62);
  color *= mix(0.82, 1.32, uLightInt) * breath;
  float vig = 1.0 - 0.26 * dot(vUv - 0.5, vUv - 0.5);
  color *= vig;
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.025;
  color = max(color, vec3(0.0));
  color = pow(color, vec3(0.9));
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

type Drop = {
  x: number;
  y: number;
  amp: number;
  radius: number;
  pigment: number;
  thick: number;
  foam: number;
  mode: number;
};

const MODE_INDEX: Record<WaveModeId, number> = { pulse: 0, ring: 1, swirl: 2 };

const GAME_CODES = new Set([
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
]);

export class RippleEngine {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private packed = false;
  private simW = 0;
  private simH = 0;
  private a!: Target;
  private b!: Target;
  private filmA!: Target;
  private filmB!: Target;
  private simProg!: WebGLProgram;
  private dropProg!: WebGLProgram;
  private filmSimProg!: WebGLProgram;
  private filmDropProg!: WebGLProgram;
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
  private onKeyDown: (e: KeyboardEvent) => void;
  private onKeyUp: (e: KeyboardEvent) => void;
  private onBlur: () => void;
  private keys = new Set<string>();
  private lastPointer = { x: 0.5, y: 0.5 };
  private edgeCool = 0;
  private onParams: ((p: Partial<RippleParams>) => void) | undefined;
  private listeners: Array<{
    type: string;
    fn: EventListener;
    target: EventTarget;
  }> = [];

  constructor(
    canvas: HTMLCanvasElement,
    params: RippleParams,
    opts?: { onParams?: (p: Partial<RippleParams>) => void },
  ) {
    this.canvas = canvas;
    this.params = { ...DEFAULT_PARAMS, ...params };
    this.onParams = opts?.onParams;
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
    this.onKeyDown = (e) => this.handleKeyDown(e);
    this.onKeyUp = (e) => this.keys.delete(e.code);
    this.onBlur = () => this.keys.clear();

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
    for (const t of [this.filmA, this.filmB]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.viewport(0, 0, this.simW, this.simH);
      gl.clearColor(0, 0, 0, 1);
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
    gl.deleteProgram(this.filmSimProg);
    gl.deleteProgram(this.filmDropProg);
    gl.deleteProgram(this.displayProg);
    this.deleteTarget(this.a);
    this.deleteTarget(this.b);
    this.deleteTarget(this.filmA);
    this.deleteTarget(this.filmB);
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
    this.filmSimProg = link(gl, VERT, shaderSrc(FILM_SIM_FRAG, packed));
    this.filmDropProg = link(gl, VERT, shaderSrc(FILM_DROP_FRAG, packed));
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

  private makeTarget(w: number, h: number, film: boolean): Target {
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
    if (film) gl.clearColor(0, 0, 0, 1);
    else gl.clearColor(this.packed ? 0.5 : 0, this.packed ? 0.5 : 0, 0, 1);
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
    this.deleteTarget(this.filmA);
    this.deleteTarget(this.filmB);
    this.a = this.makeTarget(w, h, false);
    this.b = this.makeTarget(w, h, false);
    this.filmA = this.makeTarget(w, h, true);
    this.filmB = this.makeTarget(w, h, true);
  }

  private bindInput() {
    const canvas = this.canvas;
    canvas.style.touchAction = "none";
    this.listen(canvas, "pointerdown", this.onPointerDown as EventListener);
    this.listen(canvas, "pointermove", this.onPointerMove as EventListener);
    this.listen(canvas, "pointerup", this.onPointerUp as EventListener);
    this.listen(canvas, "pointercancel", this.onPointerUp as EventListener);
    this.listen(window, "keydown", this.onKeyDown as EventListener);
    this.listen(window, "keyup", this.onKeyUp as EventListener);
    this.listen(window, "blur", this.onBlur as EventListener);
    this.listen(document, "visibilitychange", this.onBlur as EventListener);
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
        this.queueStroke(x, y, amp, this.dropRadius(), true, 0);
      },
      setParams: (p) => this.setParams(p),
      trigger: (mode, x = 0.5, y = 0.5) => {
        const m = MODE_INDEX[mode as WaveModeId] ?? 0;
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
      }),
    };
  }

  private eventUv(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
    const y = clamp(1 - (e.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
    return { x, y };
  }

  private handleDown(e: PointerEvent) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events have no active pointer */
    }
    const uv = this.eventUv(e);
    this.lastPointer = uv;
    this.pointers.set(e.pointerId, { ...uv, down: true });
    this.queueStroke(uv.x, uv.y, this.dropAmp(1), this.dropRadius(), true);
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
    this.lastPointer = uv;
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
    this.queueStroke(x, y, amp, this.dropRadius() * 0.7, false, 0);
  }

  private stroke(x0: number, y0: number, x1: number, y1: number, strong: boolean) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const spacing = 0.016 + this.dropRadius() * 0.55;
    const steps = Math.max(1, Math.ceil(dist / spacing));
    const impulse = strong ? 0.5 + Math.min(dist * 5, 0.65) : 0.16;
    const amp = this.dropAmp(impulse);
    const radius = this.dropRadius();
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      this.queueStroke(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, amp, radius, strong);
    }
  }

  private dropAmp(impulse: number): number {
    const s = clamp(this.params.strength, 0, 1);
    return (0.03 + s * 0.26) * impulse;
  }

  private dropRadius(): number {
    const a = clamp(this.params.area, 0, 1);
    return 0.01 + a * 0.055;
  }

  queueDrop(x: number, y: number, amp: number, radius: number) {
    this.queueStroke(x, y, amp, radius, true);
  }

  private currentMode(): number {
    return MODE_INDEX[this.params.waveMode] ?? 0;
  }

  private emitWave(x: number, y: number, mode: number, impulse: number) {
    const radius = this.dropRadius() * (mode === 1 ? 1.35 : mode === 2 ? 1.6 : 1);
    this.queueStroke(x, y, this.dropAmp(impulse), radius, true, mode);
  }

  private queueStroke(
    x: number,
    y: number,
    amp: number,
    radius: number,
    paint: boolean,
    mode?: number,
  ) {
    const density = clamp(this.params.density, 0, 1);
    const thickness = clamp(this.params.thickness, 0, 1);
    const bubbles = clamp(this.params.bubbles, 0, 1);
    const pigment = paint ? density * (0.5 + Math.abs(amp) * 1.15) : density * 0.08;
    const thick = paint ? thickness * (0.42 + Math.abs(amp) * 0.9) : thickness * 0.06;
    let foam = paint ? bubbles * (0.28 + Math.abs(amp) * 0.7) : bubbles * 0.05;
    const m = mode ?? (paint ? this.currentMode() : 0);
    if (m === 2) foam *= 1.35;
    this.drops.push({
      x: clamp(x, 0, 1),
      y: clamp(y, 0, 1),
      amp,
      radius,
      pigment,
      thick,
      foam,
      mode: m,
    });
  }

  private warmStart() {
    const seeds = [
      { x: 0.3, y: 0.56, amp: 0.52, radius: 0.034, mode: 0 },
      { x: 0.61, y: 0.4, amp: 0.4, radius: 0.03, mode: 2 },
      { x: 0.47, y: 0.7, amp: 0.32, radius: 0.028, mode: 1 },
      { x: 0.16, y: 0.32, amp: 0.24, radius: 0.04, mode: 0 },
      { x: 0.8, y: 0.62, amp: 0.3, radius: 0.032, mode: 2 },
      { x: 0.72, y: 0.24, amp: 0.22, radius: 0.026, mode: 0 },
    ];
    for (const seed of seeds) this.queueStroke(seed.x, seed.y, seed.amp, seed.radius, true, seed.mode);
    this.flushDrops();
    for (let i = 0; i < 28; i++) {
      this.simStep();
      this.filmStep();
    }
  }

  private tick(dt: number) {
    this.time += this.reducedMotion ? 0 : dt;
    this.applyHeldKeys(dt);
    this.flushDrops();
    this.acc += dt;
    let steps = 0;
    while (this.acc >= SIM_STEP && steps < MAX_STEPS) {
      this.simStep();
      this.filmStep();
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

  private simStep() {
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

  private filmStep() {
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
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.swapFilm();
  }

  private flushDrops() {
    if (this.drops.length === 0) return;
    const gl = this.gl;
    const aspect = this.simW / Math.max(this.simH, 1);
    while (this.drops.length > 0) {
      const mode = this.drops[0].mode;
      const batch: Drop[] = [];
      while (this.drops.length > 0 && this.drops[0].mode === mode && batch.length < MAX_DROPS) {
        batch.push(this.drops.shift() as Drop);
      }
      const data = new Float32Array(MAX_DROPS * 4);
      const matter = new Float32Array(MAX_DROPS * 4);
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

  private render() {
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

  private typingTarget(e: KeyboardEvent): boolean {
    const el = e.target as HTMLElement | null;
    if (!el) return false;
    const tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.typingTarget(e)) return;
    if (e.repeat && (e.code === "Space" || e.code === "KeyR" || e.code === "KeyV" || e.code === "KeyB" || e.code === "KeyC")) return;
    if (GAME_CODES.has(e.code)) e.preventDefault();
    this.keys.add(e.code);

    const at = this.lastPointer;
    if (e.code === "KeyC") this.clear();
    else if (e.code === "Space") this.emitWave(at.x, at.y, this.currentMode(), 1.15);
    else if (e.code === "KeyR") this.emitWave(at.x, at.y, 1, 1.2);
    else if (e.code === "KeyV") this.emitWave(at.x, at.y, 2, 1.35);
    else if (e.code === "KeyB") this.bubbleBurst(at.x, at.y);
    else if (e.code === "Digit1") this.patchParams({ strength: 0.28 });
    else if (e.code === "Digit2") this.patchParams({ strength: 0.62 });
    else if (e.code === "Digit3") this.patchParams({ strength: 1 });
    else if (e.code === "KeyQ") this.patchParams({ lightInt: clamp(this.params.lightInt - 0.08, 0, 1) });
    else if (e.code === "KeyE") this.patchParams({ lightInt: clamp(this.params.lightInt + 0.08, 0, 1) });
    else if (e.code === "BracketLeft") this.patchParams({ frequency: clamp(this.params.frequency - 0.08, 0, 1) });
    else if (e.code === "BracketRight") this.patchParams({ frequency: clamp(this.params.frequency + 0.08, 0, 1) });
  }

  private patchParams(patch: Partial<RippleParams>) {
    this.setParams(patch);
    this.onParams?.(patch);
  }

  private bubbleBurst(x: number, y: number) {
    const r = this.dropRadius() * 1.4;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      this.queueStroke(
        x + Math.cos(a) * r * 0.6,
        y + Math.sin(a) * r * 0.6,
        this.dropAmp(0.35),
        r * 0.55,
        true,
        0,
      );
    }
  }

  private applyHeldKeys(dt: number) {
    let daz = 0;
    let del = 0;
    if (this.keys.has("ArrowLeft")) daz -= 0.2 * dt;
    if (this.keys.has("ArrowRight")) daz += 0.2 * dt;
    if (this.keys.has("ArrowDown")) del -= 0.2 * dt;
    if (this.keys.has("ArrowUp")) del += 0.2 * dt;
    if (daz !== 0 || del !== 0) {
      const az = (this.params.lightAz + daz + 1) % 1;
      const el = clamp(this.params.lightEl + del, 0, 1);
      this.patchParams({ lightAz: az, lightEl: el });
    }

    this.edgeCool = Math.max(0, this.edgeCool - dt);
    if (this.edgeCool === 0) {
      const amp = this.dropAmp(0.38);
      const r = this.dropRadius() * 0.85;
      let fired = false;
      if (this.keys.has("KeyW")) {
        this.edgeWave(0.5, 0.97, 1, 0, amp, r);
        fired = true;
      }
      if (this.keys.has("KeyS")) {
        this.edgeWave(0.5, 0.03, 1, 0, amp, r);
        fired = true;
      }
      if (this.keys.has("KeyA")) {
        this.edgeWave(0.03, 0.5, 0, 1, amp, r);
        fired = true;
      }
      if (this.keys.has("KeyD")) {
        this.edgeWave(0.97, 0.5, 0, 1, amp, r);
        fired = true;
      }
      if (fired) this.edgeCool = 0.2;
    }
  }

  private edgeWave(x: number, y: number, alongX: number, alongY: number, amp: number, radius: number) {
    for (let i = -2; i <= 2; i++) {
      this.queueStroke(x + alongX * i * 0.12, y + alongY * i * 0.12, amp, radius, true, 0);
    }
  }

  private swapHeight() {
    const tmp = this.a;
    this.a = this.b;
    this.b = tmp;
  }

  private swapFilm() {
    const tmp = this.filmA;
    this.filmA = this.filmB;
    this.filmB = tmp;
  }
}

declare global {
  interface Window {
    __wake?: {
      clear: () => void;
      drop: (x: number, y: number, amp?: number) => void;
      setParams: (p: Partial<RippleParams>) => void;
      trigger: (mode: string, x?: number, y?: number) => void;
      setKeys: (codes: string[]) => void;
      getState: () => {
        waveMode: WaveModeId;
        strength: number;
        lightAz: number;
        lightEl: number;
        keys: string[];
      };
    };
  }
}
