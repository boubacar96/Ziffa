// Helpers pour parler à l'API Strapi.
// En SSR (runtime), les variables viennent de process.env (injectées par Docker).

// En dev (astro dev) : les variables viennent de frontend/.env via import.meta.env.
// En prod (Docker) : elles viennent de process.env injecté par docker-compose.
const INTERNAL =
  import.meta.env.STRAPI_INTERNAL_URL || process.env.STRAPI_INTERNAL_URL || 'http://localhost:1337';
const PUBLIC =
  import.meta.env.PUBLIC_STRAPI_URL || process.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

/** Construit l'URL absolue d'un média Strapi. */
export function mediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return PUBLIC + path;
}

/** Renvoie la liste d'URLs absolues d'un champ média simple OU multiple. */
export function mediaUrls(field) {
  if (!field) return [];
  const arr = Array.isArray(field) ? field : [field];
  return arr.map((m) => (m && m.url ? mediaUrl(m.url) : null)).filter(Boolean);
}

// Cache mémoire (durée de vie du process) pour éviter un appel oEmbed à chaque rendu.
const _vimeoThumbCache = {};
/** Récupère l'URL de la miniature (couverture) d'une vidéo Vimeo. null si indisponible. */
export async function getVimeoThumb(url) {
  if (!url) return null;
  if (url in _vimeoThumbCache) return _vimeoThumbCache[url];
  let thumb = null;
  try {
    const m = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)(?:\?h=|\/)?([0-9a-f]+)?/i);
    const pageUrl = m ? `https://vimeo.com/${m[1]}${m[2] ? '/' + m[2] : ''}` : url;
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(pageUrl)}&width=1280`);
    if (res.ok) {
      const data = await res.json();
      thumb = data.thumbnail_url || null;
    }
  } catch (err) {
    thumb = null;
  }
  _vimeoThumbCache[url] = thumb;
  return thumb;
}

/** Récupère le single type « Paramètres du site » (global). {} si vide/indisponible. */
export async function getGlobal() {
  const r = await fetchAPI('global', { populate: '*' });
  return r.data && !Array.isArray(r.data) ? r.data : {};
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
