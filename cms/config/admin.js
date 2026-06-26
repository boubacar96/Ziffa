module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  // ---------------------------------------------------------------------------
  // Aperçu (Preview) : ajoute les boutons « Aperçu » / « Voir en ligne » dans la
  // vue d'édition du Content Manager, reliés au front Astro.
  // Phase 1 : éditions. Le handler renvoie l'URL de la page + ?preview=<secret>
  // pour que le front affiche la version brouillon (status=draft).
  // ---------------------------------------------------------------------------
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CLIENT_URL', 'https://ziffa.sn')],
      async handler(uid, { documentId, locale, status }) {
        const client = env('CLIENT_URL', 'https://ziffa.sn');
        const secret = env('PREVIEW_SECRET', '');
        const prefix = locale && locale !== 'fr' ? '/en' : '';
        let pathname = null;
        try {
          if (uid === 'api::edition.edition') {
            const doc = await strapi.documents(uid).findOne({ documentId, status });
            if (doc && doc.year) {
              pathname = String(doc.year) === '2025' ? '/edition-2025' : `/editions/${doc.year}`;
            }
          }
        } catch (e) {
          pathname = null;
        }
        if (!pathname) return null;
        return `${client}${prefix}${pathname}?preview=${encodeURIComponent(secret)}&status=${status}`;
      },
    },
  },
});
