# ZIFFA — Site web (Astro + Strapi)

Site officiel du **Ziguinchor International Film Festival & Animation**.

- **Frontend** : [Astro](https://astro.build) (SSR) — site public, design sur-mesure.
- **Back-office** : [Strapi v5](https://strapi.io) — gestion autonome des contenus par l'équipe.
- **Base de données** : PostgreSQL.
- **Infra** : Docker Compose + Caddy (HTTPS automatique), un seul VPS Hetzner (CX32).

```
ziffa/
├── docker-compose.yml      orchestration des 4 services
├── Caddyfile               reverse proxy + TLS
├── .env.example            variables à copier en .env
├── DEPLOY.md               déploiement Hetzner pas-à-pas
│
├── cms/                    Strapi (back-office + API)
│   ├── config/             server, admin, database, middlewares, plugins
│   └── src/api/            modèle de contenu (10 types) ← cœur du CMS
│
├── frontend/               Astro (site public)
│   ├── src/layouts/        Base.astro
│   ├── src/components/     Header.astro, Footer.astro
│   ├── src/lib/strapi.js   client API Strapi (fetch + médias)
│   ├── src/pages/          routes (index + stubs à porter)
│   ├── src/styles/         style.css (repris du design existant)
│   └── public/             ziffa.png, photos/, partenaires/
│
└── *.html                  SITE STATIQUE DE RÉFÉRENCE (design validé)
                            → source à porter dans frontend/src/pages/
```

## Modèle de contenu Strapi (ce que l'équipe pourra éditer)

| Type | Contenu |
|---|---|
| **Paramètres du site** (single) | Emails, téléphone, adresse, réseaux sociaux |
| **Édition** | Année, dates, lieu, affiche, édition courante (relie films/programme/jury/prix/photos) |
| **Film** | Titre, catégorie, synopsis, réalisateur, pays, affiche, bande-annonce |
| **Événement (programme)** | Titre, horaire, durée, type, lieu, jour |
| **Personne** | Nom, rôle, bio, photo, type (jury / équipe / invité) |
| **Prix** | Nom, description, lauréat |
| **Article** | Titre, slug, chapô, corps (rich text), couverture |
| **Partenaire** | Nom, logo, lien, niveau |
| **Photo** | Image, légende (galerie par édition) |
| **Formation** | Titre, description, type (doc / animation) |

## Démarrer

### En local (Docker)
```bash
cp .env.example .env        # puis génère les secrets (voir .env.example)
docker compose up -d --build
# Site    → http://localhost (voir bloc "DÉV LOCAL" du Caddyfile)
# Strapi  → http://localhost/admin  (crée le 1er compte admin)
```

### En local (sans Docker, pour développer)
```bash
# Terminal 1 — CMS
cd cms && npm install && npm run develop      # http://localhost:1337/admin
# Terminal 2 — Frontend
cd frontend && npm install && npm run dev      # http://localhost:4321
```

## Déploiement
Voir **[DEPLOY.md](DEPLOY.md)** (VPS Hetzner CX32, pas-à-pas).

## Reste à faire (migration)
- Porter les pages `*.html` (racine) dans `frontend/src/pages/*.astro`.
- Brancher chaque section dynamique sur Strapi (cf. `index.astro` pour le motif).
- Créer les content (éditions, films, programme…) dans le back-office.
- (Optionnel) Hetzner Object Storage (S3) pour les médias — cf. `cms/config/plugins.js`.
