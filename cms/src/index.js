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
  'partner', 'prize', 'person', 'formation', 'global', 'press-resource', 'masterclass', 'femme-lumiere',
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

// Libellés FR des champs dans l'admin (Content Manager). Le nom technique reste inchangé.
const FR_LABELS = {
  'api::person.person': { name: 'Nom', role: 'Rôle / fonction', bio: 'Biographie', photo: 'Photo', type: 'Catégorie (équipe / jury / photographe)', featured: 'Mettre en avant', order: "Ordre d'affichage", edition: 'Édition' },
  'api::film.film': { title: 'Titre', category: 'Catégorie', synopsis: 'Synopsis', director: 'Réalisateur·rice', country: 'Pays', year: 'Année', duration: 'Durée', poster: 'Affiche', trailerUrl: 'Lien bande-annonce', edition: 'Édition' },
  'api::prize.prize': { name: 'Nom du prix', description: 'Description', winner: 'Lauréat·e', image: 'Image', edition: 'Édition' },
  'api::photo.photo': { image: 'Images', category: 'Catégorie (galerie / expo)', edition: 'Édition' },
  'api::partner.partner': { name: 'Nom', logo: 'Logo', url: 'Lien (site web)', order: "Ordre d'affichage" },
  'api::formation.formation': { title: 'Titre', slug: 'Slug (auto)', excerpt: 'Résumé', duration: 'Durée', audience: 'Public cible', level: 'Niveau', location: 'Lieu', dates: 'Dates', content: 'Contenu', cover: 'Couverture', gallery: 'Galerie', videos: 'Vidéos', order: "Ordre d'affichage", description: 'Description (secours)' },
  'api::masterclass.masterclass': { title: 'Titre', slug: 'Slug (auto)', excerpt: 'Résumé', location: 'Lieu', participants: 'Nombre de participants', duration: 'Durée', content: 'Contenu', quote: 'Citation / témoignage', quoteAuthor: 'Auteur de la citation', reportageUrl: 'Lien du reportage', cover: 'Couverture', gallery: 'Galerie', videos: 'Vidéos', speaker: 'Intervenant·e', order: "Ordre d'affichage", edition: 'Édition' },
  'api::femme-lumiere.femme-lumiere': { title: 'Titre', slug: 'Slug (auto)', excerpt: 'Résumé', content: 'Contenu', cover: 'Couverture', gallery: 'Galerie', videos: 'Vidéos', order: "Ordre d'affichage" },
  'api::press-resource.press-resource': { title: 'Titre', description: 'Description', category: 'Catégorie (dossier / logos / photos)', files: 'Fichiers', order: "Ordre d'affichage" },
  'api::edition.edition': { year: 'Année', number: "Numéro d'édition", title: 'Titre', tagline: 'Accroche', dateStart: 'Date de début', dateEnd: 'Date de fin', location: 'Lieu', isCurrent: 'Édition en cours ?', videoUrl: 'Lien vidéo (teaser)', poster: 'Affiche', programmePdf: 'PDF du programme' },
  'api::programme-day.programme-day': { label: 'Libellé du jour', subtitle: 'Sous-titre', date: 'Date', slug: 'Slug (auto)', order: "Ordre d'affichage", edition: 'Édition', activities: 'Activités' },
  'api::programme-event.programme-event': { title: 'Titre', description: 'Description', startTime: 'Heure de début', timeEnd: 'Heure de fin', type: 'Type de séance', location: 'Lieu', day: 'Jour (n° pour le tri)', date: 'Date', order: "Ordre d'affichage", filmsList: 'Films de la séance', programmeDay: 'Jour de programme', edition: 'Édition' },
};

// Applique les libellés FR à la configuration du Content Manager (idempotent, tolérant).
async function setFrenchLabels(strapi) {
  const cm = strapi.plugin && strapi.plugin('content-manager');
  const svc = cm && cm.service('content-types');
  if (!svc || typeof svc.findConfiguration !== 'function' || typeof svc.updateConfiguration !== 'function') {
    strapi.log.warn('[labels] Service Content Manager indisponible — libellés non appliqués.');
    return;
  }
  for (const [uid, fields] of Object.entries(FR_LABELS)) {
    try {
      const ct = strapi.contentType(uid);
      if (!ct) continue;
      const conf = await svc.findConfiguration(ct);
      if (!conf || !conf.metadatas) continue;
      for (const [f, label] of Object.entries(fields)) {
        const meta = conf.metadatas[f];
        if (!meta) continue;
        if (meta.edit) meta.edit.label = label;
        if (meta.list) meta.list.label = label;
      }
      await svc.updateConfiguration(ct, conf);
    } catch (e) {
      strapi.log.warn('[labels] ' + uid + ' : ' + e.message);
    }
  }
  strapi.log.info('[labels] Libellés FR appliqués au Content Manager.');
}

