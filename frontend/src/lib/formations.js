// Conversion d'un lien YouTube/Vimeo en URL d'intégration (embed).
export function toVideoEmbed(url) {
  if (!url) return '';
  let m;
  if ((m = url.match(/youtu\.be\/([\w-]+)/)) || (m = url.match(/[?&]v=([\w-]+)/))) return `https://www.youtube.com/embed/${m[1]}`;
  if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/))) return `https://player.vimeo.com/video/${m[1]}${m[2] ? `?h=${m[2]}` : ''}`;
  return url;
}

// Ateliers de formation de l'édition 2025 (repli tant que rien n'est saisi dans Strapi).
// Source : dossier ZIFFA + rapport d'activités FOTTI.
const FR = [
  {
    slug: 'realisation-montage', title: 'Réalisation & montage',
    excerpt: "Résidence-formation de 12 jours autour du thème « Femmes en lumière » : écriture, tournage et montage de deux films.",
    cover: '/photos/photo06.jpg',
    duration: '12 jours', audience: 'Jeunes professionnels (18–30 ans)', level: 'Sur candidature',
    location: 'Salle Elupaay — Ziguinchor / Bignona', dates: '3 → 15 novembre 2025',
    content: "Sous la direction de **Filipa Cardoso** (réalisatrice et monteuse) et **Jean-François Metz** (chef opérateur), 15 stagiaires (9 femmes, 6 hommes) ont travaillé collectivement deux scénarios — l’un de fiction, l’autre de documentaire — puis tourné entre Ziguinchor et Bignona. **116 candidatures** reçues de toute l’Afrique de l’Ouest.\n\nDeux films ont été réalisés : ***Yiro Koto*** (fiction) et ***Amang Etam*** (documentaire).",
    gallery: [],
    videos: [
      { title: 'Yiro Koto (fiction)', url: 'https://vimeo.com/1154101681' },
      { title: 'Amang Etam (documentaire)', url: 'https://vimeo.com/1154101139' },
    ],
  },
  {
    slug: 'jeu-acteur', title: 'Jeu d’acteur',
    excerpt: "Explorer la vérité du personnage, l’émotion et l’authenticité de l’interprétation.",
    cover: '/photos/photo03.jpg',
    duration: '12 jours', audience: 'Jeunes professionnels', level: 'Sur candidature',
    location: 'Alliance française — Ziguinchor', dates: '3 → 15 novembre 2025',
    content: "Les 12 résidents ont plongé au cœur du jeu d’acteur aux côtés de **Oumar Diolo** (Sénégal/Belgique) et **Malang Sonko** (Sénégal). Entre émotions, gestes et intentions, l’atelier a permis d’explorer la **vérité du personnage** et la force de l’interprétation.",
    gallery: [], videos: [],
  },
  {
    slug: 'stop-motion', title: 'Stop-motion',
    excerpt: "Initiation au cinéma d’animation image par image, avec réalisation de courts films.",
    cover: '/photos/photo08.jpg',
    duration: '12 jours', audience: '12 jeunes ziguinchorois (18–30 ans)', level: 'Sélection Arts for Kids',
    location: 'Radio Kasumaay — Ziguinchor', dates: '3 → 15 novembre 2025',
    content: "Sous la direction de **Patrick Talercio** (Smala Cinéma), assisté de **Lula Stanczyk**, douze jeunes ont réalisé des films d’animation image par image. La sélection a été assurée par l’association partenaire **Arts for Kids**.\n\nDeux films ont été réalisés : ***Fanikendo*** et ***Aïcha***.",
    gallery: [],
    videos: [
      { title: 'Fanikendo', url: 'https://vimeo.com/1154101539' },
      { title: 'Aïcha', url: 'https://vimeo.com/1154100782' },
    ],
  },
  {
    slug: 'semiologie-cinema', title: 'Sémiologie du cinéma',
    excerpt: "Décoder une œuvre — plans, montage, lumière, son, mise en scène — pour comprendre les intentions de l’auteur.",
    cover: '/photos/photo09.jpg',
    duration: '', audience: 'Étudiants de l’Université Assane Seck', level: 'Ouvert aux étudiants',
    location: 'Université Assane Seck — Ziguinchor', dates: 'Novembre 2025',
    content: "Animé par **John Shank**, réalisateur et sémiologue basé à Bruxelles, cet atelier dédié aux étudiants propose d’observer et de comprendre les techniques de l’image, du son et de la narration, afin d’identifier les intentions véhiculées par l’auteur.",
    gallery: [], videos: [],
  },
];

