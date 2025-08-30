# Guide de Développement - Lubu Budget Management

## Configuration de l'Environnement de Développement

### Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **MongoDB** >= 5.0.0
- **Git** >= 2.30.0

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/manu-cj/lubu.git
cd lubu
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**

Créer un fichier `.env.local` à la racine :

```env
# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/lubu

# Secrets JWT
AUTH_SECRET=your-super-secret-jwt-key-min-32-chars
REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Configuration Email (pour reset password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Environnement
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Démarrer MongoDB**
```bash
# Avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou service local
sudo systemctl start mongod
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

## Architecture du Code

### Structure des Dossiers

```
app/
├── (pages)/                    # Pages avec layouts spécifiques
│   ├── forgot-password/        # Page de mot de passe oublié
│   └── reset-password/         # Page de réinitialisation
├── api/                        # Routes API Next.js
│   ├── (post-get)/            # Endpoints classiques
│   │   ├── auth/              # Authentification
│   │   ├── expenses/          # Gestion dépenses
│   │   ├── revenues/          # Gestion revenus
│   │   ├── budget/            # Gestion budget
│   │   └── protected/         # Vérification auth
│   └── (update)/              # Endpoints de modification
│       └── change-password/   # Changement mot de passe
├── components/                 # Composants React
│   ├── auth/                  # Authentification UI
│   ├── forms/                 # Formulaires réutilisables
│   ├── graphiques/            # Composants de visualisation
│   ├── home/                  # Page d'accueil
│   ├── profile/               # Gestion profil
│   ├── shared/                # Composants partagés
│   ├── transactions/          # Gestion transactions
│   └── ui/                    # Composants UI de base
├── controllers/               # Logique métier
│   ├── budgetController.ts    # Logique budget
│   ├── expenseController.ts   # Logique dépenses
│   ├── incomeController.ts    # Logique revenus
│   └── userController.ts      # Logique utilisateur
├── lib/                       # Utilitaires et configurations
│   ├── api.ts                 # Client Axios configuré
│   ├── auth.ts                # Utilitaires JWT
│   ├── DbConnect.ts           # Connexion MongoDB
│   └── sendMail.ts            # Envoi d'emails
├── models/                    # Modèles Mongoose
│   ├── Users.ts               # Modèle utilisateur
│   ├── Expense.ts             # Modèle dépense
│   ├── Revenue.ts             # Modèle revenu
│   └── Budget.ts              # Modèle budget
├── types/                     # Types TypeScript
│   ├── user.ts                # Interface utilisateur
│   ├── expense.ts             # Interface dépense
│   └── ...                    # Autres interfaces
└── validators/                # Validation des données
```

### Conventions de Code

#### Nommage

- **Fichiers** : PascalCase pour les composants (`UserProfile.tsx`)
- **Variables** : camelCase (`userEmail`, `totalAmount`)
- **Constantes** : UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces** : PascalCase avec préfixe I (`IUser`, `IExpense`)
- **Types** : PascalCase (`UserPayload`, `ExpenseData`)

#### Structure des Composants

```typescript
// Imports
import React, { useState, useEffect } from 'react';
import { ComponentProps } from './types';

// Interface pour les props
interface Props {
  title: string;
  onAction: () => void;
}

// Composant principal
const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  // États locaux
  const [loading, setLoading] = useState(false);
  
  // Effets
  useEffect(() => {
    // Logique d'initialisation
  }, []);
  
  // Handlers
  const handleClick = () => {
    setLoading(true);
    onAction();
    setLoading(false);
  };
  
  // Rendu
  return (
    <div className="component-container">
      <h2>{title}</h2>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Chargement...' : 'Action'}
      </button>
    </div>
  );
};

export default MyComponent;
```

#### Structure des API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/DbConnect';
import { validateRequest } from '@/validators/requestValidator';

