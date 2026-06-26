// Rate-limiting en mémoire pour les endpoints publics (anti-abus / anti-flood).
// Le serveur SSR tourne en process unique par conteneur → une Map suffit.
// Empêche qu'un script inonde la boîte du festival et épuise le quota SMTP.

const WINDOW_MS = 60 * 60 * 1000; // on conserve 1 h d'historique par IP
const RULES = [
  { ms: 60 * 1000, max: 5 }, // 5 requêtes / minute
  { ms: 60 * 60 * 1000, max: 30 }, // 30 requêtes / heure
];

const store = new Map(); // ip -> [timestamps]

/**
 * @returns {{ ok: boolean, retryAfter?: number }} retryAfter en secondes si bloqué.
 */
export function checkRateLimit(ip) {
  const key = ip || 'unknown';
  const now = Date.now();
  const times = (store.get(key) || []).filter((t) => now - t < WINDOW_MS);

  for (const rule of RULES) {
    const inWindow = times.filter((t) => now - t < rule.ms);
    if (inWindow.length >= rule.max) {
      store.set(key, times);
      const retryAfter = Math.max(1, Math.ceil((rule.ms - (now - inWindow[0])) / 1000));
      return { ok: false, retryAfter };
    }
  }

  times.push(now);
  store.set(key, times);

  // Purge légère : on évite que la Map grossisse indéfiniment.
  if (store.size > 5000) {
    for (const [k, v] of store) {
      const fresh = v.filter((t) => now - t < WINDOW_MS);
      if (fresh.length) store.set(k, fresh);
      else store.delete(k);
    }
  }

  return { ok: true };
}

/** IP cliente réelle, en tenant compte du reverse proxy (X-Forwarded-For). */
export function clientIp(request, clientAddress) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return clientAddress || 'unknown';
}