// Unifie les films : crée des entrées « Film » depuis les composants « Films de la séance »
// et relie chaque séance à ces films (filmsList). Idempotent, tolérant.
async function unifyFilms(strapi) {
  let events;
  try {
    events = await strapi.documents('api::programme-event.programme-event').findMany({
      populate: { films: true, edition: true, filmsList: true },
      pagination: { limit: 500 },
    });
  } catch (e) { strapi.log.warn('[unify-films] lecture séances : ' + e.message); return; }
  let created = 0, linked = 0;
  for (const ev of events || []) {
    const lines = ev.films || [];
    if (!lines.length) continue;
    if ((ev.filmsList || []).length) continue; // déjà migré
    const editionId = ev.edition && ev.edition.documentId;
    const filmIds = [];
    for (const line of lines) {
      if (!line.title) continue;
      try {
        const found = await strapi.documents('api::film.film').findMany({ filters: { title: line.title }, pagination: { limit: 1 } });
        let film = found && found[0];
        if (!film) {
          film = await strapi.documents('api::film.film').create({
            data: {
              title: line.title,
              director: line.director || null,
              country: line.country || null,
              year: line.year ? (parseInt(String(line.year), 10) || null) : null,
              duration: line.duration || null,
              language: line.language || null,
              edition: editionId || undefined,
            },
          });
          await strapi.documents('api::film.film').publish({ documentId: film.documentId });
          created++;
        }
        filmIds.push(film.documentId);
      } catch (e) { strapi.log.warn('[unify-films] film "' + line.title + '" : ' + e.message); }
    }
    if (filmIds.length) {
      try {
        await strapi.documents('api::programme-event.programme-event').update({ documentId: ev.documentId, data: { filmsList: filmIds } });
        await strapi.documents('api::programme-event.programme-event').publish({ documentId: ev.documentId });
        linked++;
      } catch (e) { strapi.log.warn('[unify-films] lien séance : ' + e.message); }
    }
  }
  strapi.log.info(`[unify-films] Films créés : ${created}, séances reliées : ${linked}.`);
}

// Recrée les films 2025 depuis le code (PROGRAMME_2025) et relie les séances (filmsList).
// Source de vérité = le code, donc robuste même si la base a perdu des données. Idempotent.
async function recoverFilms2025(strapi) {
  const eds = await strapi.documents('api::edition.edition').findMany({ filters: { year: 2025 }, pagination: { limit: 1 } });
  const ed = eds && eds[0];
  if (!ed) { strapi.log.warn('[recover-films] pas d\'édition 2025'); return; }
  let events = [];
  try {
    events = await strapi.documents('api::programme-event.programme-event').findMany({
      filters: { edition: { documentId: ed.documentId } },
      populate: { filmsList: true }, pagination: { limit: 500 },
    });
  } catch (e) { strapi.log.warn('[recover-films] lecture séances : ' + e.message); }
  const cache = {};
  let created = 0, linked = 0;
  async function getFilm(line) {
    if (cache[line.title]) return cache[line.title];
    const found = await strapi.documents('api::film.film').findMany({ filters: { title: line.title }, status: 'published', pagination: { limit: 1 } });
    let film = found && found[0];
    if (!film) {
      film = await strapi.documents('api::film.film').create({
        data: { title: line.title, director: line.director || null, country: line.country || null, year: line.year ? (parseInt(String(line.year), 10) || null) : null, duration: line.duration || null, language: line.language || null, edition: ed.documentId },
      });
      await strapi.documents('api::film.film').publish({ documentId: film.documentId });
      created++;
    }
    cache[line.title] = film;
    return film;
  }
  for (const day of PROGRAMME_2025) {
    let i = 0;
    for (const act of day.activities) {
      i += 1;
      if (!act.films || !act.films.length) continue;
      const ids = [];
      for (const line of act.films) { try { const f = await getFilm(line); ids.push(f.documentId); } catch (e) { strapi.log.warn('[recover-films] ' + line.title + ' : ' + e.message); } }
      // Appariement par date + ordre (l'ordre = position dans la journée, posé par le seed) — gère les titres identiques.
      const ev = events.find((e) => String(e.date) === String(day.date) && e.order === i);
      if (ev && ids.length) {
        try {
          // Remplacement exact : la séance contient exactement ses films (corrige tout lien erroné).
          await strapi.documents('api::programme-event.programme-event').update({ documentId: ev.documentId, data: { filmsList: ids } });
          await strapi.documents('api::programme-event.programme-event').publish({ documentId: ev.documentId });
          linked++;
        } catch (e) { strapi.log.warn('[recover-films] lien ' + act.title + ' : ' + e.message); }
      }
    }
  }
  strapi.log.info(`[recover-films] Films créés : ${created}, séances reliées : ${linked}.`);
}

