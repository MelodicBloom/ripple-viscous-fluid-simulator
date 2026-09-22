# Wake — bounded architecture for three surface bugs

Scope lock. This document only covers:

1. Pond stays lit after the first mark (no black crater).
2. Swirl rotates existing matter (no printed whirlpool decal).
3. Bubbles are a byproduct of thrash (no wallpaper lattice).

Wave rebound, viscosity, and strength are the sibling change in `SIM_FRAG` / `damping()` / `dropAmp()`. They stay. Nothing else is in scope.

---

## 1. Field architecture (bounded)

Two GPU fields, four targets, one display blit.

```
pointer / keys
    │
    ▼
queueStroke() ──► drops[] ── flushDrops() ──► DROP_FRAG  ── height ping-pong
                 │                            FILM_DROP_FRAG ── film ping-pong
                 └── mode==2 ──► vortices[6]
                                      │
tick 60 Hz                            │
    ├─ simStep()   SIM_FRAG           │
    ├─ filmStep()  FILM_SIM + uVortex[i]
    └─ render()    DISPLAY_FRAG
```

| Buffer | Format | Channels | Who writes | Who reads |
|---|---|---|---|---|
| height A/B | RGBA16F or packed RGBA8 | R=h, G=h_prev | DROP, SIM | SIM, FILM_SIM, DISPLAY |
| film A/B | same | R=pigment, G=thickness, B=foam | FILM_DROP, FILM_SIM | FILM_SIM, SIM (mass damp), DISPLAY |
| vortices | CPU, max 6 | x,y,k,rad,life | queueStroke(mode 2) | FILM_SIM uniforms |

Hard caps (mobile crash line):

- Sim long side 640. Never follow CSS size.
- Max 3 sim steps / frame.
- Max 12 drops / flush batch.
- Max 6 live vortices. Nearby stirs merge.
- No third full-res field. Vortex list is CPU so swirl does not cost another FBO.

---

## 2. Bug A — black on first mark

### Cause

Display used height as albedo:

```glsl
t = clamp(h * 1.15 + 0.5 + ndl * 0.14, 0.0, 1.0);
n  = normalize(vec3((hl-hr)*12.0, 1.2, (hd-hu)*12.0));
color = albedo * (0.48 + 0.62 * ndl);
```

A trough slams `t → 0` (darkest stop). A drop steepens `n`, Lambert collapses. Film then *replaced* the pond with Airy, which is Newton-black when thin. CSS `#1a5c66` only showed before the first WebGL blit.

`fract(marbleT)` wrapped painted regions onto that same black stop.

### Decision

Height is a ripple **on** a pond, not the pond. Palette sample stays in the mid band. Lighting never multiplies below ~0.78 of albedo. Film is an additive tint gated by deposited matter.

### Edit (`DISPLAY_FRAG`)

```glsl
vec3 n = normalize(vec3((hl-hr)*4.2, 2.2, (hd-hu)*4.2));
float t = clamp(0.54 + h * 0.18 + ndl * 0.05, 0.28, 0.86);
float marbleT = clamp(t + pigment * 0.22 + marbleAng * 0.04 + thick * 0.12, 0.2, 0.95);
vec3 color = albedo * (0.78 + 0.28 * ndl);
float filmAmt = mix(0.03, 0.62, uThickness) * (thick * 1.05 + pigment * 0.75);
vec3 soap = color * 0.62 + filmCol * 1.15;
color = mix(color, soap, clamp(filmAmt, 0.0, 0.55));
```

Airy empty mix is wet teal `(0.12, 0.32, 0.38)`, not black.

### Why these numbers

| Term | Old | New | Reason |
|---|---|---|---|
| h scale on t | 1.15 | 0.18 | trough cannot reach stop 0 |
| t floor | 0.0 | 0.28 | abyss stay mid-cyan |
| normal xz | 12 | 4.2 | drop does not flatten n.y |
| n.y | 1.2 | 2.2 | keep lambert alive |
| lambert floor | 0.48 | 0.78 | crater cannot go black |
| filmAmt cap | 0.78 | 0.55 | soap cannot eat the pond |
| marbleT | fract | clamp | no wrap to black |

