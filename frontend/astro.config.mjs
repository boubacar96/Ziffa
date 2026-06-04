import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// SSR : le site interroge Strapi à chaque requête (contenu toujours à jour).
// Pour passer en 100 % statique plus tard : remplace `output`/`adapter` par
// `output: 'static'` et retire l'adaptateur node (puis rebuild à chaque
// publication via un webhook Strapi).
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { host: true, port: 4321 },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
