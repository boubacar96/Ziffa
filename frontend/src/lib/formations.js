// Conversion d'un lien YouTube/Vimeo en URL d'intégration (embed).
export function toVideoEmbed(url) {
  if (!url) return '';
  let m;
  if ((m = url.match(/youtu\.be\/([\w-]+)/)) || (m = url.match(/[?&]v=([\w-]+)/))) return `https://www.youtube.com/embed/${m[1]}`;
  if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/))) return `https://player.vimeo.com/video/${m[1]}${m[2] ? `?h=${m[2]}` : ''}`;
  return url;
}

// Formations de démonstration (repli tant que rien n'est saisi dans Strapi).
const FR = [
  {
    slug: 'jeu-acteur-camera', title: 'Jouer face caméra',
    excerpt: "Pour les comédien·ne·s qui veulent perfectionner leur jeu à l'image, en conditions réelles.",
    cover: '/photos/photo03.jpg',
    content: "## Objectifs\n\nCette formation est axée sur la **direction d'acteur**, le rapport à la caméra et à l'image.\n\n- Exercices d'essai filmés\n- Mises en situation et improvisations\n- Retours individualisés avec un·e réalisateur·ice\n\nUn travail intensif pour gagner en présence et en justesse devant l'objectif.",
    gallery: ['/photos/photo04.jpg', '/photos/photo05.jpg'], videos: [],
  },
  {
    slug: 'realisation-documentaire', title: 'Réalisation documentaire',
    excerpt: "De l'idée au montage : construire un récit documentaire à partir du réel.",
    cover: '/photos/photo06.jpg',
    content: "## Le programme\n\nRepérage, tournage, entretien, écriture et **post-production**.\n\nLes stagiaires réalisent un court documentaire de bout en bout, encadrés par des professionnels.",
    gallery: ['/photos/photo07.jpg'], videos: [],
  },
  {
    slug: 'animation-2d', title: 'Animation 2D',
    excerpt: "Découvrir les techniques de l'animation 2D et réaliser un court métrage animé.",
    cover: '/photos/photo08.jpg',
    content: "## Au menu\n\nStoryboard, character design, principes du mouvement et réalisation.\n\nAccessible aux **débutants** comme aux intermédiaires.",
    gallery: [], videos: [],
  },
];

const EN = [
  {
    slug: 'jeu-acteur-camera', title: 'Acting for camera',
    excerpt: 'For actors who want to sharpen their on-screen performance, in real conditions.',
    cover: '/photos/photo03.jpg',
    content: "## Goals\n\nThis training focuses on **directing actors**, the relationship to the camera and the image.\n\n- Filmed audition exercises\n- Scenarios and improvisation\n- Individual feedback with a director\n\nIntensive work to gain presence and truth in front of the lens.",
    gallery: ['/photos/photo04.jpg', '/photos/photo05.jpg'], videos: [],
  },
  {
    slug: 'realisation-documentaire', title: 'Documentary directing',
    excerpt: 'From idea to edit: building a documentary narrative from reality.',
    cover: '/photos/photo06.jpg',
    content: "## The programme\n\nResearch, shooting, interviews, writing and **post-production**.\n\nTrainees make a short documentary from start to finish, mentored by professionals.",
    gallery: ['/photos/photo07.jpg'], videos: [],
  },
  {
    slug: 'animation-2d', title: '2D animation',
    excerpt: '2D animation techniques and making an animated short film.',
    cover: '/photos/photo08.jpg',
    content: "## On the menu\n\nStoryboard, character design, principles of movement and production.\n\nOpen to **beginners** and intermediate levels.",
    gallery: [], videos: [],
  },
];

export function fallbackFormations(lang) {
  return lang === 'en' ? EN : FR;
}
