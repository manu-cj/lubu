# Documentation Technique - Lubu Budget Management Application

## Vue d'ensemble

Lubu est une application web de gestion de budget développée avec Next.js et TypeScript. Elle permet aux utilisateurs de suivre leurs dépenses et revenus, de visualiser leurs données financières à travers des graphiques interactifs, et de gérer leur budget personnel.

## Architecture

### Stack Technologique

#### Frontend
- **Next.js 15** - Framework React avec rendu côté serveur
- **React 18** - Bibliothèque UI avec hooks modernes
- **TypeScript** - Typage statique pour une meilleure qualité de code
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animations et transitions fluides
- **Recharts** - Bibliothèque de graphiques React

#### Backend
- **Next.js API Routes** - Endpoints API RESTful
- **MongoDB avec Mongoose** - Base de données NoSQL principale
- **SQLite avec Sequelize** - Base de données locale (configuration dual)
- **JWT (jsonwebtoken)** - Authentification avec tokens d'accès et de rafraîchissement

#### Outils et Utilitaires
- **Axios** - Client HTTP avec intercepteurs automatiques
- **bcrypt** - Hachage sécurisé des mots de passe
- **react-swipeable** - Gestion des gestes de balayage
- **nodemailer** - Envoi d'emails (reset password)

### Structure du Projet

```
app/
├── (pages)/                    # Pages avec layouts personnalisés
│   ├── forgot-password/
│   └── reset-password/
├── api/                        # Routes API
│   ├── (post-get)/            # Endpoints GET/POST
│   └── (update)/              # Endpoints de mise à jour
├── components/                 # Composants React réutilisables
│   ├── auth/                  # Composants d'authentification
│   ├── forms/                 # Formulaires
│   ├── graphiques/            # Graphiques et visualisations
│   ├── home/                  # Composants de la page d'accueil
│   ├── profile/               # Gestion du profil utilisateur
│   ├── shared/                # Composants partagés
│   ├── transactions/          # Gestion des transactions
│   └── ui/                    # Composants UI de base
├── controllers/               # Logique métier
├── lib/                       # Utilitaires et configurations
├── models/                    # Modèles de données (Mongoose)
├── types/                     # Définitions TypeScript
└── validators/                # Validation des données
```

## Authentification et Sécurité

### Système JWT

L'application utilise un système d'authentification JWT à double token :

#### Access Token
- **Durée de vie** : 1 heure
- **Stockage** : Cookie httpOnly
- **Usage** : Authentification des requêtes API

#### Refresh Token
- **Durée de vie** : 14 jours
- **Stockage** : Cookie httpOnly
- **Usage** : Régénération automatique des access tokens

### Intercepteur Axios

Le fichier `app/lib/api.ts` contient un intercepteur Axios qui :
- Gère automatiquement l'expiration des tokens
- Relance les requêtes échouées après rafraîchissement
- Maintient une file d'attente des requêtes en échec

```typescript
// Gestion automatique du refresh token
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Logique de rafraîchissement automatique
        }
    }
);
```

### Sécurisation des Cookies

```typescript
response.cookies.set("token", token, {
    httpOnly: true,                           // Empêche l'accès JavaScript
    secure: process.env.NODE_ENV === "production", // HTTPS en production
    maxAge: 3600,                            // 1 heure
    sameSite: "strict",                      // Protection CSRF
    path: "/",
});
```

## Modèles de Données

### Utilisateur (User)
```typescript
interface User {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;          // Hashé avec bcrypt
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
}
```

### Dépense (Expense)
```typescript
interface Expense {
    _id: string;
    amount: number;
    description: string;
    date: string;
    user_id: string;           // Référence vers l'utilisateur
    category_id: string;       // Référence vers la catégorie
}
```

### Budget
```typescript
interface Budget {
    _id: string;
    user_id: string;
    monthly_budget: number;
    created_at: Date;
    updated_at: Date;
}
```

## API Endpoints

### Authentification

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth` | POST | Connexion utilisateur |
| `/api/logout` | POST | Déconnexion |
| `/api/protected` | GET | Vérification d'authentification |
| `/api/refresh-token` | GET | Rafraîchissement du token |
| `/api/forgot-password` | POST | Demande de reset password |
| `/api/reset-password` | POST | Reset du mot de passe |
| `/api/change-password` | PUT | Changement de mot de passe |

### Gestion des Données

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/expenses` | GET/POST | Gestion des dépenses |
| `/api/revenues` | GET/POST | Gestion des revenus |
| `/api/budget` | GET/POST | Gestion du budget |
| `/api/expense-categories` | GET | Catégories de dépenses |
| `/api/revenue-categories` | GET | Catégories de revenus |
| `/api/expenses-by-page` | GET | Pagination des dépenses |
| `/api/revenues-by-page` | GET | Pagination des revenus |

## Interface Utilisateur

### Navigation

