import { PLANETS } from '../data/planets'
import { useSceneStore } from '../hooks/useSceneStore'
import { distanceForAU, radiusForEarth } from '../lib/math'
import type { PlanetDefinition } from '../types'

function buildFocusRequest(
  planet: PlanetDefinition,
  mode: 'cinematic' | 'ratio',
  livePosition?: [number, number, number],
) {
  const radius = radiusForEarth(planet.radiusEarth, mode)
  const target: [number, number, number] = livePosition ?? [distanceForAU(planet.distanceAU, mode), 0, 0]
  const camera: [number, number, number] = [target[0] + radius * 4.8, target[1] + radius * 1.4, target[2] + radius * 5.4]
  return { target, camera, label: planet.name }
}

export function PlanetChips() {
  const { scaleMode, selectPlanet, selectedPlanet, getPlanetPosition } = useSceneStore()

  return (
    <div className="chip-wrap">
      {PLANETS.map((planet) => (
        <button
          key={planet.name}
          className={`chip ${selectedPlanet?.name === planet.name ? 'chip--active' : ''}`}
          onClick={() => selectPlanet(planet, buildFocusRequest(planet, scaleMode, getPlanetPosition(planet.name)))}
        >
          {planet.name}
        </button>
      ))}
    </div>
  )
}
