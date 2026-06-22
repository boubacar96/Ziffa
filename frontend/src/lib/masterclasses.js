// Masterclasses de l'édition 2025 (repli tant que rien n'est saisi dans Strapi).
// Source : rapport d'activités FOTTI 2025. 3 masterclasses réelles.
const FR = [
  {
    slug: 'babacar-siby', title: 'Babacar Siby',
    excerpt: 'Scénariste (série « Nafi » de Marodi) et coach en théâtre : « la vérité du personnage ».',
    cover: '/photos/photo08.jpg',
    location: 'Alliance française de Ziguinchor', participants: '50 personnes', duration: '2 heures',
    content: "L’Alliance française de Ziguinchor a vibré au rythme d’un atelier intense et inspirant animé par **Babacar Siby**, scénariste (série *Nafi* de Marodi, etc.) et coach en théâtre. Une séance riche, humaine et pleine de découvertes — un moment unique pour explorer la **vérité du personnage**, l’émotion et l’authenticité dans le jeu d’acteur.",
    quote: "J’ai eu le plaisir d’assister à la Master Class de Babacar Siby, scénariste et coach en théâtre, qui a fait vibrer la salle avec un atelier intense, généreux et profondément inspirant sur « La vérité du personnage ». Un moment d’apprentissage comme on l’aime : vrai, humain, technique… et surtout tourné vers le partage avec un grand passionné qui élève les jeunes talents avec une pédagogie rare. Bravo Babacar, et merci pour cette dose d’inspiration.",
    quoteAuthor: 'Amath Niaye',
    reportageUrl: 'https://www.facebook.com/reel/839786608793411',
    gallery: [], videos: [],
  },
  {
    slug: 'amelie-mbaye', title: 'Amélie Mbaye',
    excerpt: "Comédienne et productrice (Los Angeles · Paris · Dakar) — le jeu d’acteur.",
    cover: '/photos/photo06.jpg',
    location: 'Université Assane Seck', participants: '180 étudiants', duration: '2 heures',
    content: "**Amélie Mbaye** a partagé son expérience du jeu d’acteur, offrant aux étudiants des clés essentielles pour comprendre l’émotion, la présence et la vérité d’un personnage — un pont direct entre l’université et le monde professionnel du cinéma.\n\nÀ ce jour la seule actrice sénégalaise à intégrer Nollywood depuis la Californie, elle interprète **Ramatoulaye Fall** dans l’adaptation du roman de Mariama Bâ *« Une si longue lettre »*, classé n°1 en Afrique.",
    gallery: [], videos: [],
  },
  {
    slug: 'gora-seck', title: 'Dr Gora Seck',
    excerpt: 'Scénariste, réalisateur et metteur en scène de théâtre.',
    cover: '/photos/photo09.jpg',
    location: 'Université Assane Seck', participants: '150 étudiants', duration: '2 heures',
    content: "Entre échanges et conseils, les participants ont plongé au cœur de la master class animée par le **Dr Gora Seck**, scénariste, réalisateur et metteur en scène de théâtre.",
    gallery: [], videos: [],
  },
];

const EN = [
  {
    slug: 'babacar-siby', title: 'Babacar Siby',
    excerpt: 'Screenwriter (Marodi’s « Nafi » series) and theatre coach: “the truth of the character”.',
    cover: '/photos/photo08.jpg',
    location: 'Alliance française de Ziguinchor', participants: '50 attendees', duration: '2 hours',
    content: "The Alliance française of Ziguinchor came alive with an intense, inspiring workshop led by **Babacar Siby**, screenwriter (Marodi’s *Nafi* series, etc.) and theatre coach. A rich, human session full of discovery — a unique moment to explore **character truth**, emotion and authenticity in acting.",
    quote: "I had the pleasure of attending Babacar Siby’s Master Class — screenwriter and theatre coach — who electrified the room with an intense, generous and deeply inspiring workshop on “The truth of the character”. A learning moment as we love them: genuine, human, technical… and above all geared toward sharing, with a great enthusiast who lifts up young talents through rare teaching. Bravo Babacar, and thank you for this dose of inspiration.",
    quoteAuthor: 'Amath Niaye',
    reportageUrl: 'https://www.facebook.com/reel/839786608793411',
    gallery: [], videos: [],
  },
  {
    slug: 'amelie-mbaye', title: 'Amélie Mbaye',
    excerpt: 'Actress and producer (Los Angeles · Paris · Dakar) — acting for the screen.',
    cover: '/photos/photo06.jpg',
    location: 'Assane Seck University', participants: '180 students', duration: '2 hours',
    content: "**Amélie Mbaye** shared her experience as an actress, giving students essential keys to understand emotion, presence and the truth of a character — a direct bridge between the university and the professional film world.\n\nTo this day the only Senegalese actress to enter Nollywood from California, she plays **Ramatoulaye Fall** in the screen adaptation of Mariama Bâ’s novel *“So Long a Letter”*, ranked No. 1 in Africa.",
    gallery: [], videos: [],
  },
  {
    slug: 'gora-seck', title: 'Dr Gora Seck',
    excerpt: 'Screenwriter, director and theatre director.',
    cover: '/photos/photo09.jpg',
    location: 'Assane Seck University', participants: '150 students', duration: '2 hours',
    content: "Through exchanges and advice, participants dived into the heart of the master class led by **Dr Gora Seck**, screenwriter, director and theatre director.",
    gallery: [], videos: [],
  },
];

export function fallbackMasterclasses(lang) {
  return lang === 'en' ? EN : FR;
}
