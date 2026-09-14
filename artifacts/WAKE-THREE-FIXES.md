# Wake — three fixes (swirl, bubbles, black-on-move)

Apply in `src/components/ripple/engine.ts`.

## Why it goes black the moment you move

Resting water uses a mid palette stop (`t ≈ 0.5` → teal). A stroke writes large `h` (crests and troughs). Current lighting does this:

```glsl
float t = clamp(h * 1.15 + 0.5 + ndl * 0.14, 0.0, 1.0);
vec3 n = normalize(vec3((hl-hr)*12.0, 1.2, (hd-hu)*12.0));
vec3 color = albedo * (0.48 + 0.62 * ndl);
```

A trough (`h = -0.5`) clamps `t` to **0** (darkest stop). Steep normals from a drop collapse `n.y`, so `ndl` collapses, so Lambert multiplies that dark stop toward black. Film then replaces the pond with Airy (Newton black) wherever you painted.

The canvas CSS teal never had a chance. WebGL overwrites it on the first sim step.

**Rule:** height is a *ripple on a pond*, not the pond’s albedo.

```glsl
// still water stays teal even in troughs
float t = clamp(0.52 + h * 0.16 + ndl * 0.06, 0.22, 0.88);
vec3 n = normalize(vec3((hl-hr)*4.0, 2.2, (hd-hu)*4.0));
vec3 color = albedo * (0.78 + 0.22 * ndl);
```

And film only tints where matter exists — additive, not a replace-to-black:

```glsl
float filmAmt = mix(0.04, 0.7, uThickness) * (thick * 1.1 + pigment * 0.85);
color = mix(color, color * 0.55 + filmCol * 1.25, clamp(filmAmt, 0.0, 0.65));
```

Remove `fract(...)` marble wraps onto the black stop. Use `clamp` instead.

---

## Why swirl does not swirl

Swirl currently **stamps a spiral** into height and pigment (`sin(ang*3 + r)`). The film then advects a little along `∇h`. That is a printed whirlpool, not a rotating dish.

**Fix:** keep a list of live vortices on the CPU. Each swirl gesture pushes one. The film shader *orbits* existing pigment around those points.

```ts
type Vortex = { x: number; y: number; k: number; life: number };
// on swirl drop:
this.vortices.push({ x, y, k: 0.35 * Math.sign(amp) || 0.35, life: 2.8 });
// each tick: life -= dt; drop if life <= 0
// pass first 6 as uVortex[i] = vec4(x,y,k*life,radius)
```

```glsl
// FILM_SIM — after computing flow from height:
for (int i = 0; i < 6; i++) {
  vec2 d = vUv - uVortex[i].xy;
  d.x *= uAspect;
  float env = exp(-dot(d,d) / max(uVortex[i].w * uVortex[i].w, 1e-5));
  vec2 tang = vec2(-d.y, d.x);
  flow += tang * uVortex[i].z * env * 1.8;
}
```

The *thing already on the plate* rotates. Height can still get the spiral stamp for the wave look.

---

## Why bubbles look like a wallpaper

Display plants a voronoi lattice over the whole screen, then shows a disk in every cell:

```glsl
float live = inside * (0.18 + foam * 1.05) * mix(0.12, 1.0, uBubbles);
```

`0.18` and the slider floor `0.12` draw circles at rest. Foam is decoration on a pattern.

**Fix:** no bubble unless foam is high. Foam is only *written* by thrash.

```glsl
// FILM_SIM foam source
float thrash = length(grad) * 4.0 + max(-lap, 0.0) * 3.0 + max(crest, 0.0);
foam += thrash * uBubble * 0.045;
foam *= 0.975; // pop / fade
foam = clamp(foam, 0.0, 1.0);
```

```glsl
// DISPLAY — only where foam lives
float live = inside * smoothstep(0.18, 0.55, foam) * mix(0.0, 1.0, uBubbles);
```

If `uBubbles = 0` or the pond is still: zero circles. Thrash a swirl through oil: foam spikes along the shear, spheres appear, then pop.

---

## Clear-surface check

After these three, Clear must show **teal water with no lattice**. First drag must leave **colored rings on teal**, not a black crater. First V must **rotate existing color**, not print a decal.
