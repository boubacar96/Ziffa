module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      // En SSR le frontend appelle Strapi côté serveur (pas de CORS requis).
      // On autorise quand même le domaine public pour d'éventuels appels navigateur.
      origin: (process.env.SITE_ORIGIN || '*').split(','),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
