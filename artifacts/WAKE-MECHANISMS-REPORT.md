# Wake — Mechanisms, Interaction, Performance, Product

**Status:** audit of the live fluid-ripple studio against the reference stills (oil/water, soap film, magnetic polish, kintsugi veins, petri cells, cosmic caustics).  
**Frame:** phenomenology first (the hand makes a mark; the surface answers), then physics, then product.  
**Motivation architecture (if gamified):** Flow + Self-Determination — autonomy of gesture, competence of reading the field, relatedness via shared exported plates. No dark-pattern loops.

---

## 1. What the photos actually demand

The stills are not “prettier water.” They are a **material taxonomy**. Each image is a different coupling of three fields:

| Reference family | Visible mechanism | What the current app already does | Gap |
|---|---|---|---|
| Concentric ripples / rebound | Height-field wave | Classic 2-step wave + mirror edges | Rings restored; still too few *types* of event |
| Oil-on-water marble, kintsugi gold | Advection + filament sharpening | Film RGB + curl + RD + vein lighting | Filaments smear; one scalar pigment, not multi-ink |
| Soap bubbles / heart foam | Discrete spheres + thin-film rainbow | Voronoi spheres + Airy | Foam is a field, not countable objects |
| Magnetic cat-eye polish | Anisotropic specular band vs light | `cateye` term in chrome mix | No *gesture* that orients the band |
| Petri / cell walls | Reaction-diffusion fronts | Weak RD on pigment | No locked cell membrane, no mitosis event |
| Cosmic caustic / iris | Height Laplacian as light | Caustic + star term | Caustics are a side-effect, not a tool |
| Drips on black / melted type | Gravity + thickness as mass | Almost none | No gravity axis, no letter-as-dam |
| Pastel oil-paint ribbons | High-viscosity anisotropic stretch | Viscosity damps wave + film blur | No brush that *lays a ribbon* |

The user correction “the background isn’t supposed to be black” is load-bearing. The references with black grounds are **studio voids behind a plate**. The working surface is water, ice, nacre, or wet paint — a lit body. Product rule: **void is a recipe, not the default pond.**

---

## 2. Mechanisms to codify as UX (not sliders)

Sliders expose coefficients. Users think in **verbs**. Map each physical operator to a hand action.

### 2.1 Field verbs

| Verb | Gesture | Field written | Feel |
|---|---|---|---|
| **Pulse** | tap / Space | height Gaussian | pebble |
| **Ring** | tap-hold / R | annular Gaussian | raindrop corona |
| **Swirl / typhoon** | orbit drag / V | height dipole + film spiral | stirring a dish |
| **Paint** | drag | film.r + film.g | laying oil |
| **Slick** | two-finger pinch | area + thickness | spreading a drop |
| **Lamp** | pad / arrows | light az/el | turning the room |
| **Clear** | C / button | zero both fields | wipe the plate |
| **Rebound** | edge WASD / wall hit | Neumann mirror | dish rim |
| **Stamp type** | type a letter | height + film mask | letter as dam / melt |

Do not add a seventh tab. Bind verbs to **existing chips + keyboard + one new “stamp” mode**. The studio is already too tall on mobile.

### 2.2 Causality contract

Every gesture must produce a **readable first frame** within ~80 ms, then a **lingering field** for 2–8 s. If the first frame is invisible, the user concludes the control is broken. That is why over-damped waves and black ponds failed.

Phenomenological loop:

1. Orientation — lit water, not void  
2. Action — pointer writes height *and* matter  
3. Feedback — ring / marble / bubble must be nameable  
4. Recovery — Clear, undo last stroke (missing)  
5. Closure — export plate / keep recipe

Missing today: **undo**, **export**, **named events as first-class**, **letter stamp**.

---

## 3. Underlying math (what is already in the shaders)

### 3.1 Height field — 2D wave equation

Discrete wave on a regular grid, CFL-stable mix toward the stencil average:

\[
h^{n+1} = \bigl(2\,\mathrm{avg}(h^n) - h^{n-1}\bigr)\,d
\]

with 8-tap average

\[
\mathrm{avg} = \frac{N_4 + 0.5\,N_8}{6}
\]

and drive

\[
h \leftarrow \mathrm{mix}(h,\; h^{n+1},\; c),\quad
c = \mathrm{mix}(0.28,\,0.55,\,f)
\]

where \(f\) is frequency, \(d\) is viscosity-derived damping. Mirror sampling

\[
u' = 1 - |1 - |u||
\]

implements Neumann walls (rebound). Film mass extra-damps:

\[
h \leftarrow h\cdot\mathrm{mix}(1,\,0.975,\,m\,\rho)
\]

