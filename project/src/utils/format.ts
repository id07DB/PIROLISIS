/**
 * Formatea un número usando coma decimal (convención española).
 */
export function fmt(value: number, decimals = 3): string {
  if (isNaN(value) || !isFinite(value)) return '—';
  return value.toFixed(decimals).replace('.', ',');
}

/**
 * Formatea un porcentaje con coma decimal.
 */
export function fmtPercent(value: number, decimals = 2): string {
  if (isNaN(value) || !isFinite(value)) return '—';
  return value.toFixed(decimals).replace('.', ',') + ' %';
}

/**
 * Convierte una fracción (0-1) a porcentaje con coma decimal.
 */
export function fmtFractionAsPercent(value: number, decimals = 2): string {
  return fmtPercent(value * 100, decimals);
}

/**
 * Formatea una fecha y hora en español.
 */
export function fmtDateTime(date: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Madrid',
  };
  return date.toLocaleString('es-ES', opts);
}

/**
 * Formatea una fecha en formato ISO para nombres de archivo.
 */
export function fmtFileDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}
