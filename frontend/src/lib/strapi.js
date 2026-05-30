// Helpers pour parler à l'API Strapi.
// En SSR (runtime), les variables viennent de process.env (injectées par Docker).

const INTERNAL =
  process.env.STRAPI_INTERNAL_URL || 'http://localhost:1337';
const PUBLIC =
  process.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

/** Construit l'URL absolue d'un média Strapi. */
export function mediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return PUBLIC + path;
}

/**
 * Appelle l'API REST de Strapi.
 * @param {string} endpoint  ex: 'articles'
 * @param {object} params    paramètres de requête (populate, sort, filters…)
 * @returns {Promise<{data: any}>}  renvoie { data: [] } en cas d'erreur (pas de crash).
 */
export async function fetchAPI(endpoint, params = {}) {
  const url = new URL(`${INTERNAL}/api/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // Le site reste debout même si Strapi est vide ou indisponible.
    console.error(`[strapi] échec de la requête "${endpoint}" :`, err.message);
    return { data: [] };
  }
}