**Why it raced, then crawled:** \(c \approx 0.9\) is nearly one cell per step; at 640×360 and 60 Hz the long axis crosses in ~10 s. Dropping \(c\) to ~0.45 halves screen-space speed without changing topology.

### 3.2 Film — advection + weak Gray–Scott

Velocity from height gradient + curl:

\[
\mathbf{u} = \alpha\nabla h + \beta\,J\nabla h + (0,\,\gamma b)
\]

semi-Lagrangian lookup \(F(\mathbf{x} - \mathbf{u}\Delta t)\), then

\[
p \leftarrow p + \mathrm{clamp}\bigl(\nabla^2 p\cdot(p-0.4)\cdot s,\,-0.14,\,0.14\bigr)
\]

This is why veins appear: the RD term sharpens fronts; curl stretches them into filaments.

### 3.3 Thin film — Airy reflectance

Optical path \(\delta = 4\pi\,d\,\cos I / \lambda\) per channel:

\[
R(\lambda) = \sin^2\!\left(\frac{4\pi\,d\cos I}{\lambda}\right)
\]

with \(\lambda_{rgb} \approx (0.68,\,0.53,\,0.42)\). Envelope kills Newton’s black at \(d\to 0\). Film amount must be **gated by deposited matter**, or empty water inherits soap-black.

### 3.4 Lighting

\[
\mathbf{L} = (\cos\phi\cos\theta,\;\sin\theta,\;\sin\phi\cos\theta)
\]

Lambert + Blinn spec + Fresnel + Laplacian caustic \( (-\nabla^2 h)_+ \) + anisotropic cat-eye

\[
\kappa = \bigl(1 - |\hat n_{xz}\cdot(\cos\phi,\sin\phi)|\bigr)^p
\]

Cat-eye is the magnetic-polish mechanism. It should be a **tool**, not only a chrome side-effect.

### 3.5 Drops

Pulse \(e^{-r^2/\sigma^2}\), ring \(e^{-(r/\sigma-1.2)^2}\), swirl \(e^{-r^2}\sin(k\theta + r/\sigma)\). Same kernels write film when painting.

---

## 4. WebGL performance and the crash line

### 4.1 What Wake allocates now

Two height ping-pong textures + two film ping-pong + display blit.

At sim \(W\times H\), RGBA16F (8 bytes/texel) × 4 targets:

\[
M_{\text{sim}} = 4\cdot W\cdot H\cdot 8
\]

Display buffer at CSS × DPR, RGBA8:

\[
M_{\text{fb}} \approx 4\cdot w_{\text{css}}\cdot\mathrm{dpr}\cdot h_{\text{css}}\cdot\mathrm{dpr}
\]

Worked examples:

| Class | Sim | Display @ dpr | Sim VRAM | FB VRAM | Steps/frame | Fill |
|---|---|---|---|---|---|---|
| Phone safe | 384 long | 390×844 @ 2 | ~4.7 MB | ~2.6 MB | 1 | low |
| Current Wake | 640 long | 1280×800 @ 2 | ~7–12 MB | ~8 MB | 2 | medium |
| Desktop lush | 1024 long | 1920×1080 @ 2 | ~32 MB | ~16 MB | 2 | high |
| Reckless | 2048 long + RGBA32F + 4 extra passes | 4k @ 3 | 100–250 MB | 50+ MB | 3–4 | crashy |

Sim memory is not the usual killer. **Display resolution × dpr × passes × float format** is.

### 4.2 Device floors (survey + MDN)

- `MAX_TEXTURE_SIZE` ≥ 4096 on 100% of WebGL2 reports; ≥ 8192 on most iOS/desktop; Android often 4096–8192.  
- Do not author to 16384. The spec does not promise the RAM for \(N^2\).  
- `EXT_color_buffer_float` (needed for RGBA16F/32F *render targets*) exists in Safari 15+ / iOS 15+, Chrome 56+, Firefox 51+. iOS historically prefers **16F over 32F**; `OES_texture_float_linear` and `EXT_float_blend` are still flaky. Wake’s packed-8 fallback is the correct mobile path.  
- iOS Safari jetsam: GPU process often dies in the **400–700 MB** resident band under leak or 4k×float. Plan peak **< 150 MB GPU** for mobile WebGL, **< 80 MB** for low phones.  
- Context loss on tab background / thermal throttle is normal. Must rebuild FBOs on `webglcontextrestored`.  
- Tiled mobile GPUs: `invalidateFramebuffer` after sim ping-pong or the tile store bandwidth doubles.  
- `readPixels` every frame will hitch. Export must be **on demand**, PBO-delayed or downsample first.

### 4.3 Render-limit policy (ship this)