export async function GET(request: NextRequest) {
  try {
    // 1. Validation de l'authentification
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' }, 
        { status: 401 }
      );
    }
    
    // 2. Connexion base de données
    await connectToDatabase();
    
    // 3. Logique métier
    const data = await getData(user.id);
    
    // 4. Réponse
    return NextResponse.json({ data });
    
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    );
  }
}
```

## Workflow de Développement

### Branches Git

- **main** : Branche de production stable
- **develop** : Branche de développement
- **feature/** : Nouvelles fonctionnalités
- **bugfix/** : Corrections de bugs
- **hotfix/** : Corrections urgentes

### Processus de Feature

1. **Créer une branche**
```bash
git checkout -b feature/nom-de-la-feature
```

2. **Développer et tester**
```bash
# Développement
npm run dev

# Linting
npm run lint
npm run lint -- --fix

# Build
npm run build
```

3. **Commit avec convention**
```bash
git add .
git commit -m "feat: ajouter gestion des catégories personnalisées"
```

#### Convention de Commit

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, point-virgules
- `refactor:` Refactoring de code
- `test:` Ajout de tests
- `chore:` Maintenance

4. **Pull Request**
- Description détaillée des changements
- Screenshots pour les modifications UI
- Tests validés
- Review de code requise

### Testing

#### Tests Unitaires (à implémenter)

```typescript
// __tests__/components/Budget.test.tsx
import { render, screen } from '@testing-library/react';
import Budget from '../components/Budget';

describe('Budget Component', () => {
  test('renders budget information', () => {
    render(<Budget budget={2500} spent={1200} />);
    
    expect(screen.getByText('Budget: 2500€')).toBeInTheDocument();
    expect(screen.getByText('Dépensé: 1200€')).toBeInTheDocument();
  });
});
```

#### Tests d'Intégration API

```typescript
// __tests__/api/expenses.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/expenses';

describe('/api/expenses', () => {
  test('POST creates new expense', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        amount: 25.99,
        description: 'Test expense',
        date: '2024-01-20',
        category_id: 'test-category-id'
      }
    });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(201);
  });
});
```

## Débogage

### Logs de Développement

```typescript
// Utiliser console.log avec préfixe pour le debugging
console.log('[AUTH]', 'Token vérifié:', user);
console.error('[API]', 'Erreur base de données:', error);
console.warn('[PERF]', 'Requête lente détectée:', duration);
```

### Debug avec VS Code

Créer `.vscode/launch.json` :

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Debugging MongoDB

```bash
# Connexion à MongoDB
mongosh "mongodb://localhost:27017/lubu"

# Vérifier les collections
db.users.find().limit(5)
db.expenses.find({ user_id: "user_id" }).sort({ date: -1 })

# Indexes pour performance
db.expenses.createIndex({ user_id: 1, date: -1 })
db.revenues.createIndex({ user_id: 1, date: -1 })
```

## Optimisation des Performances

### Best Practices Frontend

1. **Lazy Loading des Composants**
```typescript
import dynamic from 'next/dynamic';

const GraphiquePage = dynamic(() => import('./GraphiquePage'), {
  loading: () => <p>Chargement des graphiques...</p>
});
```

2. **Memoization avec React**
```typescript
import { memo, useMemo, useCallback } from 'react';

const ExpenseList = memo(({ expenses }) => {
  const sortedExpenses = useMemo(() => 
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date)),
    [expenses]
  );
  
  const handleExpenseClick = useCallback((id) => {
    // Handler logic
  }, []);
  
  return (
    // Component JSX
  );
});
```

3. **Optimisation des Images**
```typescript
import Image from 'next/image';

<Image
  src="/user-avatar.jpg"
  alt="Avatar utilisateur"
  width={50}
  height={50}
  priority={false}
  placeholder="blur"
/>
```

### Optimisations Backend

1. **Cache MongoDB**
```typescript
// Mise en cache des connexions
let cachedConnection: Connection | null = null;

