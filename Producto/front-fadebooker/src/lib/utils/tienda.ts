import { Tienda } from '@/types';

// Returns whether the tienda is open based on horario_apertura/horario_cierre and dias_laborales.
export function isTiendaOpen(tienda: Tienda, now = new Date()): { open: boolean; reason?: string } {
  if (tienda.este_activa === false || tienda.este_activa === 0) {
    return { open: false, reason: 'inactiva' };
  }

  const apertura = tienda.horario_apertura || '10:00';
  const cierre = tienda.horario_cierre || '20:00';

  // Extract HH:mm from various possible formats: 'HH:mm', 'HH:mm:ss', ISO 'YYYY-MM-DDTHH:MM:SS', or strings containing time.
  const extractHM = (t: any) => {
    if (!t) return null;
    const s = String(t);
    // Regex to find HH:MM
    const m = s.match(/(\d{2}:\d{2})/);
    if (m) return m[1];
    return null;
  };

  const parseTime = (t: any) => {
    const hm = extractHM(t) || '00:00';
    const parts = hm.split(':').map(p => parseInt(p, 10));
    return { h: parts[0] || 0, m: parts[1] || 0 };
  };

  try {
    const a = parseTime(apertura);
    const c = parseTime(cierre);
    const todayH = now.getHours();
    const todayM = now.getMinutes();
    const nowMinutes = todayH * 60 + todayM;
    const aperturaMinutes = a.h * 60 + a.m;
    const cierreMinutes = c.h * 60 + c.m;

    // If cierre is less than apertura assume closes after midnight
    let open = false;
    if (cierreMinutes >= aperturaMinutes) {
      open = nowMinutes >= aperturaMinutes && nowMinutes < cierreMinutes;
    } else {
      // e.g., apertura 18:00 cierre 02:00
      open = nowMinutes >= aperturaMinutes || nowMinutes < cierreMinutes;
    }

    return { open };
  } catch (e) {
    return { open: true };
  }
}

export function formatHorarioRange(apertura?: string, cierre?: string) {
  const extractHM = (t?: any) => {
    if (!t) return null;
    const s = String(t);
    const m = s.match(/(\d{2}:\d{2})/);
    return m ? m[1] : null;
  };
  const a = extractHM(apertura) || '10:00';
  const c = extractHM(cierre) || '20:00';
  return `${a} - ${c}`;
}

export default { isTiendaOpen, formatHorarioRange };
