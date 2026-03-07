# Premium Solar System App

A production-style one-page React + Three.js app for macOS-friendly local development.

## Included upgrades

- click directly on a planet mesh to focus it
- clickable planet chips to fly camera to that planet
- modern info UI with facts
- reset scene button
- ambient space dust
- subtle sun flare glow
- asteroid belt between Mars and Jupiter
- high-quality procedural textures by default
- texture-ready pipeline for real 4K / 8K assets
- automatic postinstall fix for the `three-stdlib` sourcemap issue you hit earlier

## Run locally on macOS

```bash
cd /path/to/solar-system-premium
npm install
npm run dev
```

If Vite complains about Node version, use Node 20.19+ or Node 22+.

## Production build

```bash
npm run build
npm run preview
```

## Texture workflow

The project works immediately **without external textures**.

By default it uses higher-quality procedural planet materials.

### To switch to real textures

1. Put your texture files into:

```bash
public/textures/
```

Suggested structure:

```bash
public/textures/
  sun/
    sun_map_8k.jpg
  mercury/
    mercury_map_4k.jpg
  venus/
    venus_map_4k.jpg
  earth/
    earth_map_8k.jpg
    earth_normal_8k.jpg
    earth_roughness_8k.jpg
    earth_clouds_4k.png
  mars/
    mars_map_4k.jpg
    mars_normal_4k.jpg
  jupiter/
    jupiter_map_8k.jpg
  saturn/
    saturn_map_8k.jpg
    saturn_ring_4k.png
  uranus/
    uranus_map_4k.jpg
    uranus_ring_2k.png
  neptune/
    neptune_map_4k.jpg
```

2. Open:

```bash
src/lib/renderConfig.ts
```

3. Change:

```ts
export const ENABLE_TEXTURES = false
```

to:

```ts
export const ENABLE_TEXTURES = true
```

4. Restart dev server.

## Where to get textures

Fastest route:
- use the Solar System Scope texture pack as your main starter pack
- optionally replace Earth assets with NASA Blue Marble data for best Earth quality

## Recommended quality mix

Best balance between realism and performance:

- Sun: 8K
- Earth: 8K
- Jupiter: 8K
- Saturn: 8K
- Mercury / Venus / Mars / Uranus / Neptune: 4K
- Earth clouds: 4K PNG
- Saturn rings: 4K PNG
- Uranus rings: 2K PNG

## Notes

- True real-size planet distances are compressed for an interactive cinematic experience.
- Planet order and scientifically informed size relationships are preserved.
- If you want literal astrophysical distances in one scene, the camera would need extreme scaling and the scene would become much less usable.

## Good next upgrades

- orbit speed controls
- pause / resume animation
- hover states with glow outlines
- planet-by-planet guided tour mode
- texture preloader with stronger progress UI
- HDR skybox replacement
# 3dplanets
