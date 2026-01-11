# 📊 API Dashboard Personnel - Documentation Complète

API REST complète pour la gestion d'un dashboard personnel avec authentification, gestion des dettes, dépenses, recettes, entreprises et apports.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Authentification](#authentification)
- [Documentation des Endpoints](#documentation-des-endpoints)
  - [Authentification](#1-authentification)
  - [Utilisateurs](#2-utilisateurs)
  - [Dettes](#3-dettes)
  - [Dépenses](#4-dépenses)
  - [Recettes](#5-recettes)
  - [Entreprises](#6-entreprises)
  - [Apports](#7-apports)
  - [Dashboard](#8-dashboard)
  - [Santé](#9-santé)
- [Codes de statut HTTP](#codes-de-statut-http)
- [Gestion des erreurs](#gestion-des-erreurs)

---

## 🔧 Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start
```

## ⚙️ Configuration

Créer un fichier `.env` à la racine du dossier `backend` :

```env
MONGO_URI=mongodb://localhost:27017/dashboard-personnel
# ou pour MongoDB Atlas :
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dashboard-personnel

PORT=3000

JWT_SECRET=votre_secret_jwt_très_sécurisé_et_long
```

## 🏗️ Architecture

Le projet suit l'architecture **MVC (Model-View-Controller)** :

```
backend/
├── src/
│   ├── models/          # Modèles Mongoose
│   ├── controllers/     # Logique métier
│   ├── routes/          # Définition des routes
│   ├── middlewares/     # Middlewares (auth, validation)
│   └── database/        # Configuration MongoDB
├── index.js             # Point d'entrée de l'application
└── package.json
```

## 🔐 Authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification. La plupart des endpoints nécessitent un token d'authentification dans le header :

```
Authorization: Bearer <votre_token_jwt>
```

### Comment obtenir un token ?

1. **S'inscrire** : `POST /api/auth/register`
2. **Se connecter** : `POST /api/auth/login`

Les deux endpoints retournent un token JWT valide pendant 7 jours.

---

## 📚 Documentation des Endpoints

### 1. Authentification

Base URL : `/api/auth`

#### 🔹 POST /api/auth/register

**Description** : Crée un nouveau compte utilisateur et retourne un token JWT.

**Authentification** : ❌ Non requise

**Body (JSON)** :
```json
{
  "firstname": "Jean",
  "lastname": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

**Validation** :
- `firstname` : string, 2-30 caractères, requis
- `lastname` : string, 2-30 caractères, requis
- `email` : string, email valide, requis
- `password` : string, minimum 6 caractères, requis

**Réponse Succès (201)** :
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "firstname": "Jean",
    "lastname": "Dupont",
    "email": "jean.dupont@example.com"
  }
}
```

**Erreurs possibles** :
- `400` : Erreur de validation
- `409` : Email déjà utilisé

---

#### 🔹 POST /api/auth/login

**Description** : Authentifie un utilisateur existant et retourne un token JWT.

**Authentification** : ❌ Non requise

**Body (JSON)** :
```json
{
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

**Réponse Succès (200)** :
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "firstname": "Jean",
    "lastname": "Dupont",
    "email": "jean.dupont@example.com"
  }
}
```

**Erreurs possibles** :
- `400` : Erreur de validation
- `401` : Email ou mot de passe incorrect

---

### 2. Utilisateurs

Base URL : `/api/users`

#### 🔹 GET /api/users/profile

**Description** : Récupère les informations du profil de l'utilisateur connecté.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "firstname": "Jean",
    "lastname": "Dupont",
    "email": "jean.dupont@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erreurs possibles** :
- `401` : Token invalide ou expiré
- `404` : Utilisateur non trouvé

---

#### 🔹 PUT /api/users/profile

**Description** : Met à jour les informations du profil de l'utilisateur connecté.

**Authentification** : ✅ Requise (Bearer Token)

**Body (JSON)** - Tous les champs sont optionnels :
```json
{
  "firstname": "Jean-Pierre",
  "lastname": "Martin",
  "email": "nouveau.email@example.com"
}
```

**Réponse Succès (200)** :
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "firstname": "Jean-Pierre",
    "lastname": "Martin",
    "email": "nouveau.email@example.com",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Erreurs possibles** :
- `401` : Token invalide ou expiré
- `409` : Email déjà utilisé par un autre compte

---

### 3. Dettes

Base URL : `/api/debts`

#### 🔹 POST /api/debts

**Description** : Crée une nouvelle dette pour l'utilisateur connecté.

**Authentification** : ✅ Requise (Bearer Token)

**Body (JSON)** :
```json
{
  "title": "Prêt bancaire",
  "description": "Prêt pour achat voiture",
  "amount": 15000,
  "creditor": "Banque XYZ",
  "dueDate": "2024-12-31",
  "status": "pending",
  "category": "Prêt personnel"
}
```

**Champs requis** :
- `title` : string, 1-100 caractères
- `amount` : number, minimum 0

**Champs optionnels** :
- `description` : string, max 500 caractères
- `creditor` : string, max 100 caractères
- `dueDate` : date (format ISO)
- `status` : "pending" | "paid" | "overdue" (défaut: "pending")
- `category` : string, max 50 caractères

**Réponse Succès (201)** :
```json
{
  "message": "Debt created successfully",
  "debt": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "user": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Prêt bancaire",
    "amount": 15000,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 🔹 GET /api/debts

**Description** : Récupère toutes les dettes de l'utilisateur connecté, triées par date de création (plus récentes en premier).

**Authentification** : ✅ Requise (Bearer Token)

**Query Parameters** (optionnels) :
- `status` : Filtrer par statut ("pending" | "paid" | "overdue")
- `category` : Filtrer par catégorie

**Exemple** :
```
GET /api/debts?status=pending&category=Prêt personnel
```

**Réponse Succès (200)** :
```json
{
  "debts": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "title": "Prêt bancaire",
      "amount": 15000,
      "status": "pending",
      "creditor": "Banque XYZ",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "category": "Prêt personnel",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### 🔹 GET /api/debts/:id

**Description** : Récupère les détails d'une dette spécifique par son ID.

**Authentification** : ✅ Requise (Bearer Token)

**Paramètres** :
- `id` : ID de la dette (dans l'URL)

**Réponse Succès (200)** :
```json
{
  "debt": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "title": "Prêt bancaire",
    "description": "Prêt pour achat voiture",
    "amount": 15000,
    "creditor": "Banque XYZ",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "status": "pending",
    "category": "Prêt personnel",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erreurs possibles** :
- `404` : Dette non trouvée

---

#### 🔹 PUT /api/debts/:id

**Description** : Met à jour une dette existante. Tous les champs sont optionnels.

**Authentification** : ✅ Requise (Bearer Token)

**Body (JSON)** - Tous les champs sont optionnels :
```json
{
  "title": "Prêt bancaire - MAJ",
  "amount": 14000,
  "status": "paid"
}
```

**Réponse Succès (200)** :
```json
{
  "message": "Debt updated successfully",
  "debt": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "title": "Prêt bancaire - MAJ",
    "amount": 14000,
    "status": "paid",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Erreurs possibles** :
- `404` : Dette non trouvée

---

#### 🔹 DELETE /api/debts/:id

**Description** : Supprime une dette.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "message": "Debt deleted successfully"
}
```

**Erreurs possibles** :
- `404` : Dette non trouvée

---

### 4. Dépenses

Base URL : `/api/expenses`

#### 🔹 POST /api/expenses

**Description** : Crée une nouvelle dépense.

**Authentification** : ✅ Requise (Bearer Token)

**Body (JSON)** :
```json
{
  "title": "Courses supermarché",
  "description": "Courses de la semaine",
  "amount": 125.50,
  "category": "food",
  "date": "2024-01-15",
  "paymentMethod": "card",
  "recurring": false
}
```

**Champs requis** :
- `title` : string, 1-100 caractères
- `amount` : number, minimum 0

**Champs optionnels** :
- `description` : string, max 500 caractères
- `category` : "food" | "transport" | "housing" | "entertainment" | "health" | "shopping" | "bills" | "education" | "other" (défaut: "other")
- `date` : date (format ISO, défaut: date actuelle)
- `paymentMethod` : "cash" | "card" | "bank_transfer" | "mobile_payment" | "other" (défaut: "other")
- `recurring` : boolean (défaut: false)
- `recurringFrequency` : "daily" | "weekly" | "monthly" | "yearly" (requis si recurring = true)

**Réponse Succès (201)** :
```json
{
  "message": "Expense created successfully",
  "expense": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "title": "Courses supermarché",
    "amount": 125.50,
    "category": "food",
    "paymentMethod": "card",
    "date": "2024-01-15T00:00:00.000Z"
  }
}
```

---

#### 🔹 GET /api/expenses

**Description** : Récupère toutes les dépenses avec statistiques (total et nombre).

**Authentification** : ✅ Requise (Bearer Token)

**Query Parameters** (optionnels) :
- `category` : Filtrer par catégorie
- `startDate` : Date de début (format ISO)
- `endDate` : Date de fin (format ISO)
- `paymentMethod` : Filtrer par méthode de paiement

**Exemple** :
```
GET /api/expenses?category=food&startDate=2024-01-01&endDate=2024-01-31
```

**Réponse Succès (200)** :
```json
{
  "expenses": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "title": "Courses supermarché",
      "amount": 125.50,
      "category": "food",
      "date": "2024-01-15T00:00:00.000Z"
    }
  ],
  "total": 125.50,
  "count": 1
}
```

---

#### 🔹 GET /api/expenses/:id

**Description** : Récupère les détails d'une dépense spécifique.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "expense": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "title": "Courses supermarché",
    "description": "Courses de la semaine",
    "amount": 125.50,
    "category": "food",
    "paymentMethod": "card",
    "date": "2024-01-15T00:00:00.000Z",
    "recurring": false
  }
}
```

---

#### 🔹 PUT /api/expenses/:id

**Description** : Met à jour une dépense existante.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "message": "Expense updated successfully",
  "expense": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "title": "Courses supermarché - MAJ",
    "amount": 130.00
  }
}
```

---

#### 🔹 DELETE /api/expenses/:id

**Description** : Supprime une dépense.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "message": "Expense deleted successfully"
}
```

---

### 5. Recettes

Base URL : `/api/incomes`

#### 🔹 POST /api/incomes

**Description** : Crée une nouvelle recette.

**Authentification** : ✅ Requise (Bearer Token)

**Body (JSON)** :
```json
{
  "title": "Salaire janvier",
  "description": "Salaire mensuel",
  "amount": 3500,
  "category": "salary",
  "date": "2024-01-01",
  "source": "Entreprise ABC",
  "recurring": true,
  "recurringFrequency": "monthly"
}
```

**Champs requis** :
- `title` : string, 1-100 caractères
- `amount` : number, minimum 0

**Champs optionnels** :
- `description` : string, max 500 caractères
- `category` : "salary" | "freelance" | "investment" | "rental" | "bonus" | "gift" | "other" (défaut: "other")
- `date` : date (format ISO, défaut: date actuelle)
- `source` : string, max 100 caractères
- `recurring` : boolean (défaut: false)
- `recurringFrequency` : "daily" | "weekly" | "monthly" | "yearly" (requis si recurring = true)

**Réponse Succès (201)** :
```json
{
  "message": "Income created successfully",
  "income": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "title": "Salaire janvier",
    "amount": 3500,
    "category": "salary",
    "source": "Entreprise ABC"
  }
}
```

---

#### 🔹 GET /api/incomes

**Description** : Récupère toutes les recettes avec statistiques (total et nombre).

**Authentification** : ✅ Requise (Bearer Token)

**Query Parameters** (optionnels) :
- `category` : Filtrer par catégorie
- `startDate` : Date de début (format ISO)
- `endDate` : Date de fin (format ISO)
- `source` : Filtrer par source

**Réponse Succès (200)** :
```json
{
  "incomes": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
      "title": "Salaire janvier",
      "amount": 3500,
      "category": "salary",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 3500,
  "count": 1
}
```

---

#### 🔹 GET /api/incomes/:id

**Description** : Récupère les détails d'une recette spécifique.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "income": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "title": "Salaire janvier",
    "description": "Salaire mensuel",
    "amount": 3500,
    "category": "salary",
    "source": "Entreprise ABC",
    "date": "2024-01-01T00:00:00.000Z",
    "recurring": true,
    "recurringFrequency": "monthly"
  }
}
```

---

#### 🔹 PUT /api/incomes/:id

**Description** : Met à jour une recette existante.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "message": "Income updated successfully",
  "income": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "title": "Salaire janvier - MAJ",
    "amount": 3600
  }
}
```

---

#### 🔹 DELETE /api/incomes/:id

**Description** : Supprime une recette.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "message": "Income deleted successfully"
}
```

---

### 6. Entreprises

Base URL : `/api/businesses`

#### 🔹 POST /api/businesses

**Description** : Crée une nouvelle entreprise.

**Authentification** : ✅ Requise (Bearer Token)

**Body (JSON)** :
```json
{
  "name": "Ma Société SARL",
  "description": "Description de l'entreprise",
  "type": "llc",
  "registrationNumber": "123456789",
  "taxId": "FR12345678901",
  "address": {
    "street": "123 Rue Example",
    "city": "Paris",
    "state": "Île-de-France",
    "zipCode": "75001",
    "country": "France"
  },
  "contact": {
    "email": "contact@masociete.fr",
    "phone": "+33123456789",
    "website": "https://masociete.fr"
  },
  "startDate": "2020-01-01",
  "status": "active"
}
```

**Champs requis** :
- `name` : string, 1-100 caractères

**Champs optionnels** :
- `description` : string, max 1000 caractères
- `type` : "sole_proprietorship" | "partnership" | "corporation" | "llc" | "other" (défaut: "other")
- `registrationNumber` : string, max 100 caractères
- `taxId` : string, max 100 caractères
- `address` : objet avec street, city, state, zipCode, country
- `contact` : objet avec email, phone, website
- `startDate` : date (format ISO)
- `status` : "active" | "inactive" | "suspended" | "closed" (défaut: "active")

**Réponse Succès (201)** :
```json
{
  "message": "Business created successfully",
  "business": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
    "name": "Ma Société SARL",
    "type": "llc",
    "status": "active",
    "totalRevenue": 0,
    "totalExpenses": 0
  }
}
```

---

#### 🔹 GET /api/businesses

**Description** : Récupère toutes les entreprises de l'utilisateur.

**Authentification** : ✅ Requise (Bearer Token)

**Query Parameters** (optionnels) :
- `status` : Filtrer par statut
- `type` : Filtrer par type

**Réponse Succès (200)** :
```json
{
  "businesses": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "name": "Ma Société SARL",
      "type": "llc",
      "status": "active",
      "totalRevenue": 50000,
      "totalExpenses": 30000
    }
  ]
}
```

---

#### 🔹 GET /api/businesses/:id

**Description** : Récupère les détails d'une entreprise spécifique.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "business": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
    "name": "Ma Société SARL",
    "description": "Description de l'entreprise",
    "type": "llc",
    "registrationNumber": "123456789",
    "address": {
      "street": "123 Rue Example",
      "city": "Paris",
      "state": "Île-de-France",
      "zipCode": "75001",
      "country": "France"
    },
    "contact": {
      "email": "contact@masociete.fr",
      "phone": "+33123456789",
      "website": "https://masociete.fr"
    },
    "status": "active",
    "totalRevenue": 50000,
    "totalExpenses": 30000
  }
}
```

---

#### 🔹 PUT /api/businesses/:id

**Description** : Met à jour une entreprise existante.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "message": "Business updated successfully",
  "business": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
    "name": "Ma Société SARL - MAJ",
    "status": "active"
  }
}
```

---

#### 🔹 DELETE /api/businesses/:id

**Description** : Supprime une entreprise.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "message": "Business deleted successfully"
}
```

---

### 7. Apports

Base URL : `/api/contributions`

#### 🔹 POST /api/contributions

**Description** : Crée un nouvel apport (investissement, don, épargne, etc.).

**Authentification** : ✅ Requise (Bearer Token)

**Body (JSON)** :
```json
{
  "title": "Investissement immobilier",
  "description": "Achat d'un appartement",
  "amount": 50000,
  "category": "investment",
  "date": "2024-01-15",
  "recipient": "Agence immobilière XYZ",
  "status": "pending",
  "recurring": false
}
```

**Champs requis** :
- `title` : string, 1-100 caractères
- `amount` : number, minimum 0

**Champs optionnels** :
- `description` : string, max 500 caractères
- `category` : "investment" | "savings" | "loan" | "donation" | "subscription" | "other" (défaut: "other")
- `date` : date (format ISO, défaut: date actuelle)
- `recipient` : string, max 100 caractères
- `status` : "pending" | "completed" | "cancelled" (défaut: "pending")
- `recurring` : boolean (défaut: false)
- `recurringFrequency` : "daily" | "weekly" | "monthly" | "yearly" (requis si recurring = true)

**Réponse Succès (201)** :
```json
{
  "message": "Contribution created successfully",
  "contribution": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
    "title": "Investissement immobilier",
    "amount": 50000,
    "category": "investment",
    "status": "pending"
  }
}
```

---

#### 🔹 GET /api/contributions

**Description** : Récupère tous les apports avec statistiques (total et nombre).

**Authentification** : ✅ Requise (Bearer Token)

**Query Parameters** (optionnels) :
- `category` : Filtrer par catégorie
- `status` : Filtrer par statut
- `startDate` : Date de début (format ISO)
- `endDate` : Date de fin (format ISO)

**Réponse Succès (200)** :
```json
{
  "contributions": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
      "title": "Investissement immobilier",
      "amount": 50000,
      "category": "investment",
      "status": "pending"
    }
  ],
  "total": 50000,
  "count": 1
}
```

---

#### 🔹 GET /api/contributions/:id

**Description** : Récupère les détails d'un apport spécifique.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "contribution": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
    "title": "Investissement immobilier",
    "description": "Achat d'un appartement",
    "amount": 50000,
    "category": "investment",
    "recipient": "Agence immobilière XYZ",
    "status": "pending",
    "date": "2024-01-15T00:00:00.000Z"
  }
}
```