```ts
type Tier = "low" | "mid" | "high";

function classify(gl: WebGL2RenderingContext): Tier {
  const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const floatRT = !!gl.getExtension("EXT_color_buffer_float");
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const mobile = matchMedia("(pointer: coarse)").matches;
  if (!floatRT || mem <= 4 || (mobile && cores <= 6)) return "low";
  if (maxTex >= 8192 && mem >= 8 && !mobile) return "high";
  return "mid";
}

const TIERS = {
  low:  { long: 384, dprCap: 1.5, maxSteps: 1, format: "packed8" as const },
  mid:  { long: 640, dprCap: 2.0, maxSteps: 2, format: "rgba16f" as const },
  high: { long: 960, dprCap: 2.0, maxSteps: 2, format: "rgba16f" as const },
};
```

Watchdog: if `dt` p99 > 32 ms for 45 frames, drop one tier and rebuild sim textures. Never grow sim with CSS size — only with tier.

### 4.4 Shader budget

Display already samples height 9+ times, film 5+, voronoi 9 cells, Airy twice. That is near the **mobile fragment cliff**. Enhancements that are cheap vs expensive:

| Cheap | Expensive (defer / gate) |
|---|---|
| Palette lift, vein from existing grad | Extra sim field (velocity RG) |
| Cat-eye as uniform, not extra pass | Particle bubble instances > 2k |
| Downsample display 0.75 then blit | RGBA32F |
| `invalidateFramebuffer` | `readPixels` every frame |
| One UBO for light+params | Per-drop CPU uniform storms |
| mediump in display (not sim) | Fullscreen blur stack |

Do not add a third full-res field until low-tier is proven at 30 fps on a mid Android.

---

## 5. What the effect is *for*

The surface is a **generative plate**. Same fields, four products.

### 5.1 Exportable textures for 3D

Bake at rest (or a chosen freeze frame):

- **Albedo** — current display minus spec (or a dedicated “flat film” shader)  
- **Normal** — \(\mathbf{n} = \mathrm{normalize}((h_x, 1, h_z))\) packed  
- **Roughness** — inverse of thickness + foam  
- **Thickness / mask** — film.g, film.r  
- **Height** — packed \(h\) for displacement

Use as: ground decals, soap-bubble cards, iridescent armor trim, potion liquids, title-screen oceans. Export PNG 1k/2k (not 4k on mobile). Optional EXR only on desktop.

```ts
function bake(gl: WebGL2RenderingContext, w: number, h: number, prog: WebGLProgram) {
  // render dedicated bake shader into RGBA8 FBO at w×h (cap 2048)
  const pixels = new Uint8Array(w * h * 4);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels); // once, user-initiated
  // flip Y, toBlob('image/png')
}
```

### 5.2 Typography

Letter as **dam**: SDF or atlas mask writes height + thick on keydown. Waves wrap the glyph; oil pools in counters; melt recipe raises viscosity and lets film drip in \(+y\).

This is the melted-type reference. Interaction: type → surface occupies the letter → Space pulses through it.

### 5.3 Surfaces / materials

Recipes already are materials. Productize as **presets you can save and apply to a mesh preview** (a sphere / phone back / nail tip) using the baked maps. The nail-polish and phone-back photos are literally this: the field wrapped onto an object.

### 5.4 Live instrument (keep)

The app as-is: a plate you play. This is the core loop. Do not bury it under a game HUD.

---

## 6. Gamification (agency, not points)

Architecture: **Flow + mastery**. The puzzle is *reading the field*.

| Mechanic | How | Skill | Feedback | Anti-manipulation |
|---|---|---|---|---|
| Plate challenges | Recreate a still (soap heart, gold vein, cat-eye slash) | Seeing material cause | Side-by-side ghost, not a score | Ghost is optional; no streak punishment |
| Event combos | Pulse then swirl within a window to lock a typhoon | Timing + mode literacy | Field itself changes character | Window is visible, not hidden RNG |
| Light lock | Match a target caustic / cat-eye | Spatial light control | Pad snaps when close | Snap is assist, can disable |
| Export gallery | Freeze a plate, name it | Taste / authorship | The image is the reward | No likes-as-oxygen |
| Remix seed | Load another plate’s film as initial condition | Collaboration | Immediate visual | Opt-in only |

Generative endgame: the user becomes a **material author** — saves a recipe + baked maps, not a high score.

Avoid: daily energy, randomized loot palettes, infinite “one more swirl” variable rewards.

---

## 7. Build order (dependencies first)

Reasoning: keep the plate playable; add verbs before systems; add export before 3D preview; add game only after the verbs are nameable.

