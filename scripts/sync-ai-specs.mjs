#!/usr/bin/env node
// Mirrors the canonical ai-specs/ folder into the agent-specific folders.
// Windows without Developer Mode cannot create symlinks, so we copy instead.
// Run after adding, renaming or removing anything in ai-specs/: npm run sync:ai-specs
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const MANIFEST = '.ai-specs-managed.json'

const targets = [
  { source: 'ai-specs/skills', dest: '.claude/skills' },
  { source: 'ai-specs/skills', dest: '.agents/skills' },
  { source: 'ai-specs/agents', dest: '.claude/agents' },
]

for (const { source, dest } of targets) {
  const sourceDir = path.join(root, source)
  const destDir = path.join(root, dest)
  fs.mkdirSync(destDir, { recursive: true })

  const manifestPath = path.join(destDir, MANIFEST)
  const previous = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : []
  const current = fs.readdirSync(sourceDir).filter((name) => !name.startsWith('.'))

  // Remove entries this script created earlier that no longer exist in ai-specs.
  for (const name of previous.filter((n) => !current.includes(n))) {
    fs.rmSync(path.join(destDir, name), { recursive: true, force: true })
    console.log(`removed ${dest}/${name}`)
  }

  for (const name of current) {
    const target = path.join(destDir, name)
    fs.rmSync(target, { recursive: true, force: true })
    fs.cpSync(path.join(sourceDir, name), target, { recursive: true })
  }
  fs.writeFileSync(manifestPath, JSON.stringify(current, null, 2) + '\n')
  console.log(`${source} -> ${dest} (${current.length})`)
}
