import { useMemo } from 'react'
import * as THREE from 'three'

type OrbitRingProps = {
  radius: number
}

export default function OrbitRing({ radius }: OrbitRingProps) {
  const lineObject = useMemo(() => {
    const points: THREE.Vector3[] = []

    for (let i = 0; i <= 256; i++) {
      const angle = (i / 256) * Math.PI * 2
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        )
      )
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: '#3f4b66',
      transparent: true,
      opacity: 0.35,
    })

    const line = new THREE.LineLoop(geometry, material)
    line.rotation.x = -Math.PI / 2

    return line
  }, [radius])

  return <primitive object={lineObject} />
}