import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ENABLE_TEXTURES } from '../lib/renderConfig'

function createSunTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#ffdd8a')
  gradient.addColorStop(0.4, '#ff9f43')
  gradient.addColorStop(0.8, '#ff6a00')
  gradient.addColorStop(1, '#ffd670')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 220; i += 1) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`
    ctx.beginPath()
    ctx.ellipse(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 70 + 10,
      Math.random() * 14 + 2,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function useSunTexture() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const { gl } = useThree()

  useEffect(() => {
    if (!ENABLE_TEXTURES) return
    const loader = new THREE.TextureLoader()
    loader.load(
      '/textures/8k_sun.jpg',
      (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace
        loaded.generateMipmaps = true
        loaded.minFilter = THREE.LinearMipmapLinearFilter
        loaded.magFilter = THREE.LinearFilter
        loaded.anisotropy = gl.capabilities.getMaxAnisotropy()
        setTexture(loaded)
      },
      undefined,
      () => {
        // Falls back to procedural sun.
      },
    )
  }, [gl])

  return texture
}

export function Sun() {
  const ref = useRef<THREE.Mesh>(null)
  const proceduralTexture = useMemo(() => createSunTexture(), [])
  const loadedTexture = useSunTexture()

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05
  })

  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={5200} distance={2600} decay={2} color="#ffd18a" />
      <mesh ref={ref}>
        <sphereGeometry args={[7.4, 112, 112]} />
        <meshStandardMaterial map={loadedTexture ?? proceduralTexture ?? undefined} emissive="#ff9e38" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[8.4, 56, 56]} />
        <meshBasicMaterial color="#ffb45e" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[9.6, 48, 48]} />
        <meshBasicMaterial color="#ff8a24" transparent opacity={0.025} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}
