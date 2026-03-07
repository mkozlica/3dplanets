export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export function distanceForAU(au: number, mode: 'cinematic' | 'ratio') {
  if (mode === 'ratio') return Math.log2(au + 1) * 18 + 8
  return Math.sqrt(au) * 14 + 6
}

export function radiusForEarth(radiusEarth: number, mode: 'cinematic' | 'ratio') {
  if (mode === 'ratio') return clamp(Math.pow(radiusEarth, 0.55) * 0.85, 0.45, 6.8)
  return clamp(Math.pow(radiusEarth, 0.48) * 1.05, 0.55, 5.5)
}