// Les 3 masterclasses réelles de l'édition 2025 (source : rapport d'activités FOTTI).
const MASTERCLASSES_2025 = [
  {
    slug: 'babacar-siby', title: 'Babacar Siby', order: 1,
    excerpt: 'Scénariste (série « Nafi » de Marodi) et coach en théâtre : « la vérité du personnage ».',
    location: 'Alliance française de Ziguinchor', participants: '50 personnes', duration: '2 heures',
    content: "L’Alliance française de Ziguinchor a vibré au rythme d’un atelier intense et inspirant animé par **Babacar Siby**, scénariste (série *Nafi* de Marodi, etc.) et coach en théâtre. Une séance riche, humaine et pleine de découvertes — un moment unique pour explorer la **vérité du personnage**, l’émotion et l’authenticité dans le jeu d’acteur.",
    quote: "J’ai eu le plaisir d’assister à la Master Class de Babacar Siby, scénariste et coach en théâtre, qui a fait vibrer la salle avec un atelier intense, généreux et profondément inspirant sur « La vérité du personnage ». Un moment d’apprentissage comme on l’aime : vrai, humain, technique… et surtout tourné vers le partage avec un grand passionné qui élève les jeunes talents avec une pédagogie rare. Bravo Babacar, et merci pour cette dose d’inspiration.",
    quoteAuthor: 'Amath Niaye',
    reportageUrl: 'https://www.facebook.com/reel/839786608793411',
  },
  {
    slug: 'amelie-mbaye', title: 'Amélie Mbaye', order: 2,
    excerpt: "Comédienne et productrice (Los Angeles · Paris · Dakar) — le jeu d’acteur.",
    location: 'Université Assane Seck', participants: '180 étudiants', duration: '2 heures',
    content: "**Amélie Mbaye** a partagé son expérience du jeu d’acteur, offrant aux étudiants des clés essentielles pour comprendre l’émotion, la présence et la vérité d’un personnage — un pont direct entre l’université et le monde professionnel du cinéma.\n\nÀ ce jour la seule actrice sénégalaise à intégrer Nollywood depuis la Californie, elle interprète **Ramatoulaye Fall** dans l’adaptation du roman de Mariama Bâ *« Une si longue lettre »*, classé n°1 en Afrique.",
  },
  {
    slug: 'gora-seck', title: 'Dr Gora Seck', order: 3,
    excerpt: 'Scénariste, réalisateur et metteur en scène de théâtre.',
    location: 'Université Assane Seck', participants: '150 étudiants', duration: '2 heures',
    content: "Entre échanges et conseils, les participants ont plongé au cœur de la master class animée par le **Dr Gora Seck**, scénariste, réalisateur et metteur en scène de théâtre.",
  },
];

