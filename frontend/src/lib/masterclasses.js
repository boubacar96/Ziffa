// Masterclasses de démonstration (repli tant que rien n'est saisi dans Strapi).
const FR = [
  {
    slug: 'fatou-kande-senghor', title: 'Fatou Kandé Senghor',
    excerpt: 'Réalisatrice et scénariste (Sénégal) — transmission autour du regard et de l’engagement.',
    cover: '/photos/photo03.jpg',
    content: "## Masterclass\n\n**Fatou Kandé Senghor**, réalisatrice et scénariste sénégalaise, partage son parcours et sa vision du cinéma engagé.\n\nUn échange sur l’écriture, le regard documentaire et la place des femmes dans la création audiovisuelle africaine.",
    gallery: ['/photos/photo04.jpg', '/photos/photo05.jpg'], videos: [],
  },
  {
    slug: 'amelie-mbaye', title: 'Amélie Mbaye',
    excerpt: "Productrice, actrice et réalisatrice — projection et discussion autour de « L’ai-je bien coupée… ».",
    cover: '/photos/photo06.jpg',
    content: "## Masterclass\n\nProjection du court-métrage **« L’ai-je bien coupée… »** d’Amélie Mbaye, suivie d’une masterclass et d’une discussion autour du film, du montage et de la direction d’acteurs.",
    gallery: ['/photos/photo07.jpg'], videos: [],
  },
  {
    slug: 'babacar-siby', title: 'Babacar Siby',
    excerpt: 'Coach de théâtre et scénariste : « Vérité du personnage, émotion et authenticité ».',
    cover: '/photos/photo08.jpg',
    content: "## Masterclass\n\n**Babacar Siby**, coach de théâtre et scénariste, explore la **vérité du personnage**, l’émotion et l’authenticité du jeu.",
    gallery: [], videos: [],
  },
  {
    slug: 'gora-seck', title: 'Gora Seck',
    excerpt: 'Scénariste, réalisateur et metteur en scène de théâtre.',
    cover: '/photos/photo09.jpg',
    content: "## Masterclass\n\n**Gora Seck**, scénariste, réalisateur et metteur en scène de théâtre, partage son expérience de l’écriture à la mise en scène.",
    gallery: [], videos: [],
  },
];

const EN = [
  {
    slug: 'fatou-kande-senghor', title: 'Fatou Kandé Senghor',
    excerpt: 'Director and screenwriter (Senegal) — on vision and commitment.',
    cover: '/photos/photo03.jpg',
    content: "## Masterclass\n\n**Fatou Kandé Senghor**, a Senegalese director and screenwriter, shares her path and her vision of committed cinema.\n\nA conversation on writing, the documentary gaze and the place of women in African audiovisual creation.",
    gallery: ['/photos/photo04.jpg', '/photos/photo05.jpg'], videos: [],
  },
  {
    slug: 'amelie-mbaye', title: 'Amélie Mbaye',
    excerpt: "Producer, actress and director — screening and talk around « L'ai-je bien coupée… ».",
    cover: '/photos/photo06.jpg',
    content: "## Masterclass\n\nScreening of Amélie Mbaye's short film **« L'ai-je bien coupée… »**, followed by a masterclass and discussion on the film, editing and directing actors.",
    gallery: ['/photos/photo07.jpg'], videos: [],
  },
  {
    slug: 'babacar-siby', title: 'Babacar Siby',
    excerpt: 'Theatre coach and screenwriter: character truth, emotion and authenticity.',
    cover: '/photos/photo08.jpg',
    content: "## Masterclass\n\n**Babacar Siby**, theatre coach and screenwriter, explores **character truth**, emotion and authenticity in performance.",
    gallery: [], videos: [],
  },
  {
    slug: 'gora-seck', title: 'Gora Seck',
    excerpt: 'Screenwriter, director and theatre director.',
    cover: '/photos/photo09.jpg',
    content: "## Masterclass\n\n**Gora Seck**, screenwriter, director and theatre director, shares his experience from writing to staging.",
    gallery: [], videos: [],
  },
];

export function fallbackMasterclasses(lang) {
  return lang === 'en' ? EN : FR;
}
