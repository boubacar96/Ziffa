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
      { key: 'nav.expophoto', href: '/expo-photo' },
    ],
  },
  {
    key: 'nav.editions', href: '/edition-2027', dd: 'nav.dd.editions',
    items: [
      { key: 'nav.ed2027', href: '/edition-2027' },
      { key: 'nav.ed2025', href: '/edition-2025' },
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