const EN = [
  {
    slug: 'realisation-montage', title: 'Directing & editing',
    excerpt: 'A 12-day residency on the theme “Women in the spotlight”: writing, shooting and editing two films.',
    cover: '/photos/photo06.jpg',
    duration: '12 days', audience: 'Young professionals (18–30)', level: 'By application',
    location: 'Elupaay Hall — Ziguinchor / Bignona', dates: '3 → 15 November 2025',
    content: "Led by **Filipa Cardoso** (director and editor) and **Jean-François Metz** (cinematographer), 15 trainees (9 women, 6 men) collectively developed two scripts — one fiction, one documentary — then shot between Ziguinchor and Bignona. **116 applications** received from across West Africa.\n\nTwo films were made: ***Yiro Koto*** (fiction) and ***Amang Etam*** (documentary).",
    gallery: [],
    videos: [
      { title: 'Yiro Koto (fiction)', url: 'https://vimeo.com/1154101681' },
      { title: 'Amang Etam (documentary)', url: 'https://vimeo.com/1154101139' },
    ],
  },
  {
    slug: 'jeu-acteur', title: 'Acting',
    excerpt: 'Exploring the truth of the character, emotion and authenticity in performance.',
    cover: '/photos/photo03.jpg',
    duration: '12 days', audience: 'Young professionals', level: 'By application',
    location: 'Alliance française — Ziguinchor', dates: '3 → 15 November 2025',
    content: "The 12 residents dived into the heart of acting alongside **Oumar Diolo** (Senegal/Belgium) and **Malang Sonko** (Senegal). Through emotion, gesture and intention, the workshop explored the **truth of the character** and the power of performance.",
    gallery: [], videos: [],
  },
  {
    slug: 'stop-motion', title: 'Stop-motion',
    excerpt: 'An introduction to frame-by-frame animation, with the making of short films.',
    cover: '/photos/photo08.jpg',
    duration: '12 days', audience: '12 young people from Ziguinchor (18–30)', level: 'Selected by Arts for Kids',
    location: 'Radio Kasumaay — Ziguinchor', dates: '3 → 15 November 2025',
    content: "Led by **Patrick Talercio** (Smala Cinéma), assisted by **Lula Stanczyk**, twelve young people created frame-by-frame animated films. Selection was handled by the partner association **Arts for Kids**.\n\nTwo films were made: ***Fanikendo*** and ***Aïcha***.",
    gallery: [],
    videos: [
      { title: 'Fanikendo', url: 'https://vimeo.com/1154101539' },
      { title: 'Aïcha', url: 'https://vimeo.com/1154100782' },
    ],
  },
  {
    slug: 'semiologie-cinema', title: 'Film semiotics',
    excerpt: 'Decoding a work — shots, editing, light, sound, staging — to understand the author’s intentions.',
    cover: '/photos/photo09.jpg',
    duration: '', audience: 'Assane Seck University students', level: 'Open to students',
    location: 'Assane Seck University — Ziguinchor', dates: 'November 2025',
    content: "Led by **John Shank**, a director and semiotician based in Brussels, this student-focused workshop invites participants to observe and understand the techniques of image, sound and narration, in order to identify the author’s intentions.",
    gallery: [], videos: [],
  },
];

export function fallbackFormations(lang) {
  return lang === 'en' ? EN : FR;
}
