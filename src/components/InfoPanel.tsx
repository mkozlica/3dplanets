import { useSceneStore } from '../hooks/useSceneStore'

export function InfoPanel() {
  const { selectedPlanet } = useSceneStore()

  if (!selectedPlanet) {
    return (
      <aside className="glass-card info-panel info-panel--empty">
        <div className="eyebrow">Focused view</div>
        <h2>Select a planet</h2>
        <p>
          Click a planet in the scene or use the planet chips to fly the camera in and reveal planet facts.
        </p>
      </aside>
    )
  }

  const { facts } = selectedPlanet

  return (
    <aside className="glass-card info-panel">
      <div className="eyebrow">Focused view</div>
      <h2>{selectedPlanet.name}</h2>
      <div className="planet-subtitle">{selectedPlanet.subtitle}</div>
      <p>{selectedPlanet.description}</p>
      <div className="fact-grid">
        <Fact label="Radius" value={facts.radius} />
        <Fact label="Sun distance" value={facts.distanceFromSun} />
        <Fact label="Day length" value={facts.dayLength} />
        <Fact label="Year length" value={facts.yearLength} />
        <Fact label="Moons" value={facts.moons} />
        {facts.temperature ? <Fact label="Temperature" value={facts.temperature} /> : null}
      </div>
    </aside>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
