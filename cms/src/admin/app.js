// Personnalisation de l'interface d'administration Strapi.
// Ajoute le français à l'admin (par défaut, Strapi v5 n'embarque que l'anglais).
export default {
  config: {
    // Langues disponibles dans l'admin (l'anglais reste la base, non supprimable).
    locales: ['fr'],
  },
  bootstrap() {},
};