async function seedMasterclasses2025(strapi) {
  const eds = await strapi.documents('api::edition.edition').findMany({ filters: { year: 2025 }, pagination: { limit: 1 } });
  const ed = eds && eds[0];
  if (!ed) { strapi.log.warn('[mc-2025] pas d\'édition 2025'); return; }
  // Retrait de l'entrée erronée « Oumar Diolo » (coach jeu d'acteur, pas une masterclasse).
  const stray = await strapi.documents('api::masterclass.masterclass').findMany({ filters: { slug: 'oumar-diolo' }, pagination: { limit: 5 } });
  let removed = 0;
  for (const s of (stray || [])) { try { await strapi.documents('api::masterclass.masterclass').delete({ documentId: s.documentId }); removed++; } catch (e) { strapi.log.warn('[mc-2025] suppression ' + s.slug + ' : ' + e.message); } }
  let created = 0, updated = 0;
  for (const mc of MASTERCLASSES_2025) {
    const data = { ...mc, edition: ed.documentId };
    const found = await strapi.documents('api::masterclass.masterclass').findMany({ filters: { slug: mc.slug }, pagination: { limit: 1 } });
    let doc = found && found[0];
    try {
      if (doc) { doc = await strapi.documents('api::masterclass.masterclass').update({ documentId: doc.documentId, data }); updated++; }
      else { doc = await strapi.documents('api::masterclass.masterclass').create({ data }); created++; }
      await strapi.documents('api::masterclass.masterclass').publish({ documentId: doc.documentId });
    } catch (e) { strapi.log.warn('[mc-2025] ' + mc.slug + ' : ' + e.message); }
  }
  strapi.log.info(`[mc-2025] Masterclasses — créées:${created}, mises à jour:${updated}, retirées:${removed}.`);
}

// Équipe & gouvernance de l'édition 2025 (source : rapport d'activités FOTTI).
// Sélection : direction + équipe cœur (le client peut compléter dans l'admin).
const TEAM_2025 = [
  { name: 'Babacar Ba', role: 'Président du festival', featured: true, order: 1,
    bio: "Producteur audiovisuel, réalisateur et photographe, diplômé de l’École Agnès Varda (Bruxelles). Fondateur du ZIFFA, il œuvre depuis une vingtaine d’années à faire émerger les talents du cinéma sénégalais et à faire de Ziguinchor un carrefour du cinéma africain." },
  { name: 'Yves-François Preira', role: 'Président de FOTTI Cultures', order: 2,
    bio: "Président de l’association FOTTI Cultures, structure porteuse du festival." },
  { name: 'Oumou Sy', role: 'Présidente d’honneur', order: 3,
    bio: "Styliste et scénographe de renommée internationale, figure emblématique de la création africaine, présidente d’honneur du ZIFFA." },
  { name: 'Selly Ba', role: 'Sponsors & partenariats', order: 4 },
  { name: 'France Morin', role: 'Directrice d’AMA Brussels (partenaire belge)', order: 5 },
  { name: 'Aïssatou Cissokho', role: 'Chargée d’administration', order: 6 },
  { name: 'Omar Arena Massaly', role: 'Coordinateur régional (Ziguinchor)', order: 7 },
  { name: 'Khassim Bodian', role: 'Coordinateur local (Ziguinchor)', order: 8 },
  { name: 'Ndeye Nogaye Diagne', role: 'Responsable projection', order: 9 },
  { name: 'Maïmouna Samaté', role: 'Responsable de communication', order: 10 },
  { name: 'Bettinha Yvette Badji', role: 'Coordinatrice des masterclasses', order: 11 },
  { name: 'Madiop Seye', role: 'Graphiste & vidéaste', order: 12 },
  { name: 'Badara Fall', role: 'Community manager', order: 13 },
];

async function seedTeam2025(strapi) {
  const eds = await strapi.documents('api::edition.edition').findMany({ filters: { year: 2025 }, pagination: { limit: 1 } });
  const ed = eds && eds[0];
  let created = 0, updated = 0;
  for (const m of TEAM_2025) {
    const data = { name: m.name, role: m.role || null, bio: m.bio || null, type: 'equipe', featured: !!m.featured, order: m.order || 0 };
    if (ed) data.edition = ed.documentId;
    const found = await strapi.documents('api::person.person').findMany({ filters: { name: m.name, type: 'equipe' }, pagination: { limit: 1 } });
    const doc = found && found[0];
    try {
      if (doc) { await strapi.documents('api::person.person').update({ documentId: doc.documentId, data }); updated++; }
      else { await strapi.documents('api::person.person').create({ data }); created++; }
    } catch (e) { strapi.log.warn('[team-2025] ' + m.name + ' : ' + e.message); }
  }
  strapi.log.info(`[team-2025] Équipe — créées:${created}, mises à jour:${updated}.`);
}