L'application utilise un système de navigation par onglets avec support du swipe :

- **Résumé** : Vue d'ensemble des finances
- **Transactions** : Liste des dépenses et revenus
- **Graphiques** : Visualisations des données

### Gestion des Gestes

```typescript
const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    delta: 100,                    // Pixels pour déclencher
    trackTouch: true,              // Support tactile
    trackMouse: false,             // Pas de support souris
});
```

### Animations

Utilisation de Framer Motion pour :
- Transitions entre pages
- Animations d'apparition des composants
- Feedback visuel lors des interactions

## Visualisations de Données

### Graphiques Disponibles

1. **Dépenses Annuelles** (`AnnualExpense`)
2. **Dépenses par Mois** (`AnnualExpenseByMonth`)
3. **Revenus par Mois** (`AnnualRevenueByMonth`)
4. **Dépenses par Catégorie** (`ExpenseByCategory`)
5. **Dépenses Annuelles par Catégorie** (`AnnualExpensesByCategory`)

### Configuration Recharts

```typescript
<ResponsiveContainer width="100%" height={200}>
    <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Dépenses" fill="#38b044" />
    </BarChart>
</ResponsiveContainer>
```

## Base de Données

### Connexion MongoDB

```typescript
// Configuration avec cache global pour optimiser les performances
global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function connectToDatabase(): Promise<Connection> {
    if (global.mongooseCache!.conn) return global.mongooseCache!.conn;
    
    if (!global.mongooseCache!.promise) {
        global.mongooseCache!.promise = mongoose
            .connect(MONGODB_URI, { dbName: "Lubu" })
            .then((mongoose) => mongoose.connection);
    }
    
    global.mongooseCache!.conn = await global.mongooseCache!.promise;
    return global.mongooseCache!.conn;
}
```

### Modèles Mongoose

Les modèles sont définis dans `app/models/` avec vérification d'existence :

```typescript
// Évite la redéfinition en développement
const Users = mongoose.models.Users || mongoose.model<IUser>('Users', UserSchema);
```

## Performance et Optimisation

### Stratégies Mises en Place

1. **Cache de Connexion DB** : Réutilisation des connexions MongoDB
2. **Lazy Loading** : Chargement conditionnel des composants
3. **Memoization** : Optimisation des re-rendus React
4. **File d'Attente** : Gestion intelligente des requêtes échouées

### Gestion d'État

- **useState** : État local des composants
- **useEffect** : Effets de bord et chargement des données
- **Pas de store global** : Architecture simple sans Redux

## Variables d'Environnement

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/lubu

# Authentification
AUTH_SECRET=your-jwt-secret
REFRESH_SECRET=your-refresh-secret

# Email (pour reset password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Environnement
NODE_ENV=development|production
```

## Déploiement

### Prérequis
- Node.js 18+
- MongoDB en cours d'exécution
- Variables d'environnement configurées

### Scripts NPM

```bash
npm run dev        # Développement avec Turbopack
npm run build      # Build de production
npm run start      # Serveur de production
npm run lint       # Linting du code
```

### Déploiement sur Vercel

L'application est configurée pour un déploiement simple sur Vercel :
- Configuration automatique des variables d'environnement
- Base URL API configurée pour la production
- Build optimisé avec Next.js

## Dépannage

### Problèmes Courants

1. **Token Expiré**
   - Vérifier la configuration des cookies
   - S'assurer que les secrets JWT sont définis

2. **Erreurs de Base de Données**
   - Vérifier la connexion MongoDB
   - Contrôler les variables d'environnement

3. **Problèmes de CORS**
   - Configurer `withCredentials: true` dans Axios
   - Vérifier les paramètres de cookies

### Logs et Debugging

Les erreurs sont loggées dans la console avec des messages descriptifs :

```typescript
console.error("Erreur lors de la création de l'utilisateur:", error);
```

## Roadmap et Améliorations

### Fonctionnalités à Venir
- [ ] Notifications push
- [ ] Synchronisation multi-appareils
- [ ] Exportation de données (PDF, CSV)
- [ ] Comparaisons budgétaires
- [ ] Prédictions basées sur l'IA

### Améliorations Techniques
- [ ] Migration vers App Router complet
- [ ] Ajout de tests unitaires et d'intégration
- [ ] Optimisation des images avec Next.js
- [ ] Mise en place d'un CDN
- [ ] Monitoring et analytics

## Contribution

### Standards de Code
- **ESLint** : Configuration Next.js par défaut
- **TypeScript** : Typage strict activé
- **Prettier** : Formatage automatique
- **Conventions** : CamelCase pour les variables, PascalCase pour les composants

### Workflow Git
1. Fork du repository
2. Création d'une branche feature
3. Développement avec tests
4. Pull Request avec description détaillée

---

*Cette documentation est maintenue à jour avec les évolutions du projet. Pour toute question, consulter les issues GitHub ou contacter l'équipe de développement.*