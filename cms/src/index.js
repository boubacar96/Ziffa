'use strict';

// Génère un slug propre depuis un libellé ("Mercredi 12 novembre" -> "mercredi-12-novembre").
function slugify(s) {
  return String(s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Types lus publiquement par le site (find / findOne).
const PUBLIC_READ = [
  'edition', 'film', 'programme-event', 'programme-day', 'photo',
  'partner', 'prize', 'person', 'formation', 'global', 'press-resource', 'masterclass',
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

// Pré-remplit l'édition 2027 de démo si la base est vide (LOCAL uniquement).
async function seedDemo(strapi) {
  const editions = await strapi.documents('api::edition.edition').findMany({ limit: 1 });
  if (editions.length > 0) return; // déjà du contenu -> on ne touche à rien

  const ed = await strapi.documents('api::edition.edition').create({
    data: {
      year: 2027, number: 3, title: 'ZIFFA 2027',
      tagline: 'Quatre jours pour vibrer.',
      dateStart: '2027-11-17', dateEnd: '2027-11-20',
      location: 'Ziguinchor, Casamance', isCurrent: true,
      videoUrl: 'https://vimeo.com/1169196245/5c5f7be273',
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
}

// ---------------------------------------------------------------------------
// Programme complet de l'édition 2025 (depuis le PDF officiel). Idempotent :
// ne s'exécute que si aucune édition 2025 n'existe encore. LOCAL uniquement.
// ---------------------------------------------------------------------------
const PROGRAMME_2025 = [
  {
    label: 'Mercredi 12 novembre', subtitle: "Jour d'ouverture", date: '2025-11-12', order: 1,
    activities: [
      {
        type: 'vernissage', title: 'Vernissage exposition photos', startTime: '11h',
        location: 'Alliance Française',
        description: "Regards sur la ville de Ziguinchor. Direction artistique : Boubacar Touré Mandemory.\nAvec : Ousmane Diatta, Abdoulaye Diémé, Moustapha Diop, John Kalapo (Mali), Fatima Jarju (Gambie), Cheikh Sidath Sakhanokho, Mamadou Ly.\n(suivi d'un point presse)",
      },
      {
        type: 'cine-enfants', title: 'Ciné enfants', startTime: '15h', timeEnd: '17h',
        location: 'Centre Culturel Régional de Ziguinchor',
        description: "Une séance de films d'animation courts (Burkina, Sénégal, Cap Vert, Belgique, France, Pays-Bas, Espagne, Russie) suivie d'un échange avec les enfants et d'un vote du public pour le meilleur court métrage !",
      },
      {
        type: 'ouverture', title: "Soirée d'ouverture", startTime: '17h',
        location: 'U.F.R Santé',
        description: "17h — Spectacles des groupes Diegoune, Diambadong, Allez Casa.\n19h — Cérémonie d'ouverture (Auditorium). Mots de bienvenue de Babacar Ba, Président du Festival, d'Yves-François Preira, Président de FOTTI CULTURES, d'Oumou Sy, Présidente d'honneur du Festival, de Jean-François Pakula, Délégué Wallonie-Bruxelles, et des représentants de l'État du Sénégal. Présentateurs : Madeleine Sarr et DJ Beuz.\n20h30 — Projections de courts métrages (Auditorium), suivis des courts réalisés dans le cadre des stages de réalisation, montage, jeu d'acteur et animation.\n21h30 — Festivités : danse Ekonkone par le groupe de danse Mloump.",
      },
    ],
  },
  {
    label: 'Jeudi 13 novembre', subtitle: 'Compétition & master classes', date: '2025-11-13', order: 2,
    activities: [
      {
        type: 'masterclass', title: 'Master class — Fatou Kandé Senghor', startTime: '9h30', timeEnd: '10h30',
        location: 'U.F.R Santé',
        description: 'Fatou Kandé Senghor, réalisatrice et scénariste (Sénégal).',
      },
      {
        type: 'masterclass', title: 'Master class — Amélie Mbaye', startTime: '18h00', timeEnd: '20h00',
        location: 'U.F.R Lettres, Arts et Sciences Humaines (salle 6)',
        description: "Amélie Mbaye, productrice, actrice et réalisatrice sénégalaise, présentera son court-métrage « L'ai-je bien coupée… ». La projection sera suivie d'une master classe et d'une discussion autour du film.",
      },
      {
        type: 'cine-enfants', title: 'Ciné enfants', startTime: '17h', timeEnd: '19h',
        location: 'Centre Culturel Régional de Ziguinchor',
        description: "Projection du film « Sirocco et le Royaume des Courants d'air » de Benoît Chieux. Durée : 1h20. Suivie d'un échange avec les enfants.",
      },
      {
        type: 'competition', title: 'Films en compétition', startTime: '11h', timeEnd: '16h',
        location: 'U.F.R Santé',
        description: "1 séance — 7 courts métrages. Une pause de 20 mn est prévue après le 2ème et le 4ème court métrage. Une rencontre est prévue avec Ives Hounkpatin, auteur et producteur de « Géej Amul Banxaas ». De nouveaux spectateurs pourront entrer après chaque film, si des places se libèrent.",
        films: [
          { title: 'Before Another Sleep', director: 'Michael Anane', country: 'Ghana', year: '2025', duration: '23 min', language: 'Anglais s-t français' },
          { title: "Mort d'un acteur", director: 'Ambroise Rateau', country: 'France', year: '2025', duration: '23 min', language: 'Français' },
          { title: "La Chanson d'Amina", director: 'Essam Hayder', country: 'Égypte', year: '2025', duration: '14 min', language: 'Arabe s-t français' },
          { title: 'Géej Amul Banxaas (En mer, sans appui)', director: 'Serigne Ababacar Ba', country: 'Sénégal', year: '2025', duration: '24 min', language: 'Wolof s-t français' },
          { title: 'Samia', director: 'Selma Alaoui, Bruno Tracq', country: 'Belgique', year: '2024', duration: '20 min', language: 'Français, Arabe' },
          { title: 'Hilm', director: 'Ali Hayati', country: 'Iran', year: '2022', duration: '30 min', language: 'Farsi s-t anglais' },
          { title: 'Short Story', director: 'Mingqing Wang', country: 'Chine', year: '2025', duration: '17 min', language: 'Chinois s-t français' },
          { title: 'Demba', director: 'Mamadou Dia', country: 'Sénégal', year: '2024', duration: '1h54', language: 'Pulaar s-t français' },
        ],
      },
      {
        type: 'competition', title: 'Films en compétition — soirée', startTime: '20h', timeEnd: '23h',
        location: 'Alliance Française',
        description: "Soirée composée de deux courts métrages et un long, à partir de 20h. Le bar de l'Alliance Française, lieu de rencontre des festivaliers, ouvrira dès 18 heures.",
        films: [
          { title: 'Circle of Nothingness', director: 'Ratndeep Nautiyal', country: 'Inde', year: '2024', duration: '23 min', language: 'Hindi s-t français' },
          { title: 'Domingo familiar', director: 'Gerardo Del Razo', country: 'Mexique', year: '2024', duration: '17 min', language: 'Espagnol s-t français' },
          { title: 'La Nuit se traîne', director: 'Michiel Blanchart', country: 'Belgique', year: '2024', duration: '1h37', language: 'Français' },
        ],
      },
      {
        type: 'exposition', title: 'Exposition photos', location: 'Alliance Française',
        description: "Entrée libre dans les jardins de l'Alliance Française. « Regards sur la ville de Ziguinchor » — direction artistique : Boubacar Touré Mandemory.",
      },
    ],
  },
  {
    label: 'Vendredi 14 novembre', subtitle: 'Femmes en lumière', date: '2025-11-14', order: 3,
    activities: [
      {
        type: 'rencontre', title: 'Rencontre — Femmes en lumière', startTime: '11h',
        location: 'CCR de Ziguinchor',
        description: "Rencontre animée par Ndeye Marie Diedhiou avec l'actrice et réalisatrice Amélie Mbaye, la scénographe et créatrice costumes Oumou Sy, la réalisatrice et créatrice Fatou Kandé Senghor. Présentation du film d'Amélie Mbaye, « L'ai-je bien coupée… ».",
      },
      {
        type: 'masterclass', title: 'Master class — Babacar Siby', startTime: '9h30', timeEnd: '10h30',
        location: 'U.F.R Santé',
        description: 'Babacar Siby, coach de théâtre et scénariste : « Vérité du personnage, émotion et authenticité ».',
      },
      {
        type: 'masterclass', title: 'Master class — Gora Seck', startTime: '11h00', timeEnd: '12h45',
        location: 'U.F.R Lettres, Arts et Sciences Humaines (salle 6)',
        description: 'Gora Seck, scénariste, réalisateur et metteur en scène de théâtre.',
      },
      {
        type: 'competition', title: 'Films en compétition', startTime: '11h', timeEnd: '19h',
        location: 'U.F.R Santé',
        films: [
          { title: 'Bobo', director: 'Maurice Muendo', country: 'Kenya', year: '2025', duration: '1h45', language: 'Anglais, Swahili s-t français' },
          { title: 'Dans la peau', director: 'Pascal Tessaud', country: 'France', year: '2024', duration: '1h39', language: 'Français' },
          { title: 'Mexico 86', director: 'César Díaz', country: 'Guatemala / Belgique', year: '2025', duration: '1h29', language: 'Espagnol s-t français' },
        ],
      },
      {
        type: 'competition', title: 'Films en compétition — soirée', startTime: '18h', timeEnd: '23h',
        location: 'Alliance Française',
        description: "Soirée deux courts métrages et un long, à partir de 20h. Le bar de l'Alliance Française ouvrira dès 18 heures.",
        films: [
          { title: 'The Adventures of Angosat', director: 'Resem Verkron, Marc Serena', country: 'Angola', year: '2025', duration: '35 min', language: 'Portugais s-t français' },
          { title: 'Au nom du sang', director: 'Mamyto Nakamura', country: 'Sénégal', year: '2024', duration: '26 min', language: 'Wolof s-t français' },
          { title: '404.01', director: 'Younes Reggab', country: 'Maroc', year: '2024', duration: '1h45', language: 'Arabe s-t anglais' },
        ],
      },
      {
        type: 'exposition', title: 'Exposition photos', location: 'Alliance Française',
        description: "Entrée libre dans les jardins de l'Alliance Française.",
      },
    ],
  },
  {
    label: 'Samedi 15 novembre', subtitle: 'Clôture & palmarès', date: '2025-11-15', order: 4,
    activities: [
      {
        type: 'competition', title: 'Films en compétition', startTime: '11h', timeEnd: '16h30',
        location: 'U.F.R Santé',
        films: [
          { title: 'Green Plum Season', director: 'Ali Bayat', country: 'Iran', year: '2024', duration: '1h34', language: 'Farsi s-t anglais' },
          { title: 'Díaz Borrosos', director: 'Marie Benito', country: 'Mexique', year: '2022', duration: '1h28', language: 'Espagnol s-t français' },
          { title: 'Emna', director: 'Bouslama Chamakh', country: 'Tunisie / Suisse', year: '2024', duration: '1h11', language: 'Arabe, allemand s-t français' },
        ],
      },
      {
        type: 'hors-competition', title: 'Film hors compétition', startTime: '17h30',
        location: 'U.F.R Santé',
        films: [
          { title: 'Sunu Gaal', director: 'Josep T. Paris', country: 'Sénégal, Espagne', year: '2025', duration: '1h12', language: 'Documentaire · Catalan s-t français' },
        ],
      },
      {
        type: 'hors-competition', title: 'Film hors compétition', startTime: '19h',
        location: 'Alliance Française',
        films: [
          { title: 'Mbeubeuss', director: 'Nicolas Sawalo Cissé', country: 'Sénégal', year: '2014', duration: '1h35', language: 'Wolof s-t français' },
        ],
      },
      {
        type: 'cloture', title: 'Cérémonie de clôture', startTime: '21h',
        location: 'Alliance Française',
        description: 'Palmarès, festivités & projection des films primés.',
      },
      {
        type: 'exposition', title: 'Exposition photos', location: 'Alliance Française',
        description: "Entrée libre dans les jardins de l'Alliance Française.",
      },
    ],
  },
];

async function seed2025(strapi) {
  const existing = await strapi.documents('api::edition.edition').findMany({
    filters: { year: 2025 }, limit: 1,
  });
  if (existing.length > 0) return; // 2025 déjà saisie -> on ne refait rien

  const ed = await strapi.documents('api::edition.edition').create({
    data: {
      year: 2025, number: 1, title: 'ZIFFA 2025',
      tagline: 'La première édition.',
      dateStart: '2025-11-12', dateEnd: '2025-11-15',
      location: 'Ziguinchor, Casamance', isCurrent: false,
    },
  });

  for (const day of PROGRAMME_2025) {
    const dayDoc = await strapi.documents('api::programme-day.programme-day').create({
      data: {
        label: day.label, subtitle: day.subtitle || null, date: day.date,
        slug: slugify(day.label), order: day.order, edition: ed.documentId,
      },
    });
    await strapi.documents('api::programme-day.programme-day').publish({ documentId: dayDoc.documentId });

    let i = 0;
    for (const act of day.activities) {
      i += 1;
      const actDoc = await strapi.documents('api::programme-event.programme-event').create({
        data: {
          title: act.title, description: act.description || null,
          startTime: act.startTime || null, timeEnd: act.timeEnd || null,
          type: act.type, location: act.location || null,
          date: day.date, order: i,
          films: act.films || [],
          programmeDay: dayDoc.documentId, edition: ed.documentId,
        },
      });
      await strapi.documents('api::programme-event.programme-event').publish({ documentId: actDoc.documentId });
    }
  }
  strapi.log.info('[dev-seed] Programme 2025 complet importé.');
}

// Remplit le slug des jours qui n'en ont pas (ex. créés avant l'ajout du champ).
async function backfillDaySlugs(strapi) {
  const days = await strapi.documents('api::programme-day.programme-day').findMany({ pagination: { limit: 200 } });
  for (const d of days) {
    if (!d.slug && d.label) {
      await strapi.documents('api::programme-day.programme-day').update({
        documentId: d.documentId, data: { slug: slugify(d.label) },
      });
      await strapi.documents('api::programme-day.programme-day').publish({ documentId: d.documentId });
    }
  }
}

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    const isProd = process.env.NODE_ENV === 'production';
    const allowSeed = process.env.ALLOW_SEED === 'true';
    // En production : rien automatiquement, SAUF si ALLOW_SEED=true (import ponctuel
    // des permissions + du programme 2025). La démo 2027 ne tourne JAMAIS en prod.
    if (isProd && !allowSeed) return;
    try {
      await enablePublicRead(strapi);
      if (!isProd) await seedDemo(strapi);
      await seed2025(strapi);
      await backfillDaySlugs(strapi);
      strapi.log.info(`[seed] Permissions + contenu en place (prod=${isProd}).`);
    } catch (err) {
      strapi.log.error('[seed] échec : ' + err.message);
    }
  },
};
