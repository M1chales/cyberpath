import { generateWorld } from './generator'
import type { ConsoleWorld } from './types'

export const CONSOLE_STORAGE_KEY = 'cyberpath.console.v5'
const STORAGE_KEY = CONSOLE_STORAGE_KEY

export function loadWorld(): ConsoleWorld {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.version === 5 && Array.isArray(parsed.hosts) && parsed.scripts) return parsed as ConsoleWorld
    }
  } catch {
    // fall through to fresh world
  }
  const seed = Math.floor(Math.random() * 2 ** 31)
  const fresh = generateWorld(seed)
  saveWorld(fresh)
  return fresh
}

export function saveWorld(world: ConsoleWorld) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(world))
  } catch {
    // storage unavailable — world just won't persist this session
  }
}

export function resetWorld(): ConsoleWorld {
  const seed = Math.floor(Math.random() * 2 ** 31)
  const fresh = generateWorld(seed)
  saveWorld(fresh)
  return fresh
}
