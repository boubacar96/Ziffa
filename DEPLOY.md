# Déploiement — VPS Hetzner (CX32)

Guide pas-à-pas pour mettre ZIFFA en production sur un seul serveur Hetzner Cloud
**CX32** (4 vCPU / 8 Go / 80 Go), Ubuntu 24.04, avec Docker + Caddy (HTTPS auto).

---

## 0. Pré-requis
- Un compte **Hetzner Cloud**.
- Un **nom de domaine** (ex. `ziffa.sn`) dont tu gères les DNS.
- Une **clé SSH** sur ta machine (`ssh-keygen -t ed25519` si tu n'en as pas).

---

## 1. Créer le serveur
1. Hetzner Cloud → **New Server**.
2. Localisation : Falkenstein/Nuremberg (Europe) ou Helsinki.
3. Image : **Ubuntu 24.04**.
4. Type : **CX32** (Shared vCPU x86).
5. Ajoute ta **clé SSH**.
6. (Option) Active les **sauvegardes** (Backups) — recommandé.
7. Crée le serveur, note son **IP publique**.

## 2. DNS
Chez ton registrar, crée deux enregistrements **A** vers l'IP du serveur :
```
ziffa.sn          A   <IP>
admin.ziffa.sn    A   <IP>
```
(et éventuellement `www.ziffa.sn`). Attends la propagation (quelques minutes).

## 3. Première connexion & durcissement
```bash
ssh root@<IP>

# Utilisateur non-root
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# Pare-feu : on n'ouvre que SSH + HTTP + HTTPS
apt update && apt install -y ufw fail2ban
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable

# Désactiver le login root par mot de passe (clé SSH uniquement)
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh
```
Reconnecte-toi ensuite en `ssh deploy@<IP>`.

## 4. Installer Docker
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker deploy
# déconnecte/reconnecte pour appliquer le groupe
exit && ssh deploy@<IP>
docker --version && docker compose version
```

## 5. Récupérer le projet
```bash
# via Git (recommandé)
git clone <URL_DU_REPO> ziffa && cd ziffa
# ou via scp depuis ta machine :
#   scp -r ./Ziffa deploy@<IP>:~/ziffa
```

## 6. Configurer les secrets
```bash
cp .env.example .env
nano .env
```
Renseigne :
- `SITE_DOMAIN=ziffa.sn` et `ADMIN_DOMAIN=admin.ziffa.sn`
- `PUBLIC_STRAPI_URL=https://admin.ziffa.sn`
- un `DATABASE_PASSWORD` fort
- chaque secret Strapi, généré avec :
```bash
openssl rand -base64 32     # à exécuter pour APP_KEYS (x4), salts, secrets…
```

## 7. Lancer
```bash
docker compose up -d --build      # build des images + démarrage
docker compose logs -f cms        # suivre le démarrage de Strapi (Ctrl-C pour quitter)
```
Caddy obtient automatiquement les certificats Let's Encrypt (les ports 80/443
doivent être joignables et les DNS corrects).

- Back-office : **https://admin.ziffa.sn/admin** → crée le **1er compte administrateur**.
- Site public : **https://ziffa.sn**

## 8. Permissions de l'API (important)
Dans Strapi → **Settings → Users & Permissions → Roles → Public** :
coche **find / findOne** pour les types lus par le site (article, partner, edition,
film, programme-event, person, prize, photo, formation, global). Sans ça, le
frontend reçoit du vide (403).

## 9. Donner accès à l'équipe ZIFFA
Strapi → **Settings → Administration Panel → Users** : invite les membres de
l'équipe et attribue des **rôles** (Editor / Author) selon ce qu'ils peuvent modifier.

---

## Sauvegardes
**Base de données (cron quotidien) :**
```bash
mkdir -p ~/backups
crontab -e
# ajoute :
0 3 * * * cd ~/ziffa && docker compose exec -T db pg_dump -U ziffa ziffa | gzip > ~/backups/ziffa-$(date +\%F).sql.gz
```
**Médias :** ils vivent dans le volume Docker `uploads` (ou sur S3 si activé).
**Snapshots Hetzner :** active-les dans la console (hebdomadaire). Teste une
restauration au moins une fois.

## Mettre à jour le site
```bash
cd ~/ziffa
git pull
docker compose up -d --build
```

## Dépannage rapide
- `docker compose ps` — état des services.
- `docker compose logs -f caddy` — problèmes de certificat / domaine.
- `docker compose logs -f cms` — erreurs Strapi / base de données.
- Build Strapi tué (OOM) ? Sur CX32 (8 Go) ça ne devrait pas arriver ; sinon
  ajoute du swap (`fallocate -l 4G /swapfile …`).

## Pour aller plus loin
- **Frontend 100 % statique** : passe `output: 'static'` dans `astro.config.mjs`,
  retire l'adaptateur node, et déclenche un rebuild via un **webhook Strapi**
  (Settings → Webhooks) à chaque publication. Site encore plus rapide et robuste.
- **Object Storage (S3)** : décommente le provider upload dans `cms/config/plugins.js`.
- **CI/CD** : un workflow GitHub Actions qui fait `ssh … docker compose up -d --build`.