| Step | Ship | Why this order | Risk if skipped |
|---|---|---|---|
| **B0** | Water default stays lit; void is a recipe | User already rejected black pond | Identity collapse |
| **B1** | Undo last stroke (height+film snapshot ring, 8 deep) | Recovery is missing; Clear is too coarse | Fear of playing |
| **B2** | Device tier + watchdog + `invalidateFramebuffer` | Unlocks everything else on phones | Silent crash |
| **B3** | Freeze + PNG export (display + optional normal/height) | Makes the effect *useful* | Pretty toy only |
| **B4** | Letter stamp (SDF atlas, 26 glyphs) | Melts the type references into a verb | Typography stays a mood board |
| **B5** | Gravity drip pass (optional film.y advection) | Drip photos become a recipe | Still “stirred pond” only |
| **B6** | Bake pack (albedo/normal/rough/thick) + sphere preview | 3D/game use | Export is flat-only |
| **B7** | Challenge plates (3 ghosts: ripple, soap, vein) | Gamify without HUD bloat | Game bolted on |
| **B8** | Multi-ink (film as RYB or two pigment channels) | True oil-pour chroma | Palettes fake multi-hue |
| **B9** | WebGPU compute path behind flag | Headroom, not a rewrite | Premature |

Do not start B8 or B9 before B2 is measured on a mid Android and an iPhone.

---

## 8. Code examples (drop-in direction)

### 8.1 Undo ring

```ts
const UNDO = 8;
const history: { h: Uint8Array; f: Uint8Array }[] = [];

function snapshot() {
  // pack current height+film via cheap downsample blit, not full readback
  history.push(readSimPacked());
  if (history.length > UNDO) history.shift();
}

function undo() {
  const s = history.pop();
  if (s) writeSimPacked(s);
}
```

Snapshot on pointer-up, not per move.

### 8.2 Export without stalling the sim

```ts
async function exportPng(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
  if (!blob) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `wake-${Date.now()}.png`;
  a.click();
  URL.revokeObjectURL(a.href);
}
```

For maps, switch `uBakeMode` (0 display, 1 normal, 2 height, 3 thick) and export a zip of four PNGs.

### 8.3 Letter dam (fragment add)

```glsl
uniform sampler2D uGlyph; // SDF, 1 = interior
float g = texture(uGlyph, vUv).r;
float edge = smoothstep(0.48, 0.52, g);
h += amp * edge;
thick += 0.4 * edge;
```

### 8.4 Context-loss rebuild

```ts
canvas.addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  stopLoop();
});
canvas.addEventListener("webglcontextrestored", () => {
  rebuildAllGpu();
  startLoop();
});
```

---

## 9. Ranked ideas → user response → intended outcome

Score = (user delight × usefulness × fit to current engine) / implementation risk. 1 = do next, 10 = later or no.

| Rank | Idea | User response we want | Intended outcome | Fit | Risk |
|---|---|---|---|---|---|
| 1 | Lit-water default + void as recipe | “This is a pond, not a screensaver void” | Trust the surface | already in motion | low |
| 2 | Undo last stroke | “I can play harder” | Longer sessions | 8-slot CPU pack | low |
| 3 | Freeze + PNG export | “I made this” | Authorship, share card from *their* plate | canvas.toBlob | low |
| 4 | Device tier + thermal watchdog | Page does not crash on a phone | Stay in the tab | policy table | med |
| 5 | Letter-as-dam typography | “The word is a shoreline” | Unique instrument | SDF atlas | med |
| 6 | Bake pack for 3D (albedo/normal/thick) | “I can put this on a mesh” | Game/tool pipeline | 3 extra shaders | med |
| 7 | Challenge ghosts (recreate a still) | “I can see what mastery looks like” | Literacy of Pulse/Ring/Swirl/Lamp | overlay | med |
| 8 | Gravity drip recipe | Matches pour/drip stills | New verb without new field | film advection +Y | med |
| 9 | Sphere / nail / phone-back preview | “This is a material, not a canvas” | Productizes recipes | three.js or fake sphere | med |
| 10 | Multi-ink channels | Oil pours with adjacent hues | Closes the biggest visual gap | extra sim bandwidth | high |
| 11 | Countable bubble particles | Heart-of-bubbles still | Toy delight | instance budget | high |
| 12 | WebGPU compute fluids | Headroom / brag | Same verbs, more res | rewrite path | high |
| 13 | Multiplayer shared plate | Relatedness | Social instrument | net + conflict | high |
| 14 | Points / streaks / energy | Cheap retention | None we want | — | reject |

---

## 10. Decision

Wake is already a **playable plate** with the right operators (wave, film, Airy, curl, cat-eye). The photos ask for **verbs, recovery, and output** — not another slider.

Next concrete slice: **B1 undo + B3 export**, on top of the lit pond. That turns the effect into something a person can keep.
