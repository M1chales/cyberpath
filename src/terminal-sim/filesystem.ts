import type { VDir, VFile, VNode } from './types'

export function dir(children: Record<string, VNode>, mode = 0o755, owner = 'root', group = 'root'): VDir {
  return { type: 'dir', children, mode, owner, group }
}

export function file(content: string, mode = 0o644, owner = 'root', group = 'root'): VFile {
  return { type: 'file', content, mode, owner, group }
}

export function normalizePath(cwd: string, input: string): string {
  const base = input.startsWith('/') ? [] : cwd.split('/').filter(Boolean)
  const parts = input.split('/').filter(Boolean)
  const stack = [...base]
  for (const part of parts) {
    if (part === '.') continue
    else if (part === '..') stack.pop()
    else stack.push(part)
  }
  return '/' + stack.join('/')
}

export function getNode(root: VDir, path: string): VNode | undefined {
  if (path === '/') return root
  const parts = path.split('/').filter(Boolean)
  let current: VNode = root
  for (const part of parts) {
    if (current.type !== 'dir') return undefined
    const next: VNode | undefined = current.children[part]
    if (!next) return undefined
    current = next
  }
  return current
}

export function getParentDir(root: VDir, path: string): { parent: VDir; name: string } | undefined {
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return undefined
  const name = parts[parts.length - 1]
  const parentPath = '/' + parts.slice(0, -1).join('/')
  const parentNode = getNode(root, parentPath)
  if (!parentNode || parentNode.type !== 'dir') return undefined
  return { parent: parentNode, name }
}

export function formatMode(mode: number, isDir: boolean): string {
  const bits = mode.toString(8).padStart(3, '0')
  const chars = bits
    .split('')
    .map((digit) => {
      const n = parseInt(digit, 10)
      return `${n & 4 ? 'r' : '-'}${n & 2 ? 'w' : '-'}${n & 1 ? 'x' : '-'}`
    })
    .join('')
  return (isDir ? 'd' : '-') + chars
}

export function parseMode(input: string, current: number): number | null {
  if (/^[0-7]{3,4}$/.test(input)) {
    const octal = input.length === 4 ? input.slice(1) : input
    return parseInt(octal, 8)
  }
  // minimal symbolic support: things like o-rw, o-r, o-w, go-w, o=
  const symbolic = /^(u|g|o|a|ug|go|ugo)?([+\-=])([rwx]*)$/.exec(input)
  if (symbolic) {
    const [, who = 'a', op, perms] = symbolic
    const targets = who === 'a' ? ['u', 'g', 'o'] : who.split('')
    let mode = current
    for (const target of targets) {
      const shift = target === 'u' ? 6 : target === 'g' ? 3 : 0
      let bits = 0
      if (perms.includes('r')) bits |= 4
      if (perms.includes('w')) bits |= 2
      if (perms.includes('x')) bits |= 1
      const mask = 0b111 << shift
      if (op === '-') mode &= ~(bits << shift)
      else if (op === '+') mode |= bits << shift
      else mode = (mode & ~mask) | (bits << shift)
    }
    return mode
  }
  return null
}
