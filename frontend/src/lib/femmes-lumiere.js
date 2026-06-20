// « Femmes en lumière » — portraits de démonstration (repli tant que rien n'est saisi dans Strapi).
const FR = [
  {
    slug: 'fatou-kande-senghor', title: 'Fatou Kandé Senghor',
    excerpt: 'Réalisatrice, écrivaine et artiste plasticienne sénégalaise, pionnière des arts visuels.',
    cover: '/photos/photo05.jpg',
    content: "## Une voix singulière\n\nRéalisatrice, écrivaine et artiste plasticienne, **Fatou Kandé Senghor** explore les liens entre cinéma, art et transmission.\n\nFondatrice de Waru Studio, elle accompagne une nouvelle génération de créateurs et place la **recherche** et l'**expérimentation** au cœur de sa démarche.",
    gallery: [], videos: [],
  },
  {
    slug: 'oumou-sy', title: 'Oumou Sy',
    excerpt: "Créatrice de costumes et scénographe, figure majeure de la mode et du cinéma africains.",
    cover: '/photos/photo06.jpg',
    content: "## La grande dame du costume\n\n**Oumou Sy** a habillé d'innombrables films et spectacles, imposant une vision flamboyante du **costume** comme récit.\n\nAutodidacte, créatrice et passeuse, elle incarne la créativité sénégalaise à l'international.",
    gallery: [], videos: [],
  },
  {
    slug: 'amelie-mbaye', title: 'Amélie Mbaye',
    excerpt: "Productrice, actrice et réalisatrice sénégalaise, présente avec « L'ai-je bien coupée… ».",
    cover: '/photos/photo07.jpg',
    content: "## Productrice & réalisatrice\n\n**Amélie Mbaye** mène de front le jeu, la production et la réalisation.\n\nLors de l'édition 2025, elle a présenté son court-métrage **« L'ai-je bien coupée… »**, suivi d'une rencontre avec le public.",
    gallery: [], videos: [],
  },
];

const EN = [
  {
    slug: 'fatou-kande-senghor', title: 'Fatou Kandé Senghor',
    excerpt: 'Senegalese director, writer and visual artist, a pioneer of the visual arts.',
    cover: '/photos/photo05.jpg',
    content: "## A singular voice\n\nDirector, writer and visual artist, **Fatou Kandé Senghor** explores the links between cinema, art and transmission.\n\nFounder of Waru Studio, she mentors a new generation of creators and places **research** and **experimentation** at the heart of her work.",
    gallery: [], videos: [],
  },
  {
    slug: 'oumou-sy', title: 'Oumou Sy',
    excerpt: 'Costume designer and set designer, a major figure of African fashion and cinema.',
    cover: '/photos/photo06.jpg',
    content: "## The grande dame of costume\n\n**Oumou Sy** has dressed countless films and shows, asserting a flamboyant vision of **costume** as storytelling.\n\nSelf-taught creator and mentor, she embodies Senegalese creativity on the international stage.",
    gallery: [], videos: [],
  },
  {
    slug: 'amelie-mbaye', title: 'Amélie Mbaye',
    excerpt: "Senegalese producer, actress and director, present with “L'ai-je bien coupée…”.",
    cover: '/photos/photo07.jpg',
    content: "## Producer & director\n\n**Amélie Mbaye** juggles acting, producing and directing.\n\nAt the 2025 edition she presented her short film **“L'ai-je bien coupée…”**, followed by a talk with the audience.",
    gallery: [], videos: [],
  },
];

export function fallbackFemmes(lang) {
  return lang === 'en' ? EN : FR;
}
