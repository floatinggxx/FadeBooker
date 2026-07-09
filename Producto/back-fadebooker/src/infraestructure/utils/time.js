const CHILE_TIMEZONE = 'America/Santiago'

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatChileDate(parts) {
  return `${pad(parts.year)}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`
}

function getChileDateParts(date = new Date()) {
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
  const part = (type) => parts.find((item) => item.type === type)?.value || '00'

  return {
    year: Number(part('year')),
    month: Number(part('month')),
    day: Number(part('day')),
    hour: Number(part('hour')),
    minute: Number(part('minute')),
    second: Number(part('second'))
  }
}

function getChileNowString(date = new Date()) {
  return formatChileDate(getChileDateParts(date))
}

function getChileTodayString(date = new Date()) {
  return getChileNowString(date).slice(0, 10)
}

function normalizeDateTimeString(dateTime) {
  if (!dateTime) return null
  const normalized = String(dateTime).trim().replace(' ', 'T')
  const dateTimeString = normalized.length === 16 ? `${normalized}:00` : normalized
  // Allow either YYYY-MM-DDTHH:mm or YYYY-MM-DD HH:mm:ss or ISO-like
  const match = dateTimeString.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})$/)
  return match ? `${match[1]}T${match[2]}` : null
}

function parseChileDateTimeString(dateTime) {
  const normalized = normalizeDateTimeString(dateTime)
  if (!normalized) return null
  const [date, time] = normalized.split('T')
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute, second] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute, second)
}

function isChileDateTimeInPast(dateTime) {
  const normalized = normalizeDateTimeString(dateTime)
  if (!normalized) return false
  return normalized < getChileNowString()
}

module.exports = {
  CHILE_TIMEZONE,
  getChileDateParts,
  getChileNowString,
  getChileTodayString,
  normalizeDateTimeString,
  isChileDateTimeInPast
}
