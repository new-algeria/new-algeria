<div align="center">

<img src="public/assets/img/branding/Logo%20Horizontal.png" alt="New Algeria" width="420" />

### Construire le futur numérique de l'Algérie 🇩🇿

Innovation · Prospective · Accessibilité · Développement

[🌐 Site web](https://www.newalgeria.org) · [📊 data-dz](https://www.data-dz.com) · [🔌 API-DZ](https://www.data-dz.com/api) · [✉️ Contact](mailto:admin@newalgeria.org)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-FR%20%7C%20EN%20%7C%20AR-green)

</div>

---

## 🌟 À propos

**New Algeria** est une initiative communautaire, portée par des Algériens, qui vise à accélérer la transformation numérique du pays : des services publics plus accessibles, des données ouvertes et des outils pour les développeurs.

Ce dépôt contient le **site vitrine officiel** de l'organisation, [newalgeria.org](https://www.newalgeria.org). Il présente la vision du projet, les réalisations de la communauté et permet à chacun de rejoindre l'aventure en un clic.

### 🚀 Les projets de l'organisation

| Projet | Description |
| --- | --- |
| [**data-dz**](https://www.data-dz.com) | La première plateforme de données ouvertes d'Algérie 📊 |
| [**API-DZ**](https://www.data-dz.com/api) | La première plateforme d'API d'Algérie, dans la continuité du portail de données 🔌 |

## ✨ Fonctionnalités du site

- 🏠 **Hero animé** avec une vidéo de fond et les valeurs du projet
- 🧩 **Services** : services numériques, jeux de données utiles, outils de développement
- 🍱 **Bento grid** : infrastructure numérique, cybersécurité, communauté
- 🕒 **Timeline** des projets lancés (data-dz, API-DZ) avec démos vidéo
- 👥 **Membres de la communauté** récupérés en direct depuis l'API GitHub de l'organisation
- 🤝 **Bouton « Rejoignez-nous »** : invitation automatique dans l'organisation GitHub à partir d'une adresse e-mail
- ❓ **FAQ** et section **contact**
- 🌍 **Trilingue** : français, anglais et arabe, avec détection automatique de la langue du navigateur
- 🌗 **Thème clair / sombre** et design **responsive**

## 🛠️ Stack technique

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev) (avec SWC)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix UI) + [Flowbite React](https://flowbite-react.com)
- [Framer Motion](https://www.framer.com/motion/) pour les animations
- [i18next](https://www.i18next.com) / react-i18next pour l'internationalisation
- [Octokit](https://github.com/octokit) pour l'intégration GitHub
- [Vercel Analytics](https://vercel.com/analytics) pour les statistiques de visite
- Médias (logos, vidéos) hébergés sur un bucket **Cloudflare R2**

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org) 18 ou plus (installation conseillée via [nvm](https://github.com/nvm-sh/nvm))
- npm, ou [Bun](https://bun.sh) (un `bun.lockb` est fourni)

### Installation

```sh
# 1. Cloner le dépôt
git clone https://github.com/new-algeria/new-algeria.git
cd new-algeria

# 2. Installer les dépendances
npm install      # ou : bun install

# 3. Configurer les variables d'environnement (voir ci-dessous)

# 4. Lancer le serveur de développement
npm run dev
```

Le site est alors accessible sur **http://localhost:8080** 🎉

### 🔑 Variables d'environnement

Créez un fichier `.env.local` à la racine (il est ignoré par Git) :

```env
# Token GitHub utilisé pour lister les membres et envoyer les invitations de l'organisation
VITE_GITHUB_COLLABORATORS_TOKEN=ghp_xxxxxxxxxxxxxxxx

# URL publique du bucket R2 contenant les logos et les vidéos
VITE_R2_BUCKET_URI=https://votre-bucket.r2.dev
```

> 💡 Sans token valide, le site fonctionne quand même : seuls la liste des membres et le bouton d'invitation GitHub seront inactifs.

### 📜 Scripts disponibles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Lance le serveur de développement (port 8080) |
| `npm run build` | Génère la version de production dans `dist/` |
| `npm run build:dev` | Build en mode développement |
| `npm run preview` | Prévisualise le build de production en local |
| `npm run lint` | Analyse le code avec ESLint |

## 📁 Structure du projet

```
new-algeria/
├── public/                 # Fichiers statiques (logos, favicon, images)
│   └── assets/img/branding # Identité visuelle New Algeria
├── src/
│   ├── components/         # Sections de la page (Hero, Services, Timeline, FAQ…)
│   │   └── ui/             # Composants d'interface (shadcn/ui & co)
│   ├── hooks/              # Hooks React personnalisés
│   ├── locales/            # Traductions
│   │   ├── fr/translation.json
│   │   ├── en/translation.json
│   │   └── ar/translation.json
│   ├── pages/Index.tsx     # Page d'accueil (assemble toutes les sections)
│   ├── i18n.ts             # Configuration d'i18next
│   └── main.tsx            # Point d'entrée de l'application
├── index.html              # HTML racine + métadonnées SEO / Open Graph
└── vite.config.ts          # Configuration Vite (alias `@` → `src/`)
```

## 🌍 Ajouter ou modifier une traduction

Les textes du site se trouvent dans `src/locales/<langue>/translation.json`.

1. Ajoutez votre clé dans **les trois fichiers** (`fr`, `en`, `ar`) pour garder les langues synchronisées.
2. Utilisez-la dans un composant via `const { t } = useTranslation();` puis `t("ma.cle")`.

Pour ajouter une nouvelle langue, créez son dossier dans `src/locales/` et déclarez-la dans `src/i18n.ts`.

## 🤝 Contribuer

Développeurs, data scientists, enseignants, designers… **tout le monde est le bienvenu !** 💚

1. Rejoignez l'organisation via le bouton **« ✨ Rejoignez-nous »** sur [newalgeria.org](https://www.newalgeria.org), ou écrivez-nous à [admin@newalgeria.org](mailto:admin@newalgeria.org).
2. Créez une branche : `git checkout -b feature/ma-super-idee`
3. Commitez vos changements : `git commit -m "Ajoute ma super idée"`
4. Poussez la branche : `git push -u origin feature/ma-super-idee`
5. Ouvrez une Pull Request 🎉

Pensez à lancer `npm run lint` avant d'ouvrir votre PR.

## 👥 L'équipe

| | Rôle |
| --- | --- |
| [**@prosabd**](https://github.com/prosabd) | Fondateur |
| [**@Berachem**](https://github.com/Berachem) | Fondateur |
| [**@HaniBAHIDJ**](https://github.com/HaniBAHIDJ) | Géomaticien 🌍 |

Et tous les [membres de l'organisation](https://github.com/orgs/new-algeria/people) qui font vivre le projet ❤️

## 📬 Nous suivre

- 🐙 GitHub : [@new-algeria](https://github.com/new-algeria)
- 🐦 X / Twitter : [@newalgeria_org](https://x.com/newalgeria_org)
- 💼 LinkedIn : [New Algeria](https://www.linkedin.com/company/106182021/)
- ✉️ E-mail : [admin@newalgeria.org](mailto:admin@newalgeria.org)

---

<div align="center">

Fait avec ❤️ par et pour les Algériens 🇩🇿

</div>