---

#### 🔹 PUT /api/contributions/:id

**Description** : Met à jour un apport existant.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "message": "Contribution updated successfully",
  "contribution": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
    "title": "Investissement immobilier - MAJ",
    "status": "completed"
  }
}
```

---

#### 🔹 DELETE /api/contributions/:id

**Description** : Supprime un apport.

**Authentification** : ✅ Requise (Bearer Token)

**Réponse Succès (200)** :
```json
{
  "message": "Contribution deleted successfully"
}
```

---

### 8. Dashboard

Base URL : `/api/dashboard`

#### 🔹 GET /api/dashboard

**Description** : Récupère toutes les statistiques agrégées du dashboard (résumé financier complet).

**Authentification** : ✅ Requise (Bearer Token)

**Query Parameters** (optionnels) :
- `startDate` : Date de début pour filtrer les données (format ISO)
- `endDate` : Date de fin pour filtrer les données (format ISO)

**Exemple** :
```
GET /api/dashboard?startDate=2024-01-01&endDate=2024-01-31
```

**Réponse Succès (200)** :
```json
{
  "summary": {
    "totalDebts": 15000,
    "totalExpenses": 5000,
    "totalIncomes": 3500,
    "totalContributions": 2000,
    "netBalance": -3500,
    "totalBusinessRevenue": 50000,
    "totalBusinessExpenses": 30000,
    "totalBusinessProfit": 20000
  },
  "counts": {
    "debts": 5,
    "expenses": 20,
    "incomes": 10,
    "businesses": 2,
    "contributions": 3
  },
  "debts": {
    "total": 5,
    "byStatus": {
      "pending": 3,
      "paid": 1,
      "overdue": 1
    },
    "recent": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "title": "Prêt bancaire",
        "amount": 15000,
        "status": "pending",
        "dueDate": "2024-12-31T00:00:00.000Z"
      }
    ]
  },
  "expenses": {
    "total": 5000,
    "byCategory": {
      "food": 2000,
      "transport": 1000,
      "housing": 2000
    },
    "recent": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j3",
        "title": "Courses supermarché",
        "amount": 125.50,
        "category": "food",
        "date": "2024-01-15T00:00:00.000Z"
      }
    ]
  },
  "incomes": {
    "total": 3500,
    "byCategory": {
      "salary": 3500,
      "freelance": 0
    },
    "recent": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j4",
        "title": "Salaire janvier",
        "amount": 3500,
        "category": "salary",
        "date": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "businesses": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "name": "Ma Société SARL",
      "revenue": 50000,
      "expenses": 30000,
      "profit": 20000
    }
  ],
  "contributions": {
    "total": 2000,
    "recent": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j6",
        "title": "Investissement immobilier",
        "amount": 50000,
        "category": "investment",
        "status": "pending"
      }
    ]
  }
}
```

**Informations retournées** :
- **summary** : Totaux financiers (dettes non payées, dépenses, recettes, apports, balance nette, statistiques entreprises)
- **counts** : Nombre total de chaque type d'entité
- **debts** : Statistiques des dettes (par statut, 5 plus récentes)
- **expenses** : Statistiques des dépenses (par catégorie, 5 plus récentes)
- **incomes** : Statistiques des recettes (par catégorie, 5 plus récentes)
- **businesses** : Liste des entreprises avec leurs revenus/dépenses/profits
- **contributions** : Statistiques des apports (total, 5 plus récents)

---

### 9. Santé

Base URL : `/api/health`

#### 🔹 GET /api/health

**Description** : Vérifie l'état du serveur (health check).

**Authentification** : ❌ Non requise

**Réponse Succès (200)** :
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 📊 Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès - Requête traitée avec succès |
| 201 | Créé - Ressource créée avec succès |
| 400 | Mauvaise requête - Erreur de validation |
| 401 | Non autorisé - Token manquant, invalide ou expiré |
| 404 | Non trouvé - Ressource introuvable |
| 409 | Conflit - Email déjà utilisé |
| 500 | Erreur serveur - Erreur interne du serveur |

## ⚠️ Gestion des erreurs

Toutes les erreurs retournent un format JSON cohérent :

```json
{
  "error": "Message d'erreur descriptif"
}
```

Pour les erreurs de validation (400), la réponse peut contenir un tableau de détails :

```json
{
  "error": "Validation error",
  "details": [
    "Le champ 'email' est requis",
    "Le champ 'password' doit contenir au moins 6 caractères"
  ]
}
```

---

## 🔑 Exemples d'utilisation

### Exemple complet avec cURL

```bash
# 1. Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Jean",
    "lastname": "Dupont",
    "email": "jean@example.com",
    "password": "motdepasse123"
  }'

