'use strict';

// Types lus publiquement par le site (find / findOne).
const PUBLIC_READ = [
  'edition', 'film', 'programme-event', 'photo',
  'partner', 'prize', 'person', 'article', 'formation', 'global',
];

// Active la lecture publique (idempotent).
async function enablePublicRead(strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  for (const ct of PUBLIC_READ) {
    for (const action of ['find', 'findOne']) {
      const act = `api::${ct}.${ct}.${action}`;
      const exists = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: act, role: publicRole.id } });
      if (!exists) {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({ data: { action: act, role: publicRole.id } });
      }
    }
  }
}

// Pré-remplit un contenu de démo si la base est vide (LOCAL uniquement).
async function seedDemo(strapi) {
  const editions = await strapi.documents('api::edition.edition').findMany({ limit: 1 });
  if (editions.length > 0) return; // déjà du contenu -> on ne touche à rien

  const ed = await strapi.documents('api::edition.edition').create({
    data: {
      year: 2026, number: 2, title: 'ZIFFA 2026',
      tagline: 'Quatre jours pour vibrer.',
      dateStart: '2026-11-12', dateEnd: '2026-11-15',
      location: 'Ziguinchor, Casamance', isCurrent: true,
    },
  });

  const films = [
    { title: 'Sous le Baobab', category: 'fiction', director: 'Aïssatou Diop', country: 'Sénégal', year: 2025 },
    { title: 'Voix de Casamance', category: 'documentaire', director: 'Mamadou Ba', country: 'Sénégal', year: 2025 },
    { title: "L'Esprit du Fleuve", category: 'animation', director: 'Studio Téranga', country: 'Sénégal', year: 2026 },
    { title: 'Le Dernier Griot', category: 'fiction', director: 'Fatou Sow', country: 'Mali', year: 2025 },
    { title: 'Nuit à Ziguinchor', category: 'court-metrage', director: 'O. Diédhiou', country: 'Sénégal', year: 2025 },
    { title: "Mémoires d'Afrique", category: 'documentaire', director: 'Collectif Casamance', country: 'Sénégal', year: 2026 },
  ];
  for (const f of films) {
    const doc = await strapi.documents('api::film.film').create({ data: { ...f, edition: ed.documentId } });
    await strapi.documents('api::film.film').publish({ documentId: doc.documentId });
  }

  const events = [
    { title: "Cérémonie d'ouverture & film inaugural", type: 'ceremonie', day: 1, startTime: 'Jeu 12', location: 'Théâtre Aline Sitoé Diatta', description: "Le coup d'envoi du festival." },
    { title: 'Projections en compétition', type: 'projection', day: 2, startTime: 'Ven 13', location: 'Salle Casamance', description: 'Fictions, documentaires et animations.' },
    { title: 'Masterclasses & rencontres pro', type: 'masterclass', day: 3, startTime: 'Sam 14', location: 'Institut français', description: 'Transmission avec les cinéastes invités.' },
    { title: 'Cérémonie de clôture & palmarès', type: 'ceremonie', day: 4, startTime: 'Dim 15', location: 'Théâtre Aline Sitoé Diatta', description: "Remise des prix de l'édition." },
  ];
  for (const e of events) {
    const doc = await strapi.documents('api::programme-event.programme-event').create({ data: { ...e, edition: ed.documentId } });
    await strapi.documents('api::programme-event.programme-event').publish({ documentId: doc.documentId });
  }
}

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    // Sécurité : ne JAMAIS exécuter le seed/permissions automatiquement en production.
    if (process.env.NODE_ENV === 'production') return;
    try {
      await enablePublicRead(strapi);
      await seedDemo(strapi);
      strapi.log.info('[dev-seed] Permissions publiques + contenu de démo en place.');
    } catch (err) {
      strapi.log.error('[dev-seed] échec : ' + err.message);
    }
  },
};
