// Les 3 parties de l'espace presse. La clé `key` correspond à la valeur
// du champ `category` d'une « Ressource presse » dans Strapi.
export const PRESS_PARTS = [
  {
    key: 'dossier', color: 'red', icon: '📄',
    fr: { title: 'Dossier de presse', desc: 'Présentation complète du festival, chiffres clés, axes de programmation et contacts.' },
    en: { title: 'Press kit', desc: 'Full festival presentation, key figures, programming highlights and contacts.' },
  },
  {
    key: 'logos', color: 'green', icon: '🎨',
    fr: { title: 'Logos & charte', desc: "Logos ZIFFA (couleur, blanc) et règles d'usage de la marque." },
    en: { title: 'Logos & brand', desc: 'ZIFFA logos (colour, white) and brand usage guidelines.' },
  },
  {
    key: 'photos', color: 'yellow', icon: '📸',
    fr: { title: 'Photothèque', desc: 'Sélection de photos haute définition libres de droits pour la presse.' },
    en: { title: 'Photo library', desc: 'A selection of high-resolution, royalty-free photos for the press.' },
  },
];