export async function connectToDatabase() {
  if (cachedConnection) return cachedConnection;
  
  cachedConnection = await mongoose.connect(MONGODB_URI);
  return cachedConnection;
}
```

2. **Indexes de Base de Données**
```javascript
// Dans MongoDB
db.expenses.createIndex({ user_id: 1, date: -1 })
db.expenses.createIndex({ user_id: 1, category_id: 1 })
db.revenues.createIndex({ user_id: 1, date: -1 })
```

3. **Pagination Efficace**
```typescript
// Pagination avec offset/limit
const expenses = await Expense.find({ user_id })
  .sort({ date: -1 })
  .skip(page * limit)
  .limit(limit)
  .lean(); // Retourne des objets JS simples
```

## Sécurité

### Validation des Données

```typescript
// validators/expenseValidator.ts
import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().positive().max(999999),
  description: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category_id: z.string().regex(/^[0-9a-fA-F]{24}$/)
});

export function validateExpense(data: unknown) {
  return expenseSchema.safeParse(data);
}
```

### Sanitisation

```typescript
import { sanitize } from 'validator';

// Nettoyer les entrées utilisateur
const cleanDescription = sanitize(description);
const escapedQuery = escapeHtml(searchQuery);
```

### Rate Limiting

```typescript
// middleware/rateLimiter.ts
const requests = new Map();

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute
  
  const requestsInWindow = requests.get(ip) || [];
  const validRequests = requestsInWindow.filter(time => time > windowStart);
  
  if (validRequests.length >= 100) {
    return false; // Rate limit exceeded
  }
  
  validRequests.push(now);
  requests.set(ip, validRequests);
  return true;
}
```

## Déploiement

### Build de Production

```bash
# Build optimisé
npm run build

# Test du build
npm run start

# Analyse du bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### Variables d'Environnement Production

```env
# .env.production
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lubu
NEXT_PUBLIC_API_URL=https://lubu-liard.vercel.app
AUTH_SECRET=production-secret-very-long-and-secure
REFRESH_SECRET=production-refresh-secret-very-long-and-secure
```

### Déploiement Vercel

1. **Configuration Vercel**
```json
// vercel.json
{
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "AUTH_SECRET": "@auth-secret",
    "REFRESH_SECRET": "@refresh-secret"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

2. **Commandes de déploiement**
```bash
# Installation Vercel CLI
npm i -g vercel

# Premier déploiement
vercel

# Déploiements suivants
vercel --prod
```

## Troubleshooting

### Problèmes Courants

#### Erreur de Connexion MongoDB
```
Error: ECONNREFUSED 127.0.0.1:27017
```
**Solution :** Vérifier que MongoDB est démarré
```bash
sudo systemctl status mongod
sudo systemctl start mongod
```

#### Token JWT Invalide
```
JsonWebTokenError: invalid signature
```
**Solution :** Vérifier les variables `AUTH_SECRET` et `REFRESH_SECRET`

#### Build Error - Module Not Found
```
Module not found: Can't resolve './components/...'
```
**Solution :** Vérifier les imports et la casse des fichiers

#### Performance Lente
- Vérifier les indexes MongoDB
- Optimiser les requêtes avec `.lean()`
- Implémenter la pagination
- Utiliser `useMemo` et `useCallback`

### Logs de Production

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(`[INFO] ${message}`, meta);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // En production: envoyer à un service de monitoring
  },
  warn: (message: string, meta?: object) => {
    console.warn(`[WARN] ${message}`, meta);
  }
};
```

## Contribution

### Code Review Checklist

- [ ] Code suit les conventions de nommage
- [ ] Fonctionnalité testée manuellement
- [ ] Pas de données sensibles dans le code
- [ ] Performance optimisée
- [ ] Documentation mise à jour
- [ ] Gestion d'erreur appropriée
- [ ] Types TypeScript corrects

### Pull Request Template

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires passent
- [ ] Tests manuels effectués
- [ ] Build réussit

## Screenshots
(Si applicable)

## Notes pour la review
Points spécifiques à vérifier
```

---

*Ce guide est mis à jour régulièrement. Consultez la dernière version sur GitHub.*