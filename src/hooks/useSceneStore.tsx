import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { CameraFocusRequest, PlanetDefinition, ScaleMode } from '../types'

interface SceneStoreValue {
  selectedPlanet: PlanetDefinition | null
  scaleMode: ScaleMode
  focusRequest: CameraFocusRequest | null
  focusVersion: number
  resetVersion: number
  setScaleMode: (mode: ScaleMode) => void
  selectPlanet: (planet: PlanetDefinition | null, request?: CameraFocusRequest | null) => void
  requestReset: () => void
  setPlanetPosition: (name: string, position: [number, number, number]) => void
  getPlanetPosition: (name: string) => [number, number, number] | undefined
}

const SceneStore = createContext<SceneStoreValue | null>(null)

export function SceneProvider({ children }: PropsWithChildren) {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetDefinition | null>(null)
  const [scaleMode, setScaleMode] = useState<ScaleMode>('cinematic')
  const [focusRequest, setFocusRequest] = useState<CameraFocusRequest | null>(null)
  const [focusVersion, setFocusVersion] = useState(0)
  const [resetVersion, setResetVersion] = useState(0)
  const positionsRef = useRef<Record<string, [number, number, number]>>({})

  const selectPlanet = useCallback((planet: PlanetDefinition | null, request?: CameraFocusRequest | null) => {
    setSelectedPlanet(planet)
    setFocusRequest(request ?? null)
    if (request) setFocusVersion((value) => value + 1)
  }, [])

  const requestReset = useCallback(() => {
    setSelectedPlanet(null)
    setFocusRequest(null)
    setResetVersion((value) => value + 1)
  }, [])

  const setPlanetPosition = useCallback((name: string, position: [number, number, number]) => {
    positionsRef.current[name] = position
  }, [])

  const getPlanetPosition = useCallback((name: string) => positionsRef.current[name], [])

  const value = useMemo(
    () => ({
      selectedPlanet,
      scaleMode,
      focusRequest,
      focusVersion,
      resetVersion,
      setScaleMode,
      selectPlanet,
      requestReset,
      setPlanetPosition,
      getPlanetPosition,
    }),
    [
      selectedPlanet,
      scaleMode,
      focusRequest,
      focusVersion,
      resetVersion,
      setScaleMode,
      selectPlanet,
      requestReset,
      setPlanetPosition,
      getPlanetPosition,
    ],
  )

  return <SceneStore.Provider value={value}>{children}</SceneStore.Provider>
}

export function useSceneStore() {
  const context = useContext(SceneStore)
  if (!context) throw new Error('useSceneStore must be used within SceneProvider')
  return context
}
