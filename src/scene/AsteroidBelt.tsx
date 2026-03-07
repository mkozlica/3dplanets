import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function AsteroidBelt() {
  const ref = useRef<THREE.InstancedMesh>(null)

  const data = useMemo(() => {
    const count = 900
    const dummy = new THREE.Object3D()
    const transforms: Array<{ position: THREE.Vector3; rotation: THREE.Euler; scale: number }> = []

    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2
      const radius = 43 + Math.random() * 11
      const y = (Math.random() - 0.5) * 1.1
      transforms.push({
        position: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius),
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        scale: Math.random() * 0.22 + 0.05,
      })
    }

    return { count, dummy, transforms }
  }, [])

  useEffect(() => {
    if (!ref.current) return
    data.transforms.forEach((transform, index) => {
      data.dummy.position.copy(transform.position)
      data.dummy.rotation.copy(transform.rotation)
      data.dummy.scale.setScalar(transform.scale)
      data.dummy.updateMatrix()
      ref.current!.setMatrixAt(index, data.dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [data])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.006
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, data.count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#72675c" roughness={1} metalness={0} />
    </instancedMesh>
  )
}
