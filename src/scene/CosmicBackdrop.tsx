import { useEffect, useMemo, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ENABLE_TEXTURES } from '../lib/renderConfig'

function createBackdropTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#030613')
  gradient.addColorStop(1, '#010207')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 7000; i += 1) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const r = Math.random() * 1.4
    const a = Math.random() * 0.8
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

function useBackdropTexture() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const { gl } = useThree()

  useEffect(() => {
    if (!ENABLE_TEXTURES) return
    const loader = new THREE.TextureLoader()
    const candidates = ['/textures/8k_stars_milky_way.jpg', '/textures/8k_stars.jpg']
    let cancelled = false

    const tryLoad = (index: number) => {
      if (index >= candidates.length || cancelled) return
      loader.load(
        candidates[index],
        (loaded) => {
          if (cancelled) return
          loaded.colorSpace = THREE.SRGBColorSpace
          loaded.mapping = THREE.EquirectangularReflectionMapping
          loaded.anisotropy = gl.capabilities.getMaxAnisotropy()
          setTexture(loaded)
        },
        undefined,
        () => tryLoad(index + 1),
      )
    }

    tryLoad(0)
    return () => {
      cancelled = true
    }
  }, [gl])

  return texture
}

export function CosmicBackdrop() {
  const proceduralTexture = useMemo(() => createBackdropTexture(), [])
  const loadedTexture = useBackdropTexture()
  const texture = loadedTexture ?? proceduralTexture

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[1800, 96, 96]} />
      <meshBasicMaterial map={texture ?? undefined} side={THREE.BackSide} fog={false} />
    </mesh>
  )
}
