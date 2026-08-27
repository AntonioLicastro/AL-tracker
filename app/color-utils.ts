// Initials shown inside each calendar dot so identity never depends on
// color alone — with 19 people, no palette can make every pair reliably
// distinct at a glance (verified: even the best achievable spread tops
// out well short of a comfortable margin), so this is the real fix.
export function initialsFor(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

// WCAG relative luminance, used to pick black or white text so it stays
// legible against whichever color a person's dot happens to be.
export function readableTextColor(hex: string) {
  const c = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16) / 255)
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return luminance > 0.42 ? '#1a1a1a' : '#ffffff'
}