Performance: same sample count. Cheaper normals (no extra taps).

---

## 3. Bug B — swirl printed a spiral

### Cause

`DROP_FRAG` and `FILM_DROP` both did `sin(angle * k + r)`. That is a decal. Film advection only followed `∇h`, so pigment did not orbit.

### Decision

Two operators, two jobs:

- Height drop: bowl + dipole. Seeds a typhoon **wave**, not a graphic.
- Film: live vortex list. Tangential flow orbits whatever is already on the plate.

### Wiring

`queueStroke(..., mode=2)` merges a vortex within 0.09 UV of an existing one (drag does not spawn six fighters). `filmStep()` uploads `uVortex[6]` + `uVortexCount`.

```glsl
vec2 tang = vec2(-d.y, d.x);
flow += tang * uVortex[i].z * env * 2.4;
```

Life decays `0.38 / s` (~2.6 s). Clear wipes the list.

### Why not a velocity FBO

A third ping-pong is +8 MB at 640 and another full-screen pass. Six vec4 uniforms are enough for “stir the dish.” If we later need persistent gyres after the finger leaves for 10 s, *then* add a RG16F flow field on high tier only.

---

## 4. Bug C — bubbles as wallpaper

### Cause

```glsl
live = inside * (0.18 + foam * 1.05) * mix(0.12, 1.0, uBubbles);
```

`0.18` and the slider floor `0.12` drew a disk in every voronoi cell at rest.

### Decision

Voronoi stays as a *cheap sphere lookup*, but it is invisible unless foam is high. Foam is only written from kinetic thrash in `FILM_SIM`.

```glsl
// FILM_SIM
float thrash = length(grad)*3.4 + max(-lap,0.0)*2.6 + max(hNow,0.0);
foam += thrash * uBubble * (0.22 + pigment*0.55) * 0.055;
foam *= mix(0.97, 0.945, uBubble);

// DISPLAY
float live = inside * smoothstep(0.16, 0.52, foam) * uBubbles;
```

Still pond + bubbles slider up: no circles (foam ≈ 0). Swirl through oil: shear writes foam, spheres appear, then `* 0.97` pops them.

Performance: same 9-cell voronoi. Do not instance particles. Particles would be the next budget fight.

---

## 5. Wave sibling (so the three fixes have a readable field)

```glsl
float lap = avg - h;
float c2 = mix(0.52, 0.92, uFreq);
float hNew = (2.0 * h - p + lap * c2) * uDamping;
hNew *= mix(1.0, 0.9, wall);           // rebound loses force
```

```ts
damping() { return 0.9982 - viscosity * 0.012; }
dropAmp(i) { return (0.09 + strength * 0.46) * i; }
```

Mirror UV is Neumann rebound. Viscosity and strength remain first-class.

---

## 6. Interaction map

| Input | Writes height | Writes film | Writes vortex | Foam |
|---|---|---|---|---|
| drag / Space pulse | Gaussian | pigment+thick | no | only if bubbles>0 and crest |
| R ring | annulus | annulus | no | crest |
| V / swirl chip | bowl+dipole | soft disk | yes, merged | thrash along shear |
| WASD edge | pulse line | yes | no | rim |
| C clear | zero | zero | zero | zero |

---

## 7. QA

1. Load Water. Pond is teal before touch.
2. One tap. Teal remains. A ring travels. Troughs are darker teal, not black.
3. Wait. Ring hits a corner and returns quieter.
4. Viscosity up: same path, dies sooner. Strength 3: taller rings, still teal.
5. Paint oil, then V. Color rotates around the point. No printed spiral arms.
6. Bubbles slider up, do not touch. No lattice.
7. Thrash a swirl through oil with bubbles up. Spheres along the shear, then fade.
8. Clear. Teal, no circles, no leftover gyre.
