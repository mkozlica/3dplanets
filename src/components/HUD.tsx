import { InfoPanel } from './InfoPanel'
import { PlanetChips } from './PlanetChips'
import { useSceneStore } from '../hooks/useSceneStore'

export function HUD() {
  const { scaleMode, setScaleMode, requestReset } = useSceneStore()

  return (
    <>
      <header className="hud-top">
        <section className="glass-card hero-card">
          <div className="eyebrow">Interactive 3D solar system</div>
          <h1>Premium cinematic planet explorer</h1>
          <p>
            Drag to orbit, scroll to zoom, click planets to focus, and switch between cinematic and ratio-aware
            presentation modes.
          </p>
        </section>

        <section className="hud-actions">
          <div className="glass-card action-card">
            <button
              className={`mode-button ${scaleMode === 'cinematic' ? 'mode-button--active' : ''}`}
              onClick={() => setScaleMode('cinematic')}
            >
              Cinematic mode
            </button>
            <button
              className={`mode-button ${scaleMode === 'ratio' ? 'mode-button--active' : ''}`}
              onClick={() => setScaleMode('ratio')}
            >
              Scale ratio mode
            </button>
            <button className="mode-button mode-button--reset" onClick={requestReset}>
              Reset scene
            </button>
          </div>
        </section>
      </header>

      <aside className="hud-side">
        <InfoPanel />
      </aside>

      <footer className="hud-bottom">
        <PlanetChips />
      </footer>
    </>
  )
}
