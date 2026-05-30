# Strapi v5 — image de production
FROM node:20-alpine

# Dépendances natives (sharp/vips pour le traitement d'images)
RUN apk add --no-cache build-base python3 vips-dev

WORKDIR /opt/app

# Installe les dépendances (avec devDeps : nécessaires au build de l'admin)
COPY package*.json ./
RUN npm install

# Code source + build du panneau d'administration
COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 1337
CMD ["npm", "run", "start"]
