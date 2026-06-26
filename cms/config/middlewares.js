module.exports = ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      // CSP de l'admin : on autorise l'aperçu à intégrer le site dans une iframe
      // (frame-src) tout en gardant les valeurs par défaut de Strapi.
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frame-src': ["'self'", env('CLIENT_URL', 'https://ziffa.sn')],
          'img-src': ["'self'", 'data:', 'blob:', env('CLIENT_URL', 'https://ziffa.sn')],
          'media-src': ["'self'", 'data:', 'blob:', env('CLIENT_URL', 'https://ziffa.sn')],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      // En SSR le frontend appelle Strapi côté serveur (pas de CORS requis).
      // On autorise quand même le domaine public pour d'éventuels appels navigateur.
      origin: (env('SITE_ORIGIN', '*')).split(','),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
