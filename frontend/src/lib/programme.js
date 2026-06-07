// Libellés des catégories d'activité du programme, FR / EN.
export const CAT_LABELS = {
  fr: {
    ouverture: "Soirée d'ouverture",
    cloture: 'Cérémonie de clôture',
    projection: 'Projection',
    competition: 'Films en compétition',
    'hors-competition': 'Hors compétition',
    masterclass: 'Master class',
    rencontre: 'Rencontre',
    ceremonie: 'Cérémonie',
    exposition: 'Exposition photos',
    vernissage: 'Vernissage',
    'cine-enfants': 'Ciné enfants',
    festivites: 'Festivités',
  },
  en: {
    ouverture: 'Opening night',
    cloture: 'Closing ceremony',
    projection: 'Screening',
    competition: 'Films in competition',
    'hors-competition': 'Out of competition',
    masterclass: 'Master class',
    rencontre: 'Talk',
    ceremonie: 'Ceremony',
    exposition: 'Photo exhibition',
    vernissage: 'Exhibition opening',
    'cine-enfants': "Kids' cinema",
    festivites: 'Festivities',
  },
};

export function catLabel(type, lang) {
  return (CAT_LABELS[lang] || CAT_LABELS.fr)[type] || type || '';
}

// Affiche "11h" ou "11h – 16h".
export function timeRange(start, end) {
  if (start && end) return `${start} – ${end}`;
  return start || end || '';
}
