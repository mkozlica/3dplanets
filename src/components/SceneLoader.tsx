import { Html, useProgress } from '@react-three/drei'

export function SceneLoader() {
  const { progress, item, loaded, total } = useProgress()

  return (
    <Html center>
      <div className="loader-card">
        <div className="loader-eyebrow">Loading cinematic assets</div>
        <div className="loader-title">Preparing the solar system</div>
        <div className="loader-bar">
          <span style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="loader-meta">
          <strong>{progress.toFixed(0)}%</strong>
          <span>
            {loaded}/{total}
          </span>
        </div>
        <div className="loader-item">{item || 'Compiling textures, rings, dust and shaders…'}</div>
      </div>
    </Html>
  )
}
