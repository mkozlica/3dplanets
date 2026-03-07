import { useMemo } from 'react'
import * as THREE from 'three'

export function OrbitRing({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i <= 256; i += 1) {
      const angle = (i / 256) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [radius])

  return (
    <line geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <lineBasicMaterial color="#334261" transparent opacity={0.4} />
    </line>
  )
}