# 2. Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "motdepasse123"
  }'

# 3. Créer une dépense (avec token)
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -d '{
    "title": "Courses",
    "amount": 50.00,
    "category": "food"
  }'

# 4. Récupérer le dashboard
curl -X GET http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

### Exemple avec JavaScript (Fetch API)

```javascript
// Connexion
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'jean@example.com',
    password: 'motdepasse123'
  })
});

const { token } = await loginResponse.json();

// Créer une dépense
const expenseResponse = await fetch('http://localhost:3000/api/expenses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Courses',
    amount: 50.00,
    category: 'food'
  })
});

const expense = await expenseResponse.json();
```

---

## 📝 Notes importantes

1. **Authentification** : Tous les endpoints (sauf `/api/auth/*` et `/api/health`) nécessitent un token JWT dans le header `Authorization: Bearer <token>`

2. **Format des dates** : Utiliser le format ISO 8601 (ex: `2024-01-15` ou `2024-01-15T10:30:00.000Z`)

3. **ID des ressources** : Les IDs sont des ObjectId MongoDB (format: `64f1a2b3c4d5e6f7g8h9i0j1`)

4. **Validation** : Toutes les entrées sont validées côté serveur avec Joi. Les erreurs de validation retournent un code 400.

5. **Sécurité** : Les mots de passe sont hashés avec bcrypt avant stockage. Ne jamais stocker de mots de passe en clair.

---

## 🚀 Développement

Pour démarrer le serveur en mode développement :

```bash
node index.js
```

Le serveur démarre sur le port défini dans `process.env.PORT` (par défaut 3000).

---

## 📄 Licence

ISC
