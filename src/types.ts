export type ScaleMode = 'cinematic' | 'ratio'

export type PlanetFactMap = {
  radius: string
  distanceFromSun: string
  dayLength: string
  yearLength: string
  moons: string
  temperature?: string
}

export type MoonTextureSet = {
  albedo?: string
}

export type PlanetTextureSet = {
  albedo?: string
  normal?: string
  roughness?: string
  specular?: string
  clouds?: string
  emissive?: string
  ring?: string
  moon?: MoonTextureSet
}

export type RingConfig = {
  inner: number
  outer: number
  opacity: number
  tint: string
}

export type PlanetDefinition = {
  name: string
  subtitle: string
  description: string
  facts: PlanetFactMap
  radiusEarth: number
  distanceAU: number
  yearSeconds: number
  rotationSeconds: number
  tiltDeg: number
  baseColors: [string, string, string?]
  cratered?: boolean
  banding?: boolean
  clouds?: boolean
  emissive?: string
  ring?: RingConfig
  textures?: PlanetTextureSet
}

export type CameraFocusRequest = {
  target: [number, number, number]
  camera: [number, number, number]
  label?: string
}