// Ateliers de formation 2025 (dossier ZIFFA + rapport FOTTI), avec films Vimeo réalisés.
const FORMATIONS_2025 = [
  {
    slug: 'realisation-montage', title: 'Réalisation & montage', order: 1,
    excerpt: "Résidence-formation de 12 jours autour du thème « Femmes en lumière » : écriture, tournage et montage de deux films.",
    duration: '12 jours', audience: 'Jeunes professionnels (18–30 ans)', level: 'Sur candidature',
    location: 'Salle Elupaay — Ziguinchor / Bignona', dates: '3 → 15 novembre 2025',
    content: "Sous la direction de **Filipa Cardoso** (réalisatrice et monteuse) et **Jean-François Metz** (chef opérateur), 15 stagiaires (9 femmes, 6 hommes) ont travaillé collectivement deux scénarios — l’un de fiction, l’autre de documentaire — puis tourné entre Ziguinchor et Bignona. **116 candidatures** reçues de toute l’Afrique de l’Ouest.\n\nDeux films ont été réalisés : ***Yiro Koto*** (fiction) et ***Amang Etam*** (documentaire).",
    videos: [
      { title: 'Yiro Koto (fiction)', url: 'https://vimeo.com/1154101681' },
      { title: 'Amang Etam (documentaire)', url: 'https://vimeo.com/1154101139' },
    ],
  },
  {
    slug: 'jeu-acteur', title: 'Jeu d’acteur', order: 2,
    excerpt: "Explorer la vérité du personnage, l’émotion et l’authenticité de l’interprétation.",
    duration: '12 jours', audience: 'Jeunes professionnels', level: 'Sur candidature',
    location: 'Alliance française — Ziguinchor', dates: '3 → 15 novembre 2025',
    content: "Les 12 résidents ont plongé au cœur du jeu d’acteur aux côtés de **Oumar Diolo** (Sénégal/Belgique) et **Malang Sonko** (Sénégal). Entre émotions, gestes et intentions, l’atelier a permis d’explorer la **vérité du personnage** et la force de l’interprétation.",
    videos: [],
  },
  {
    slug: 'stop-motion', title: 'Stop-motion', order: 3,
    excerpt: "Initiation au cinéma d’animation image par image, avec réalisation de courts films.",
    duration: '12 jours', audience: '12 jeunes ziguinchorois (18–30 ans)', level: 'Sélection Arts for Kids',
    location: 'Radio Kasumaay — Ziguinchor', dates: '3 → 15 novembre 2025',
    content: "Sous la direction de **Patrick Talercio** (Smala Cinéma), assisté de **Lula Stanczyk**, douze jeunes ont réalisé des films d’animation image par image. La sélection a été assurée par l’association partenaire **Arts for Kids**.\n\nDeux films ont été réalisés : ***Fanikendo*** et ***Aïcha***.",
    videos: [
      { title: 'Fanikendo', url: 'https://vimeo.com/1154101539' },
      { title: 'Aïcha', url: 'https://vimeo.com/1154100782' },
    ],
  },
  {
    slug: 'semiologie-cinema', title: 'Sémiologie du cinéma', order: 4,
    excerpt: "Décoder une œuvre — plans, montage, lumière, son, mise en scène — pour comprendre les intentions de l’auteur.",
    duration: '', audience: 'Étudiants de l’Université Assane Seck', level: 'Ouvert aux étudiants',
    location: 'Université Assane Seck — Ziguinchor', dates: 'Novembre 2025',
    content: "Animé par **John Shank**, réalisateur et sémiologue basé à Bruxelles, cet atelier dédié aux étudiants propose d’observer et de comprendre les techniques de l’image, du son et de la narration, afin d’identifier les intentions véhiculées par l’auteur.",
    videos: [],
  },
];

