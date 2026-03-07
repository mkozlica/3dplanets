import { SceneProvider } from './hooks/useSceneStore'
import { HUD } from './components/HUD'
import { SolarSystemCanvas } from './scene/SolarSystemCanvas'

export default function App() {
  return (
    <SceneProvider>
      <main className="app-shell">
        <SolarSystemCanvas />
        <HUD />
      </main>
    </SceneProvider>
  )
}
