# 📊 Frontend Dashboard Personnel

Interface utilisateur moderne et complète pour le Dashboard Personnel, construite avec React, TypeScript, Tailwind CSS et Shadcn UI.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Backend API en cours d'exécution (voir `/backend/README.md`)

### Installation

```bash
# Installer les dépendances
npm install

# Créer le fichier .env à partir de .env.example
cp .env.example .env

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (par défaut avec Vite).

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ui/             # Composants Shadcn UI
│   │   └── layout/         # Layouts (MainLayout, ProtectedRoute)
│   ├── config/             # Configuration (API endpoints)
│   ├── contexts/           # Contextes React (AuthContext)
│   ├── lib/                # Utilitaires (api-client, format, utils)
│   ├── pages/              # Pages de l'application
│   ├── services/           # Services API
│   │   └── api/           # Services pour chaque ressource
│   ├── types/              # Types TypeScript
│   ├── App.tsx             # Composant racine avec routing
│   └── main.tsx            # Point d'entrée
├── .env.example            # Exemple de fichier d'environnement
└── package.json
```

## 🏗️ Architecture

### Services API

Tous les appels API sont centralisés dans `src/services/api/` :

- **auth.service.ts** - Authentification (login, register, profile)
- **debt.service.ts** - Gestion des dettes
- **expense.service.ts** - Gestion des dépenses
- **income.service.ts** - Gestion des recettes
- **business.service.ts** - Gestion des entreprises
- **contribution.service.ts** - Gestion des apports
- **dashboard.service.ts** - Statistiques du dashboard

Chaque service contient des méthodes pour les opérations CRUD, avec des commentaires détaillés expliquant chaque appel API.

### Contexte d'Authentification

Le contexte `AuthContext` (`src/contexts/AuthContext.tsx`) gère :
- L'état d'authentification global
- Le stockage du token JWT
- Les méthodes `login`, `register`, `logout`
- La mise à jour du profil utilisateur

### Pages

- **Login.tsx** - Page de connexion
- **Register.tsx** - Page d'inscription
- **Dashboard.tsx** - Dashboard principal avec statistiques

### Composants Layout

- **MainLayout.tsx** - Layout principal avec navigation
- **ProtectedRoute.tsx** - Protection des routes authentifiées

## 🔐 Authentification

L'authentification utilise JWT. Le token est stocké dans le `localStorage` et ajouté automatiquement à toutes les requêtes via l'intercepteur axios (`src/lib/api-client.ts`).

### Utilisation dans un composant

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // ...
}
```

## 📡 Appels API

### Exemple: Créer une dépense

```typescript
import { expenseService } from '@/services/api';

// Créer une dépense
try {
  const expense = await expenseService.create({
    title: 'Courses',
    amount: 50.00,
    category: 'food',
    paymentMethod: 'card'
  });
  console.log('Dépense créée:', expense);
} catch (error) {
  console.error('Erreur:', error);
}
```

### Exemple: Récupérer le dashboard

```typescript
import { dashboardService } from '@/services/api';

// Récupérer les statistiques
try {
  const stats = await dashboardService.getStats({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  console.log('Balance nette:', stats.summary.netBalance);
} catch (error) {
  console.error('Erreur:', error);
}
```

## 🎨 Composants UI

L'application utilise [Shadcn UI](https://ui.shadcn.com/) pour les composants UI. Tous les composants sont disponibles dans `src/components/ui/`.

### Composants disponibles

- Button, Card, Input, Label
- Badge, Skeleton, Avatar
- DropdownMenu, Select, Dialog
- Table, Tabs, Accordion
- Et plus...

## 📝 Formatage

Des fonctions utilitaires sont disponibles dans `src/lib/format.ts` :

- `formatCurrency(amount)` - Formate un montant en EUR
- `formatDate(dateString)` - Formate une date
- `formatDateTime(dateString)` - Formate une date avec l'heure

## 🌐 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du dossier `frontend` :

```env
# URL de l'API backend
VITE_API_URL=http://localhost:3000
```

### Configuration API

Les endpoints sont configurés dans `src/config/api.ts`. Vous pouvez modifier l'URL de base ou les endpoints si nécessaire.

## 🔒 Protection des Routes

Les routes protégées utilisent le composant `ProtectedRoute` :

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </ProtectedRoute>
  }
/>
```

Si l'utilisateur n'est pas authentifié, il sera automatiquement redirigé vers `/login`.

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint
```

## 📦 Dépendances Principales

- **react** - Framework UI
- **react-router-dom** - Routing
- **axios** - Client HTTP
- **tailwindcss** - Styles
- **lucide-react** - Icônes
- **shadcn/ui** - Composants UI

## 🎯 Prochaines Étapes

Pour compléter l'application, vous pouvez ajouter :

1. Pages pour chaque ressource (Dépenses, Recettes, Dettes, etc.)
2. Formulaires de création/édition
3. Tableaux avec pagination
4. Graphiques (recharts est déjà installé)
5. Filtres et recherche avancée
6. Export de données (PDF, Excel)

## 📄 Licence

ISC
