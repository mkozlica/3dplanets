import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { SolarScene } from './SolarScene'

export function SolarSystemCanvas() {
  return (
    <div className="canvas-shell">
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.96
        }}
      >
        <SolarScene />
      </Canvas>
    </div>
  )
}
