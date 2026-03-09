import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type SpaceDustProps = {
  count?: number
  radius?: number
}

export default function SpaceDust({
  count = 1200,
  radius = 260,
}: SpaceDustProps) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.35
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }

    return arr
  }, [count, radius])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        color="#d8d3c5"
      />
    </points>
  )
}