async function seedFormations2025(strapi) {
  // Retrait de l'entrée de démonstration générique.
  const stray = await strapi.documents('api::formation.formation').findMany({ filters: { slug: 'formation-animation-2-d' }, pagination: { limit: 5 } });
  let removed = 0;
  for (const s of (stray || [])) { try { await strapi.documents('api::formation.formation').delete({ documentId: s.documentId }); removed++; } catch (e) { strapi.log.warn('[formations-2025] suppression ' + s.slug + ' : ' + e.message); } }
  let created = 0, updated = 0;
  for (const f of FORMATIONS_2025) {
    const data = { title: f.title, slug: f.slug, excerpt: f.excerpt, duration: f.duration || null, audience: f.audience || null, level: f.level || null, location: f.location || null, dates: f.dates || null, content: f.content, order: f.order || 0, videos: f.videos || [] };
    const found = await strapi.documents('api::formation.formation').findMany({ filters: { slug: f.slug }, pagination: { limit: 1 } });
    let doc = found && found[0];
    try {
      if (doc) { doc = await strapi.documents('api::formation.formation').update({ documentId: doc.documentId, data }); updated++; }
      else { doc = await strapi.documents('api::formation.formation').create({ data }); created++; }
      await strapi.documents('api::formation.formation').publish({ documentId: doc.documentId });
    } catch (e) { strapi.log.warn('[formations-2025] ' + f.slug + ' : ' + e.message); }
  }
  strapi.log.info(`[formations-2025] Ateliers — créés:${created}, mis à jour:${updated}, retirés:${removed}.`);
}

// Palmarès officiel 2025 (source : rapport d'activités FOTTI) — 7 prix + 2 mentions.
const PRIZES_2025 = [
  { name: '1er Prix — Long métrage', winner: 'Demba — Mamadou Dia (Sénégal)', description: '700 000 FCFA', order: 1 },
  { name: '2e Prix — Long métrage', winner: 'Mexico 86 — César Díaz', description: '500 000 FCFA', order: 2 },
  { name: 'Mention spéciale — Long métrage', winner: 'Dans la peau — Pascal Tessaud (France)', description: '', order: 3 },
  { name: '1er Prix — Court métrage', winner: 'Geej Amul Banxass (Sans Appui) — Khalifa Ba (Sénégal)', description: '500 000 FCFA', order: 4 },
  { name: '2e Prix — Court métrage', winner: 'Domingo Familiar — Gerardo Del Razo', description: '300 000 FCFA', order: 5 },
  { name: 'Mention spéciale — Court métrage', winner: 'Him — Ali Hayati (Iran)', description: '', order: 6 },
  { name: 'Prix du Jury — Animation', winner: 'Prout — Marc-Henri Wajnberg (Belgique)', description: '500 000 FCFA', order: 7 },
  { name: 'Prix du Public jeune — Animation', winner: 'Princesse Yennenga — Koné Abdoul Rahim Said Jr.', description: '', order: 8 },
  { name: 'Prix d’Honneur', winner: 'Boubacar Touré Mandémory — photographe', description: '', order: 9 },
];

async function seedPrizes2025(strapi) {
  const eds = await strapi.documents('api::edition.edition').findMany({ filters: { year: 2025 }, pagination: { limit: 1 } });
  const ed = eds && eds[0];
  if (!ed) { strapi.log.warn('[prizes-2025] pas d\'édition 2025'); return; }
  // Remplacement exact : retire les prix existants de l'édition 2025, puis recrée le palmarès officiel.
  const existing = await strapi.documents('api::prize.prize').findMany({ filters: { edition: { documentId: ed.documentId } }, pagination: { limit: 100 } });
  let removed = 0;
  for (const p of (existing || [])) { try { await strapi.documents('api::prize.prize').delete({ documentId: p.documentId }); removed++; } catch (e) { strapi.log.warn('[prizes-2025] suppression : ' + e.message); } }
  let created = 0;
  for (const pr of PRIZES_2025) {
    try { await strapi.documents('api::prize.prize').create({ data: { ...pr, edition: ed.documentId } }); created++; }
    catch (e) { strapi.log.warn('[prizes-2025] ' + pr.name + ' : ' + e.message); }
  }
  strapi.log.info(`[prizes-2025] Palmarès — retirés:${removed}, créés:${created}.`);
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
      await recoverFilms2025(strapi);
      await seedMasterclasses2025(strapi);
      await seedTeam2025(strapi);
      await seedFormations2025(strapi);
      await seedPrizes2025(strapi);
      await setFrenchLabels(strapi);
      strapi.log.info(`[seed] Permissions + contenu en place (prod=${isProd}).`);
    } catch (err) {
      strapi.log.error('[seed] échec : ' + err.message);
    }
  },
};
