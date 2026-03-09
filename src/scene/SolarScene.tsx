import { Suspense, useEffect } from 'react'
import { PerspectiveCamera, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANETS } from '../data/planets'
import { useSceneStore } from '../hooks/useSceneStore'
import { SceneLoader } from '../components/SceneLoader'
import { AsteroidBelt } from './AsteroidBelt'
import { CosmicBackdrop } from './CosmicBackdrop'
import { CameraController } from './CameraController'
import { Planet } from './Planet'
import SpaceDust from './SpaceDust'
import { Sun } from './Sun'

function SceneFog() {
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#03050b', 0.0032)
    return () => {
      scene.fog = null
    }
  }, [scene])

  return null
}

export function SolarScene() {
  const { scaleMode } = useSceneStore()

  return (
    <>
      <color attach="background" args={['#02040a']} />
      <PerspectiveCamera makeDefault fov={42} near={0.1} far={4000} position={[0, 42, 120]} />
      <SceneFog />
      <ambientLight intensity={0.08} />
      <CosmicBackdrop />
      <Stars radius={760} depth={280} count={4200} factor={3.2} saturation={0} fade speed={0.25} />
      <SpaceDust />

      <Suspense fallback={<SceneLoader />}>
        <Sun />
        {PLANETS.map((planet) => (
          <Planet key={`${planet.name}-${scaleMode}`} def={planet} />
        ))}
        <AsteroidBelt />
      </Suspense>

      <CameraController />

      <EffectComposer multisampling={2}>
        <Bloom intensity={0.7} luminanceThreshold={0.38} luminanceSmoothing={0.45} mipmapBlur />
        <Vignette eskil={false} offset={0.16} darkness={0.92} />
      </EffectComposer>
    </>
  )
}
