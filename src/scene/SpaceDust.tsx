import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SpaceDust() {
  const ref = useRef<THREE.Points>(null)

  const { positions } = useMemo(() => {
    const count = 2400
    const pos = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      const radius = 220 + Math.random() * 760
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi) * 0.42
      const z = radius * Math.sin(phi) * Math.sin(theta)
      pos.set([x, y, z], i * 3)
    }

    return { positions: pos }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.002
    ref.current.rotation.x += delta * 0.00025
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#d7e5ff" size={0.48} transparent opacity={0.24} depthWrite={false} sizeAttenuation />
    </points>
  )
}
