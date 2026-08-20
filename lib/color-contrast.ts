const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export function normalizeHexColor(value: string | null | undefined, fallback: string): string {
  const candidate = (value || '').trim()
  if (!HEX_COLOR.test(candidate)) return fallback
  if (candidate.length === 4) {
    return `#${candidate[1]}${candidate[1]}${candidate[2]}${candidate[2]}${candidate[3]}${candidate[3]}`.toLowerCase()
  }
  return candidate.toLowerCase()
}

function parseHex(value: string): [number, number, number] {
  const normalized = normalizeHexColor(value, '#000000').slice(1)
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ]
}

function relativeLuminance(value: string): number {
  return parseHex(value)
    .map((channel) => {
      const srgb = channel / 255
      return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
    })
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0)
}

export function contrastRatio(background: string, foreground: string): number {
  const backgroundLuminance = relativeLuminance(background)
  const foregroundLuminance = relativeLuminance(foreground)
  const lighter = Math.max(backgroundLuminance, foregroundLuminance)
  const darker = Math.min(backgroundLuminance, foregroundLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

export function ensureAccessibleTextColor(
  background: string | null | undefined,
  requested: string | null | undefined,
  minimumRatio = 4.5,
): string {
  const safeBackground = normalizeHexColor(background, '#123cde')
  const safeRequested = normalizeHexColor(requested, '#ffffff')
  if (contrastRatio(safeBackground, safeRequested) >= minimumRatio) return safeRequested

  const candidates = ['#071a4d', '#ffffff']
  return candidates
    .sort((a, b) => contrastRatio(safeBackground, b) - contrastRatio(safeBackground, a))[0]
}
