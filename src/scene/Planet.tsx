import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useSceneStore } from '../hooks/useSceneStore'
import { radiusForEarth, distanceForAU } from '../lib/math'
import { ENABLE_TEXTURES } from '../lib/renderConfig'
import type { PlanetDefinition } from '../types'
import { OrbitRing } from './OrbitRing'

function createProceduralTexture(def: PlanetDefinition, size = 2048) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size / 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createLinearGradient(0, 0, size, canvas.height)
  gradient.addColorStop(0, def.baseColors[0])
  gradient.addColorStop(0.5, def.baseColors[1])
  gradient.addColorStop(1, def.baseColors[2] || def.baseColors[0])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, canvas.height)

  for (let y = 0; y < canvas.height; y += 4) {
    const ratio = y / canvas.height
    const wobble = Math.sin(ratio * Math.PI * 8) * 20
    const alpha = def.banding ? 0.18 : 0.06
    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.fillRect(wobble, y, size, 2)
  }

  if (def.cratered) {
    for (let i = 0; i < 420; i += 1) {
      const x = Math.random() * size
      const y = Math.random() * canvas.height
      const r = Math.random() * 16 + 1
      ctx.beginPath()
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.18})`
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  if (def.name === 'Earth') {
    for (let i = 0; i < 18; i += 1) {
      ctx.beginPath()
      ctx.fillStyle = i % 2 ? 'rgba(34,139,34,0.85)' : 'rgba(56,114,73,0.8)'
      ctx.ellipse(
        Math.random() * size,
        Math.random() * canvas.height,
        Math.random() * 110 + 40,
        Math.random() * 45 + 20,
        Math.random() * Math.PI,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function createProceduralRingTexture(tint: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const color = new THREE.Color(tint)

  for (let x = 0; x < canvas.width; x += 1) {
    const alpha = Math.max(0.04, Math.min(0.85, 0.15 + Math.sin(x * 0.05) * 0.14 + Math.random() * 0.24))
    ctx.fillStyle = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`
    ctx.fillRect(x, 0, 1, canvas.height)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

function createInvertedGrayscaleTexture(source: THREE.Texture | undefined) {
  if (!source?.image) return undefined
  const image = source.image as CanvasImageSource & { width?: number; height?: number }
  const width = (image as any).naturalWidth || (image as any).videoWidth || image.width
  const height = (image as any).naturalHeight || (image as any).videoHeight || image.height
  if (!width || !height) return undefined

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return undefined

  ctx.drawImage(image as CanvasImageSource, 0, 0, width, height)
  const img = ctx.getImageData(0, 0, width, height)
  const data = img.data
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    const inverted = 255 - avg
    data[i] = inverted
    data[i + 1] = inverted
    data[i + 2] = inverted
  }
  ctx.putImageData(img, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

type LoadedTextures = Partial<Record<'albedo' | 'normal' | 'roughness' | 'specular' | 'clouds' | 'emissive' | 'ring' | 'moon', THREE.Texture>>

function useOptionalTextures(def: PlanetDefinition) {
  const textures = useRef<LoadedTextures>({})
  const [, setVersion] = useState(0)
  const { gl } = useThree()

  useEffect(() => {
    if (!ENABLE_TEXTURES) return
    const loader = new THREE.TextureLoader()
    const entries: Array<[keyof LoadedTextures, string]> = []
    const textureEntries = def.textures ?? {}

    for (const [key, path] of Object.entries(textureEntries)) {
      if (key === 'moon' && path && typeof path === 'object' && 'albedo' in path && path.albedo) {
        entries.push(['moon', path.albedo])
      } else if (typeof path === 'string') {
        entries.push([key as keyof LoadedTextures, path])
      }
    }

    entries.forEach(([key, path]) => {
      loader.load(
        path,
        (texture) => {
          texture.colorSpace = key === 'normal' || key === 'roughness' || key === 'specular' ? THREE.NoColorSpace : THREE.SRGBColorSpace
          texture.generateMipmaps = true
          texture.minFilter = THREE.LinearMipmapLinearFilter
          texture.magFilter = THREE.LinearFilter
          texture.anisotropy = gl.capabilities.getMaxAnisotropy()
          textures.current[key] = texture
          setVersion((value) => value + 1)
        },
        undefined,
        () => {
          // Falls back to procedural rendering if a file is missing or unsupported.
        },
      )
    })
  }, [def, gl])

  return textures
}

function Moon({ parentRadius, texture }: { parentRadius: number; texture?: THREE.Texture }) {
  const pivotRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const proceduralTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#c8c8c8')
    gradient.addColorStop(0.5, '#9b9b9b')
    gradient.addColorStop(1, '#ececec')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < 280; i += 1) {
      ctx.beginPath()
      ctx.fillStyle = `rgba(40,40,40,${Math.random() * 0.18})`
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 12 + 2, 0, Math.PI * 2)
      ctx.fill()
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (pivotRef.current) pivotRef.current.rotation.y = t / 6.8
    if (meshRef.current) meshRef.current.rotation.y = t / 5.6
  })

  return (
    <group ref={pivotRef} rotation={[THREE.MathUtils.degToRad(5), 0, 0]}>
      <mesh ref={meshRef} position={[parentRadius * 2.35, parentRadius * 0.14, 0]} castShadow receiveShadow>
        <sphereGeometry args={[parentRadius * 0.27, 48, 48]} />
        <meshStandardMaterial map={texture ?? proceduralTexture ?? undefined} roughness={0.96} metalness={0.01} />
      </mesh>
    </group>
  )
}

