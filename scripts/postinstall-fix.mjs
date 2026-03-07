import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const loaderPath = join(process.cwd(), 'node_modules/three-stdlib/loaders/TDSLoader.js')
const mapPath = join(process.cwd(), 'node_modules/three-stdlib/loaders/TDSLoader.js.map')

try {
  if (existsSync(loaderPath)) {
    const source = readFileSync(loaderPath, 'utf8')
    const patched = source.replace(/\n\/\/\# sourceMappingURL=TDSLoader\.js\.map\s*$/m, '')
    if (patched !== source) {
      writeFileSync(loaderPath, patched, 'utf8')
      console.log('Patched TDSLoader sourcemap reference.')
    }
  }

  if (existsSync(mapPath)) {
    rmSync(mapPath, { force: true })
    console.log('Removed broken TDSLoader sourcemap file.')
  }
} catch (error) {
  console.warn('Postinstall patch skipped:', error)
}
