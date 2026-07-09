export const CHILE_TIMEZONE = 'America/Santiago'

function pad(value: string | number) {
  return String(value).padStart(2, '0')
}

function formatChileDateTime(parts: Record<string, string | number>) {
  return `${pad(parts.year)}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`
}

export function getChileDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: CHILE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const parts = formatter.formatToParts(date)
  const part = (type: string) => parts.find((p) => p.type === type)?.value || '00'

  return {
    year: part('year'),
    month: part('month'),
    day: part('day'),
    hour: part('hour'),
    minute: part('minute'),
    second: part('second')
  }
}

export function getChileNowString(date = new Date()) {
  return formatChileDateTime(getChileDateParts(date))
}

export function getChileTodayString(date = new Date()) {
  return getChileNowString(date).slice(0, 10)
}

export function getChileNowTimeString(date = new Date()) {
  return getChileNowString(date).slice(11)
}

export function getChileDateTimeLocalInputString(date = new Date()) {
  const parts = getChileDateParts(date)
  return `${pad(parts.year)}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`
}

export function isChileDateTimeInPast(chileDateTime: string, now = new Date()) {
  const normalized = String(chileDateTime).trim().replace(' ', 'T').substring(0, 19)
  return normalized < getChileNowString(now)
}