export function Planet({ def }: { def: PlanetDefinition }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const cloudRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const positionRef = useRef<[number, number, number]>([0, 0, 0])
  const { scaleMode, selectPlanet, selectedPlanet, setPlanetPosition } = useSceneStore()
  const loadedTextures = useOptionalTextures(def)

  const radius = useMemo(() => radiusForEarth(def.radiusEarth, scaleMode), [def.radiusEarth, scaleMode])
  const orbitRadius = useMemo(() => distanceForAU(def.distanceAU, scaleMode), [def.distanceAU, scaleMode])
  const proceduralTexture = useMemo(() => createProceduralTexture(def), [def])
  const proceduralRingTexture = useMemo(() => (def.ring ? createProceduralRingTexture(def.ring.tint) : null), [def.ring])
  const derivedRoughness = useMemo(
    () => createInvertedGrayscaleTexture(loadedTextures.current.roughness ?? loadedTextures.current.specular),
    [loadedTextures.current.roughness, loadedTextures.current.specular],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const angle = (t / def.yearSeconds) * Math.PI * 2
    const next: [number, number, number] = [Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius]
    positionRef.current = next
    setPlanetPosition(def.name, next)

    if (groupRef.current) {
      groupRef.current.position.set(...next)
      groupRef.current.rotation.z = THREE.MathUtils.degToRad(def.tiltDeg)
    }
    if (meshRef.current) meshRef.current.rotation.y = t / def.rotationSeconds
    if (cloudRef.current) cloudRef.current.rotation.y = t / (def.rotationSeconds * 1.18)
  })

  const focusPlanet = () => {
    const position = positionRef.current
    const target: [number, number, number] = position
    const camera: [number, number, number] = [
      position[0] + radius * 4.8,
      position[1] + radius * 1.35,
      position[2] + radius * 5.2,
    ]
    selectPlanet(def, { target, camera, label: def.name })
  }

  const segments = def.radiusEarth > 3 ? 112 : 80
  const isActive = selectedPlanet?.name === def.name
  const textures = loadedTextures.current
  const isEarth = def.name === 'Earth'
  const ringTexture = textures.ring ?? proceduralRingTexture ?? undefined

  return (
    <>
      <OrbitRing radius={orbitRadius} />
      <group ref={groupRef}>
        <mesh ref={meshRef} castShadow receiveShadow onClick={focusPlanet}>
          <sphereGeometry args={[radius, segments, segments]} />
          {isEarth ? (
            <meshPhysicalMaterial
              map={textures.albedo ?? proceduralTexture ?? undefined}
              normalMap={textures.normal}
              roughnessMap={derivedRoughness}
              emissiveMap={textures.emissive}
              roughness={0.68}
              metalness={0.02}
              clearcoat={0.22}
              clearcoatRoughness={0.62}
              emissive={new THREE.Color(textures.emissive ? '#4e6cff' : '#000000')}
              emissiveIntensity={textures.emissive ? 0.36 : 0}
            />
          ) : (
            <meshStandardMaterial
              map={textures.albedo ?? proceduralTexture ?? undefined}
              normalMap={textures.normal}
              roughnessMap={derivedRoughness}
              emissiveMap={textures.emissive}
              roughness={0.92}
              metalness={0.02}
              emissive={new THREE.Color(def.emissive || '#000000')}
              emissiveIntensity={0.1}
            />
          )}
        </mesh>

        {def.clouds ? (
          <mesh ref={cloudRef}>
            <sphereGeometry args={[radius * 1.014, 64, 64]} />
            <meshStandardMaterial
              map={textures.clouds}
              color={def.name === 'Venus' ? '#f2d6b3' : '#eef6ff'}
              transparent
              opacity={def.name === 'Venus' ? 0.15 : 0.26}
              depthWrite={false}
            />
          </mesh>
        ) : null}

        {isEarth ? <Moon parentRadius={radius} texture={textures.moon} /> : null}

        {def.ring && ringTexture ? (
          <group rotation={[Math.PI / 2.5, 0, 0]}>
            <mesh>
              <ringGeometry args={[radius * def.ring.inner, radius * def.ring.outer, 256]} />
              <meshStandardMaterial
                alphaMap={ringTexture}
                color={def.ring.tint}
                transparent
                opacity={def.ring.opacity}
                side={THREE.DoubleSide}
                roughness={1}
                metalness={0}
                depthWrite={false}
              />
            </mesh>
            <mesh>
              <ringGeometry args={[radius * (def.ring.inner * 0.985), radius * (def.ring.outer * 1.02), 256]} />
              <meshBasicMaterial
                alphaMap={ringTexture}
                color="#fff4d7"
                transparent
                opacity={def.ring.opacity * 0.22}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        ) : null}

        <Html position={[0, radius * 1.42, 0]} center distanceFactor={14}>
          <div className={`scene-label ${isActive ? 'scene-label--active' : ''}`}>{def.name}</div>
        </Html>
      </group>
    </>
  )
}
