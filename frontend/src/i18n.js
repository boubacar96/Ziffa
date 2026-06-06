// i18n — FR (défaut, à la racine) + EN (sous /en).
export const defaultLang = 'fr';

export const ui = {
  fr: {
    'topstrip.edition': 'ÉDITION 2027 · INSCRIPTIONS OUVERTES',
    'nav.leziffa': 'Le ZIFFA',
    'nav.annee': "À l'année",
    'nav.ed2027': 'Édition 2027',
    'nav.ed2025': 'Édition 2025',
    'nav.editions': 'Éditions',
    'nav.dd.editions': '— Les éditions',
    'nav.participer': 'Participer',
    'nav.infos': 'Infos',
    'nav.accrediter': "S'accréditer",
    'nav.dd.decouvrir': '— Découvrir le festival',
    'nav.histoire': 'Histoire du Festival',
    'nav.valeurs': 'Nos valeurs',
    'nav.equipe': 'Équipe',
    'nav.presse': 'Presse',
    'nav.partenaires': 'Nos partenaires',
    'nav.archives': 'Archives',
    'nav.dd.formations': '— Formations permanentes',
    'nav.dd.annee': "— Tout au long de l'année",
    'nav.formations': 'Formations',
    'nav.expophoto': 'Expo photo',
    'nav.formdoc': 'Formation documentaire',
    'nav.formanim': 'Formation animation',
    'nav.dd.prochaine': '— Prochaine édition',
    'nav.prix': 'Prix',
    'nav.programme': 'Programme',
    'nav.jury': 'Jury',
    'nav.masterclasses': 'Masterclasses',
    'nav.affiche': 'Affiche',
    'nav.dd.passee': '— Édition passée',
    'nav.enimages': 'En images',
    'nav.dd.rejoindre': '— Rejoignez-nous',
    'nav.inscrire': 'Inscrire un film',
    'nav.partenariat': 'Venir au festival',
    'nav.dd.contacter': '— Nous contacter',
    'nav.contacts': 'Contacts',
    'nav.newsletter': 'Newsletter',
    'footer.tagline': 'Ziguinchor International Film Festival & Animation — le rendez-vous du cinéma africain en Casamance.',
    'footer.festival': '— Festival',
    'footer.histoire': 'Histoire',
    'footer.valeurs': 'Valeurs',
    'footer.equipe': "L'équipe",
    'footer.archives': 'Archives',
    'footer.ed2027': '— Édition 2027',
    'footer.galerie': 'Galerie',
    'footer.participer': '— Participer',
    'footer.formations': 'Formations',
    'footer.presse': 'Presse',
    'footer.infos': '— Infos',
    'footer.contact': 'Contact',
    'footer.ed2025link': 'Édition 2025',
    'footer.rights': '© 2026 ZIFFA · Tous droits réservés',
  },
  en: {
    'topstrip.edition': '2027 EDITION · SUBMISSIONS OPEN',
    'nav.leziffa': 'The ZIFFA',
    'nav.annee': 'Year-round',
    'nav.ed2027': '2027 Edition',
    'nav.ed2025': '2025 Edition',
    'nav.editions': 'Editions',
    'nav.dd.editions': '— The editions',
    'nav.participer': 'Take part',
    'nav.infos': 'Info',
    'nav.accrediter': 'Get accredited',
    'nav.dd.decouvrir': '— Discover the festival',
    'nav.histoire': 'Festival history',
    'nav.valeurs': 'Our goals',
    'nav.equipe': 'Team',
    'nav.presse': 'Press',
    'nav.partenaires': 'Our partners',
    'nav.archives': 'Archives',
    'nav.dd.formations': '— Permanent training',
    'nav.dd.annee': '— All year round',
    'nav.formations': 'Training',
    'nav.expophoto': 'Photo exhibition',
    'nav.formdoc': 'Documentary training',
    'nav.formanim': 'Animation training',
    'nav.dd.prochaine': '— Next edition',
    'nav.prix': 'Awards',
    'nav.programme': 'Programme',
    'nav.jury': 'Jury',
    'nav.masterclasses': 'Masterclasses',
    'nav.affiche': 'Poster',
    'nav.dd.passee': '— Past edition',
    'nav.enimages': 'In pictures',
    'nav.dd.rejoindre': '— Join us',
    'nav.inscrire': 'Submit a film',
    'nav.partenariat': 'Come to the festival',
    'nav.dd.contacter': '— Get in touch',
    'nav.contacts': 'Contacts',
    'nav.newsletter': 'Newsletter',
    'footer.tagline': 'Ziguinchor International Film Festival & Animation — the home of African cinema in Casamance.',
    'footer.festival': '— Festival',
    'footer.histoire': 'History',
    'footer.valeurs': 'Goals',
    'footer.equipe': 'The team',
    'footer.archives': 'Archives',
    'footer.ed2027': '— 2027 Edition',
    'footer.galerie': 'Gallery',
    'footer.participer': '— Take part',
    'footer.formations': 'Training',
    'footer.presse': 'Press',
    'footer.infos': '— Info',
    'footer.contact': 'Contact',
    'footer.ed2025link': '2025 Edition',
    'footer.rights': '© 2026 ZIFFA · All rights reserved',
  },
};

export function getLangFromUrl(url) {
  const seg = url.pathname.split('/')[1];
  return seg === 'en' ? 'en' : 'fr';
}

export function useTranslations(lang) {
  return function t(key) {
    return ui[lang]?.[key] ?? ui[defaultLang][key] ?? key;
  };
}

// Localise un lien interne : '/le-ziffa' -> '/en/le-ziffa' en anglais.
export function lp(path, lang) {
  if (lang !== 'en') return path;
  if (path === '/') return '/en';
  return '/en' + path;
}

// URL équivalente dans la langue cible (pour le bouton FR/EN).
export function altPath(url, targetLang) {
  const p = url.pathname;
  if (targetLang === 'en') {
    if (p.startsWith('/en')) return p;
    return p === '/' ? '/en' : '/en' + p;
  }
  // cible FR : on retire le préfixe /en
  return p.replace(/^\/en(?=\/|$)/, '') || '/';
}
