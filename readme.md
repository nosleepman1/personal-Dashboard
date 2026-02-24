## Dashboard Personnel

Application complète de **dashboard personnel** avec un backend Node.js/Express + MongoDB et un frontend React (Vite + TypeScript + Tailwind + Radix UI).  
Elle inclut un système d’**authentification JWT (access + refresh httpOnly)**, un contexte d’auth global sur le frontend et des écrans de tableau de bord.

---

### Sommaire

- **1. Aperçu du projet**
- **2. Stack technique**
- **3. Prérequis**
- **4. Installation et démarrage rapide**
  - 4.1. Cloner le dépôt  
  - 4.2. Configuration du backend  
  - 4.3. Configuration du frontend  
  - 4.4. Lancer le projet (dev)
- **5. Variables d’environnement**
  - 5.1. Backend  
  - 5.2. Frontend
- **6. Scripts disponibles**
  - 6.1. Backend  
  - 6.2. Frontend
- **7. Architecture du projet**
- **8. Authentification & sécurité**
- **9. Bonnes pratiques de développement**
- **10. Améliorations possibles**

---

### 1. Aperçu du projet

L’objectif de ce projet est de fournir un **dashboard personnel moderne**, avec :

- **Backend** REST sécurisé : gestion des utilisateurs, inscription, connexion, profil.
- **Frontend** réactif : tableau de bord, navigation, formulaires d’authentification.
- **Auth** basée sur JWT :
  - Access token stocké **en mémoire** côté frontend.
  - Refresh token stocké côté backend en **cookie httpOnly**.

Ce projet peut servir de base pour :

- Un dashboard perso (suivi d’habitudes, finances, tâches, etc.).
- Un starter kit d’authentification moderne (JWT, refresh token, profil utilisateur).

---

### 2. Stack technique

- **Backend**
  - Node.js / Express 5
  - MongoDB via **Mongoose**
  - Validation avec **Joi**
  - Authentification JWT avec **jsonwebtoken**
  - Hash de mot de passe avec **bcryptjs**
  - Sécurité : **helmet**, **cors**, **cookie-parser**
  - Journaux de requêtes : **morgan**

- **Frontend**
  - **React** 19 + **TypeScript**
  - **Vite** (dev server & build)
  - **React Router DOM** (navigation)
  - **Tailwind CSS** + utilitaires (tailwind-merge, class-variance-authority)
  - **Radix UI** (composants accessibles : dialog, dropdown, etc.)
  - **Recharts** (graphiques)
  - **Axios** (client HTTP)

---

### 3. Prérequis

- **Node.js** ≥ 18 recommandé
- **npm** (fourni avec Node)
- Une instance **MongoDB** locale ou distante

---

### 4. Installation et démarrage rapide

#### 4.1. Cloner le dépôt

```bash
git clone <URL_DU_DEPOT>
cd personal-Dashboard
```

#### 4.2. Configuration du backend

1. Aller dans le dossier backend :

```bash
cd backend
```

2. Installer les dépendances :

```bash
npm install
```

3. Créer le fichier `.env` à partir de l’exemple :

```bash
cp .env.example .env
```

4. Éditer `.env` et adapter les valeurs (voir section **5.1 Backend**).

5. Lancer le backend :

```bash
npm start
```

> Si aucun script `start` n’est encore défini, vous pouvez lancer manuellement :
> ```bash
> node index.js
> ```

Par défaut, le backend écoute sur `http://localhost:3000` (configurable via `PORT`).

#### 4.3. Configuration du frontend

1. Dans un nouveau terminal, se placer dans le dossier frontend :

```bash
cd frontend
```

2. Installer les dépendances :

```bash
npm install
```

3. Créer le fichier `.env` à partir de l’exemple :

```bash
cp .env.example .env
```

4. Vérifier que `VITE_API_URL` pointe bien vers l’URL du backend (par défaut `http://localhost:3000`).

5. Lancer le frontend en mode développement :

```bash
npm run dev
```

Le frontend est disponible sur une URL du type `http://localhost:5173`.

#### 4.4. Lancer le projet (résumé)

- Terminal 1 :
  - `cd backend`
  - `npm install` (une seule fois)
  - `npm start` ou `node index.js`
- Terminal 2 :
  - `cd frontend`
  - `npm install` (une seule fois)
  - `npm run dev`

---

### 5. Variables d’environnement

#### 5.1. Backend (`backend/.env`)

Exemple fourni dans `backend/.env.example` :

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/personal-dashboard
FRONTEND_URL=http://localhost:5173

# Secrets JWT - à générer et garder secrets
JWT_ACCESS_SECRET=remplacez_par_un_secret_long_pour_access_token
JWT_REFRESH_SECRET=remplacez_par_un_secret_long_pour_refresh_token

