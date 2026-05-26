# Mon Vieux Grimoire 📚

Site communautaire de référencement et de notation de livres, développé dans le cadre du projet 6 de la formation Développeur Web OpenClassrooms.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)

## 📋 Description

Mon Vieux Grimoire est une API REST back-end pour une application de notation de livres. Les utilisateurs peuvent s'inscrire, se connecter, ajouter des livres avec photos, et noter les livres des autres membres.

**Fonctionnalités back-end :**
- Authentification sécurisée (JWT + bcrypt)
- CRUD complet sur les livres
- Upload et optimisation automatique des images (Sharp)
- Calcul de la note moyenne des livres
- Système de notation par utilisateur (une note par livre par utilisateur)

## 🏗️ Architecture

Ce projet est composé de deux parties :

| Partie | Technologie | Description |
|---|---|---|
| **Back-end** | Node.js / Express | Développé dans ce projet |
| **Front-end** | React (Create React App) | Fourni par OpenClassrooms |

## 🛠️ Stack technique (Back-end)

| Technologie | Version | Usage |
|---|---|---|
| Node.js | ≥ 18 | Runtime JavaScript |
| Express | 5 | Framework HTTP |
| Mongoose | — | ODM MongoDB |
| MongoDB | — | Base de données (Atlas Cloud) |
| bcrypt | 6 | Hachage des mots de passe |
| jsonwebtoken | 9 | Authentification JWT |
| multer | 2 | Upload de fichiers |
| sharp | 0.34 | Optimisation et conversion des images |
| dotenv | 17 | Gestion des variables d'environnement |

## 🚀 Installation et lancement

### Prérequis

- Node.js ≥ 18
- Un cluster MongoDB (ex : [MongoDB Atlas](https://www.mongodb.com/atlas) — offre gratuite disponible)

### Back-end

```bash
# 1. Cloner le dépôt
git clone https://github.com/AuguiMaxime/mon-vieux-grimoire.git
cd mon-vieux-grimoire/backend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env (voir section Variables d'environnement)
cp .env.example .env

# 4. Lancer le serveur
node server.js
```

Le serveur écoute sur : `http://localhost:4000`

### Front-end (fourni par OpenClassrooms)

```bash
cd frontend
npm install
npm start
```

Le front-end démarre sur : `http://localhost:3000`

## 🔐 Variables d'environnement

Créer un fichier `.env` à la racine du dossier `backend/` :

```env
# URI de connexion MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# Clé secrète pour la signature des tokens JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire

# Port du serveur (optionnel, défaut : 4000)
PORT=4000
```

> ⚠️ **Ne jamais committer le fichier `.env`** — il est inclus dans `.gitignore`

## 📁 Structure du projet

```
mon-vieux-grimoire/
├── backend/
│   ├── server.js              # Point d'entrée — création du serveur HTTP
│   ├── app.js                 # Configuration Express, CORS, routes
│   ├── .env                   # Variables d'environnement (non versionné)
│   ├── .gitignore
│   ├── package.json
│   ├── controllers/
│   │   ├── book.js            # Logique métier livres (CRUD + notation)
│   │   └── user.js            # Logique métier utilisateurs (signup/login)
│   ├── middleware/
│   │   ├── auth.js            # Vérification du token JWT
│   │   ├── multer-config.js   # Configuration upload fichiers
│   │   └── sharp-config.js    # Optimisation images (WebP, resize)
│   ├── models/
│   │   ├── Book.js            # Schéma Mongoose livre
│   │   └── User.js            # Schéma Mongoose utilisateur
│   ├── routes/
│   │   ├── book.js            # Routes /api/books
│   │   └── user.js            # Routes /api/auth
│   └── images/                # Dossier de stockage des images uploadées
└── frontend/                  # Front-end fourni par OpenClassrooms (React)
```

## 🔌 Endpoints API

### Authentification

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| POST | `/api/auth/signup` | Créer un compte | Non |
| POST | `/api/auth/login` | Se connecter | Non |

### Livres

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| GET | `/api/books` | Récupérer tous les livres | Non |
| GET | `/api/books/bestrating` | Top 3 livres les mieux notés | Non |
| GET | `/api/books/:id` | Récupérer un livre par ID | Non |
| POST | `/api/books` | Ajouter un livre | ✅ Oui |
| PUT | `/api/books/:id` | Modifier un livre | ✅ Oui (auteur) |
| DELETE | `/api/books/:id` | Supprimer un livre | ✅ Oui (auteur) |
| POST | `/api/books/:id/rating` | Noter un livre | ✅ Oui |

## 🌐 Déploiement

Le back-end nécessite un environnement Node.js avec persistance du système de fichiers (pour les images uploadées). Options recommandées :

- **[Railway](https://railway.app)** — Simple, offre gratuite, supporte les volumes
- **[Render](https://render.com)** — Offre gratuite disponible
- **VPS** (OVH, DigitalOcean…) — Pour un contrôle total

> ℹ️ Vercel et Netlify sont des plateformes serverless, inadaptées pour ce type de serveur Express avec stockage de fichiers.

## 👨‍💻 Auteur

**Maxime Augui** — Développeur Web Full-Stack  
[Portfolio](https://portfolio-sigma-bay-72.vercel.app) · [GitHub](https://github.com/AuguiMaxime)
