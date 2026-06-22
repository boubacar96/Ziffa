import { fetchAPI } from './strapi.js';

// Source UNIQUE du menu — utilisée par le Header ET le Footer pour rester synchronisés.
// `href` = lien de la rubrique (null = rubrique sans page, simple ouvre-menu).
// `dd`   = clé i18n de l'en-tête du sous-menu (header). `items` = sous-liens.
export const NAV = [
  {
    key: 'nav.leziffa', href: '/le-ziffa', dd: 'nav.dd.decouvrir',
    items: [
      { key: 'nav.histoire', href: '/le-ziffa#histoire' },
      { key: 'nav.valeurs', href: '/le-ziffa#valeurs' },
      { key: 'nav.equipe', href: '/le-ziffa#equipe' },
      { key: 'nav.presse', href: '/le-ziffa#presse' },
      { key: 'nav.partenaires', href: '/le-ziffa#partenaires' },
      { key: 'nav.archives', href: '/le-ziffa#archives' },
    ],
  },
  {
    key: 'nav.annee', href: null, dd: 'nav.dd.annee',
    items: [
      { key: 'nav.formations', href: '/formations' },
      { label: { fr: 'Femmes en lumière', en: 'Women in the spotlight' }, href: '/femmes-lumiere' },
      { label: { fr: 'Animation', en: 'Animation' }, href: '/animation' },
      { key: 'nav.expophoto', href: '/expo-photo' },
    ],
  },
  {
    key: 'nav.editions', href: '/edition-2027', dd: 'nav.dd.editions',
    items: [
      { key: 'nav.ed2027', href: '/edition-2027' },
      {
        key: 'nav.ed2025', href: '/edition-2025',
        items: [
          { label: { fr: 'Sélection de films', en: 'Film selection' }, href: '/edition-2025#selection' },
          { label: { fr: 'Programme', en: 'Programme' }, href: '/edition-2025#programme' },
          { label: { fr: 'Palmarès', en: 'Prize list' }, href: '/edition-2025#prix' },
          { label: { fr: 'Jury', en: 'Jury' }, href: '/edition-2025#jury' },
          { label: { fr: 'Masterclasses', en: 'Masterclasses' }, href: '/edition-2025#masterclasses' },
        ],
      },
    ],
  },
  {
    key: 'nav.participer', href: null, dd: 'nav.dd.rejoindre',
    items: [
      { key: 'nav.inscrire', href: '/participer' },
      { key: 'nav.partenariat', href: '/venir-au-festival' },
    ],
  },
  {
    key: 'nav.infos', href: '/contact', dd: 'nav.dd.contacter',
    items: [],
  },
];

// Lien de la page d'une édition : 2025 garde sa page riche dédiée ;
// les autres années passent par le gabarit générique /editions/<année>.
const editionHref = (year) => (String(year) === '2025' ? '/edition-2025' : `/editions/${year}`);

// Sous-menu « Éditions » construit dynamiquement depuis Strapi (1 entrée par édition).
async function getEditionItems() {
  let eds = [];
  try {
    const res = await fetchAPI('editions', { sort: 'year:desc', 'pagination[limit]': '50' });
    eds = (res.data || []).map((e) => e.year).filter(Boolean);
  } catch (e) { /* Strapi indisponible : aucune édition */ }
  return eds.map((year) => {
    const h = editionHref(year);
    return {
      label: { fr: `Édition ${year}`, en: `${year} edition` }, href: h,
      items: [
        { label: { fr: 'Sélection de films', en: 'Film selection' }, href: h + '#selection' },
        { label: { fr: 'Programme', en: 'Programme' }, href: h + '#programme' },
        { label: { fr: 'Palmarès', en: 'Prize list' }, href: h + '#prix' },
        { label: { fr: 'Jury', en: 'Jury' }, href: h + '#jury' },
        { label: { fr: 'Masterclasses', en: 'Masterclasses' }, href: h + '#masterclasses' },
      ],
    };
  });
}

// NAV résolu : la rubrique « Éditions » est remplie depuis Strapi.
// S'il n'y a aucune édition, la rubrique est masquée.
export async function resolveNav() {
  const edItems = await getEditionItems();
  return NAV
    .map((g) => {
      if (g.key !== 'nav.editions') return g;
      if (!edItems.length) return null;
      return { ...g, href: edItems[0].href, items: edItems };
    })
    .filter(Boolean);
}
