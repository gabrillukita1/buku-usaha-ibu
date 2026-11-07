const PREFIX = 'bu_'

export function load(key, fallback) {
  try {
    const v = localStorage.getItem(PREFIX + key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {}
}

export const uid = () => Date.now() + Math.floor(Math.random() * 1000)
export const today = () => new Date().toISOString().slice(0, 10)
export const fmtRp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID')
export const fmtTgl = (s) =>
  new Date(s + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

export const fmtTglPanjang = (s) =>
  new Date(s + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export function greeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export function weekRange(offset) {
  const now = new Date()
  const day = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - day + 1 + offset * 7)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { start: monday.toISOString().slice(0, 10), end: sunday.toISOString().slice(0, 10) }
}