NODE_ENV=development
```

- **PORT** : port HTTP du backend.
- **MONGO_URI** : URL de connexion MongoDB.
- **FRONTEND_URL** : URL du frontend (utilisée pour CORS et cookies).
- **JWT_ACCESS_SECRET / JWT_REFRESH_SECRET** : secrets à générer vous‑même, longs et complexes.
- **NODE_ENV** : généralement `development` en local.

#### 5.2. Frontend (`frontend/.env`)

Exemple dans `frontend/.env.example` :

```env
VITE_API_URL=http://localhost:3000
```

- **VITE_API_URL** : URL de base de l’API (backend).  
  Utilisée dans la config Axios (`api-client`) et les services (`auth.service.ts`, etc.).

---

### 6. Scripts disponibles

#### 6.1. Backend (`backend/package.json`)

Actuellement :

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

Vous pouvez ajouter par la suite :

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

#### 6.2. Frontend (`frontend/package.json`)

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

- **npm run dev** : lance le serveur de dev Vite.
- **npm run build** : build de production.
- **npm run preview** : prévisualisation du build.
- **npm run lint** : exécute ESLint.

---

### 7. Architecture du projet

Structure simplifiée :

```text
personal-Dashboard/
  backend/
    index.js
    package.json
    package-lock.json
    .env / .env.example
    src/
      controllers/
        auth.controller.js
      middlewares/
        auth.middleware.js
      models/
        User.model.js
      routes/
        auth.route.js

  frontend/
    package.json
    package-lock.json
    .env / .env.example
    src/
      config/
        api.ts
      contexts/
        AuthContext.tsx
      lib/
        api-client.ts
        auth-token.ts
      services/
        api/
          auth.service.ts
      types/
        index.ts
      ... (composants, pages, etc.)
```

- **backend/src/controllers** : logique métier des routes (ex : `auth.controller.js`).
- **backend/src/middlewares** : middlewares Express (ex : `auth.middleware.js` pour vérifier les JWT).
- **backend/src/models** : schémas Mongoose (ex : `User.model.js`).
- **backend/src/routes** : déclaration des routes (ex : `/api/auth/login`, `/api/auth/register`, etc.).
- **frontend/src/contexts/AuthContext.tsx** : gestion centralisée de l’état d’authentification.
- **frontend/src/services/api/auth.service.ts** : fonctions d’appel à l’API d’auth.

---

### 8. Authentification & sécurité

- **Inscription / Connexion**
  - `POST /api/auth/register` : crée un utilisateur et renvoie un **access token** + infos utilisateur.
  - `POST /api/auth/login` : authentifie l’utilisateur et renvoie un **access token** + infos utilisateur.

- **Profil utilisateur**
  - `GET /api/users/profile` : récupère les infos de l’utilisateur courant.
  - `PUT /api/users/profile` : met à jour le profil (firstname, lastname, email…).

- **Côté frontend**
  - `AuthContext` (`AuthContext.tsx`) :
    - Gère `user`, `isAuthenticated`, `isLoading`.
    - Fournit les méthodes : `login`, `register`, `logout`, `updateUser`, `refreshUser`.
  - `auth.service.ts` :
    - Contient les appels réseau (`login`, `register`, `getProfile`, `updateProfile`, `logout`).
  - `auth-token.ts` :
    - Gère le stockage du **token d’accès en mémoire** (et non dans localStorage) pour limiter les risques XSS.

- **Côté backend**
  - Utilise `jsonwebtoken` pour signer et vérifier les tokens.
  - `auth.middleware.js` protège les routes privées.
  - Les mots de passe sont hashés avec `bcryptjs`.

---

### 9. Bonnes pratiques de développement

- Ne **committez jamais** vos fichiers `.env` réels, uniquement les `.env.example`.
- Utilisez des secrets JWT longs et uniques en production.
- Activez la **validation** des données côté backend (Joi) et affichez des messages clairs côté frontend.
- Gardez vos dépendances à jour (`npm outdated`, `npm update`).

---

### 10. Améliorations possibles

- Ajouter des tests automatisés (Jest, Vitest, etc.).
- Mettre en place un script `dev` global (par exemple avec `concurrently`) à la racine pour lancer backend + frontend en une seule commande.
- Ajouter davantage de widgets au dashboard (statistiques perso, tâches, calendrier, etc.).
- Intégrer une stratégie de rafraîchissement automatique du token d’accès (intercepteurs Axios).

---

**Auteur** : à compléter  
**Licence** : ISC (voir `backend/package.json`, à ajuster selon vos besoins)