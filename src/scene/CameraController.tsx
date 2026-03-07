import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useSceneStore } from '../hooks/useSceneStore'
import { DEFAULT_CAMERA_POSITION, DEFAULT_TARGET } from '../lib/renderConfig'

export function CameraController() {
  const controlsRef = useRef<any>(null)
  const cameraGoal = useRef(new THREE.Vector3(...DEFAULT_CAMERA_POSITION))
  const targetGoal = useRef(new THREE.Vector3(...DEFAULT_TARGET))
  const cameraVector = useMemo(() => new THREE.Vector3(), [])
  const targetVector = useMemo(() => new THREE.Vector3(), [])
  const isAnimating = useRef(false)
  const isUserInteracting = useRef(false)
  const { camera } = useThree()
  const { focusRequest, focusVersion, resetVersion } = useSceneStore()

  useEffect(() => {
    camera.position.set(...DEFAULT_CAMERA_POSITION)
  }, [camera])

  useEffect(() => {
    if (!focusRequest) return
    cameraGoal.current.set(...focusRequest.camera)
    targetGoal.current.set(...focusRequest.target)
    isAnimating.current = true
  }, [focusRequest, focusVersion])

  useEffect(() => {
    cameraGoal.current.set(...DEFAULT_CAMERA_POSITION)
    targetGoal.current.set(...DEFAULT_TARGET)
    isAnimating.current = true
  }, [resetVersion])

  useFrame((_, delta) => {
    if (!controlsRef.current) return

    if (!isAnimating.current || isUserInteracting.current) {
      controlsRef.current.update()
      return
    }

    cameraVector.copy(camera.position).lerp(cameraGoal.current, 1 - Math.exp(-delta * 2.8))
    targetVector.copy(controlsRef.current.target).lerp(targetGoal.current, 1 - Math.exp(-delta * 2.8))

    camera.position.copy(cameraVector)
    controlsRef.current.target.copy(targetVector)
    controlsRef.current.update()

    const cameraDone = camera.position.distanceTo(cameraGoal.current) < 0.08
    const targetDone = controlsRef.current.target.distanceTo(targetGoal.current) < 0.08

    if (cameraDone && targetDone) {
      camera.position.copy(cameraGoal.current)
      controlsRef.current.target.copy(targetGoal.current)
      controlsRef.current.update()
      isAnimating.current = false
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.72}
      zoomSpeed={0.85}
      panSpeed={0.5}
      minDistance={14}
      maxDistance={360}
      maxPolarAngle={Math.PI * 0.495}
      onStart={() => {
        isUserInteracting.current = true
        isAnimating.current = false
      }}
      onEnd={() => {
        isUserInteracting.current = false
      }}
    />
  )
}
