# Documentation des Composants - Lubu

## Vue d'ensemble

Cette documentation décrit la structure et l'utilisation des composants React de l'application Lubu. Chaque composant est conçu pour être réutilisable, typé avec TypeScript et optimisé pour les performances.

## Architecture des Composants

### Hiérarchie

```
app/components/
├── auth/                   # Authentification
│   ├── Auth.tsx           # Composant principal d'auth
│   ├── LoginForm.tsx      # Formulaire de connexion
│   └── RegisterForm.tsx   # Formulaire d'inscription
├── forms/                 # Formulaires réutilisables
│   ├── ExpenseForm.tsx    # Formulaire de dépense
│   ├── RevenueForm.tsx    # Formulaire de revenu
│   └── BudgetForm.tsx     # Formulaire de budget
├── graphiques/            # Visualisations
│   ├── GraphiquePage.tsx  # Page principale graphiques
│   ├── Budget.tsx         # Composant budget principal
│   ├── AnnualExpense.tsx  # Dépenses annuelles
│   ├── RevenueByMonth.tsx # Revenus mensuels
│   └── expenseBymonth.tsx # Dépenses mensuelles
├── home/                  # Page d'accueil
│   └── HomePage.tsx       # Tableau de bord principal
├── profile/               # Gestion profil
│   └── ProfilePage.tsx    # Page de profil
├── shared/                # Composants partagés
│   ├── header/            # En-tête de l'application
│   ├── navigation/        # Navigation principale
│   └── layout/            # Layouts réutilisables
├── transactions/          # Gestion transactions
│   ├── AllExpenses.tsx    # Liste des dépenses
│   ├── AllRevenues.tsx    # Liste des revenus
│   └── ExpenseByCatgory.tsx # Dépenses par catégorie
└── ui/                    # Composants UI de base
    ├── card/              # Composants de carte
    ├── button/            # Boutons stylisés
    ├── input/             # Champs de saisie
    └── modal/             # Modales
```

## Composants Principaux

### 🏠 HomePage.tsx

**Description :** Tableau de bord principal affichant un résumé des finances.

**Props :**
```typescript
interface HomePageProps {
  user?: User;
  refreshData?: () => void;
}
```

**Fonctionnalités :**
- Affichage du solde total
- Résumé des dernières transactions
- Graphiques récapitulatifs
- Actions rapides (ajout dépense/revenu)

**Usage :**
```tsx
import HomePage from '@/components/home/HomePage';

<HomePage user={currentUser} refreshData={handleRefresh} />
```

---

### 📊 GraphiquePage.tsx

**Description :** Page de visualisation avec tous les graphiques.

**Structure :**
```tsx
const GraphiquePage: React.FC = () => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 p-4">
            <AnnualExpense/>
            <AnnualExpenseByMonth/>
            <AnnualRevenueByMonth/>
            <ExpenseByCategory/>
            <AnnualExpensesByCategory/>
        </div>
    );
};
```

**Composants inclus :**
- `AnnualExpense` : Dépenses annuelles totales
- `AnnualExpenseByMonth` : Dépenses par mois
- `AnnualRevenueByMonth` : Revenus par mois
- `ExpenseByCategory` : Répartition par catégorie
- `AnnualExpensesByCategory` : Évolution par catégorie

---

### 📈 RevenueByMonth.tsx

**Description :** Graphique en barres des revenus mensuels sur 12 mois.

**Fonctionnalités :**
- Récupération automatique des données
- Calcul des 12 derniers mois
- Affichage graphique avec Recharts
- Gestion des états de chargement/erreur

**Code clé :**
```tsx
// Génération des 12 derniers mois
const getLast12Months = () => {
    const now = new Date();
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
                   "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const currentMonthIndex = now.getMonth();
    
    return [
        ...months.slice(currentMonthIndex + 1),
        ...months.slice(0, currentMonthIndex + 1)
    ];
};
```

**Graphique Recharts :**
```tsx
<ResponsiveContainer width="100%" height={200}>
    <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Dépenses" fill="#38b044" />
    </BarChart>
</ResponsiveContainer>
```

---

### 💳 Budget.tsx

**Description :** Composant de gestion du budget avec navigation entre dépenses et revenus.

**État :**
```typescript
const [request, setRequest] = useState<string>("Expenses");
```

**Navigation :**
```tsx
<button
    onClick={() => setRequest("Expenses")}
    className={`transition ${
        request === "Expenses"
            ? "bg-blue-500 text-white shadow-lg"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
>
    Dépenses
</button>
```

**Rendu conditionnel :**
```tsx
{request === "Expenses" ? <AllExpenses /> : <AllRevenues />}
```

---

### 🔐 Auth.tsx

**Description :** Composant d'authentification avec gestion des formulaires.

**Fonctionnalités :**
- Basculement connexion/inscription
- Validation des formulaires
- Gestion des erreurs d'authentification
- Redirection après connexion

**Gestion d'état :**
```typescript
const [isLogin, setIsLogin] = useState(true);
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
```

---

### 📝 AllExpenses.tsx & AllRevenues.tsx

**Description :** Listes paginées des transactions avec fonctionnalités CRUD.

**Fonctionnalités communes :**
- Affichage paginé des données
- Recherche et filtrage
- Ajout/modification/suppression
- Tri par date, montant, catégorie

**Structure type :**
```tsx
interface TransactionListProps {
    onAdd?: (transaction: Transaction) => void;
    onEdit?: (id: string, data: Partial<Transaction>) => void;
    onDelete?: (id: string) => void;
    filters?: TransactionFilters;
}
```

## Composants UI Réutilisables

### 🎨 Système de Design

#### Couleurs Tailwind Personnalisées
```css
/* globals.css */
:root {
    --primary: #3b82f6;       /* Blue-500 */
    --secondary: #10b981;     /* Emerald-500 */
    --accent: #f59e0b;        /* Amber-500 */
    --danger: #ef4444;        /* Red-500 */
    --text-muted: #6b7280;    /* Gray-500 */
}
```

#### Composants Button
```tsx
interface ButtonProps {
    variant: 'primary' | 'secondary' | 'danger';
    size: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
    variant, size, loading, children, onClick 
}) => {
    const baseClasses = "font-semibold rounded-lg transition";
    const variantClasses = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        danger: "bg-red-500 text-white hover:bg-red-600"
    };
    const sizeClasses = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg"
    };
    
    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
            onClick={onClick}
            disabled={loading}
        >
            {loading ? 'Chargement...' : children}
        </button>
    );
};
```

#### Composants Input
```tsx
interface InputProps {
    type: 'text' | 'email' | 'password' | 'number' | 'date';
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({
    type, placeholder, value, onChange, error, required
}) => {
    return (
        <div className="w-full">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none 
                          focus:ring-2 transition ${
                    error 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200'
                }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};
```

#### Composants Card
```tsx
interface CardProps {
    title?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, actions, className }) => {
    return (
        <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
            {title && (
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
};
```

## Hooks Personnalisés

### useAuth
```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import api from '@/lib/api';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        checkAuth();
    }, []);
    
    const checkAuth = async () => {
        try {
            const response = await api.get('/protected');
            setUser(response.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    const login = async (email: string, password: string) => {
        await api.post('/auth', { email, password });
        await checkAuth();
    };
    
    const logout = async () => {
        await api.post('/logout');
        setUser(null);
    };
    
    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };
};
```

### useTransactions
```typescript
// hooks/useTransactions.ts
import { useState, useEffect } from 'react';
import { Expense, Revenue } from '@/types';
import api from '@/lib/api';

interface UseTransactionsReturn {
    expenses: Expense[];
    revenues: Revenue[];
    loading: boolean;
    error: string | null;
    addExpense: (expense: Omit<Expense, '_id'>) => Promise<void>;
    addRevenue: (revenue: Omit<Revenue, '_id'>) => Promise<void>;
    refreshData: () => Promise<void>;
}

export const useTransactions = (): UseTransactionsReturn => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [revenues, setRevenues] = useState<Revenue[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchData = async () => {
        setLoading(true);
        try {
            const [expensesRes, revenuesRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/revenues')
            ]);
            setExpenses(expensesRes.data.expenses);
            setRevenues(revenuesRes.data.revenues);
        } catch (err) {
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };
    
    const addExpense = async (expense: Omit<Expense, '_id'>) => {
        await api.post('/expenses', expense);
        await fetchData();
    };
    
    const addRevenue = async (revenue: Omit<Revenue, '_id'>) => {
        await api.post('/revenues', revenue);
        await fetchData();
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    
    return {
        expenses,
        revenues,
        loading,
        error,
        addExpense,
        addRevenue,
        refreshData: fetchData
    };
};
```

## Animations avec Framer Motion

### Transitions de Page
```tsx
// components/PageTransition.tsx
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
    direction: number;
}

const pageVariants = {
    initial: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -300 : 300,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeInOut" }
    })
};

const PageTransition: React.FC<PageTransitionProps> = ({ children, direction }) => {
    return (
        <motion.div
            custom={direction}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};
```

### Animations de Liste
```tsx
// Animation pour les listes de transactions
const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 }
    }
};

<motion.div variants={listVariants} initial="hidden" animate="visible">
    {transactions.map(transaction => (
        <motion.div key={transaction._id} variants={itemVariants}>
            <TransactionCard transaction={transaction} />
        </motion.div>
    ))}
</motion.div>
```

## Gestion des Gestes (Swipe)

### Configuration useSwipeable
```tsx
// Dans le composant principal (page.tsx)
import { useSwipeable } from "react-swipeable";

const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    delta: 100,                    // Distance minimum pour déclencher
    trackTouch: true,              // Suivre les mouvements tactiles
    trackMouse: false,             // Ignorer la souris
    preventScrollOnSwipe: true,    // Empêcher le scroll pendant swipe
});

// Application des handlers
<div {...swipeHandlers} className="swipe-container">
    {/* Contenu avec support swipe */}
</div>
```

## Optimisations de Performance

### Lazy Loading
```tsx
import dynamic from 'next/dynamic';

// Chargement différé des composants lourds
const GraphiquePage = dynamic(() => import('./components/graphiques/GraphiquePage'), {
    loading: () => <div className="text-center">Chargement des graphiques...</div>,
    ssr: false // Désactiver le SSR si nécessaire
});
```

### Memoization
```tsx
import React, { memo, useMemo } from 'react';

// Mémoisation des composants
const ExpenseCard = memo<ExpenseCardProps>(({ expense, onEdit, onDelete }) => {
    const formattedDate = useMemo(() => 
        new Date(expense.date).toLocaleDateString('fr-FR'),
        [expense.date]
    );
    
    return (
        <div className="expense-card">
            <span>{expense.description}</span>
            <span>{expense.amount}€</span>
            <span>{formattedDate}</span>
        </div>
    );
});
```

### Virtualization (pour de longues listes)
```tsx
import { FixedSizeList as List } from 'react-window';

const VirtualizedExpenseList: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
        <div style={style}>
            <ExpenseCard expense={expenses[index]} />
        </div>
    );
    
    return (
        <List
            height={400}        // Hauteur du conteneur
            itemCount={expenses.length}
            itemSize={80}       // Hauteur de chaque élément
        >
            {Row}
        </List>
    );
};
```

## Tests des Composants

### Tests Unitaires avec Jest & React Testing Library
```tsx
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button Component', () => {
    test('renders with correct text', () => {
        render(<Button variant="primary" size="md">Test Button</Button>);
        expect(screen.getByText('Test Button')).toBeInTheDocument();
    });
    
    test('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(
            <Button variant="primary" size="md" onClick={handleClick}>
                Click me
            </Button>
        );
        
        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    test('shows loading state', () => {
        render(
            <Button variant="primary" size="md" loading>
                Test
            </Button>
        );
        
        expect(screen.getByText('Chargement...')).toBeInTheDocument();
    });
});
```

### Tests d'Intégration
```tsx
// __tests__/components/ExpenseForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExpenseForm from '@/components/forms/ExpenseForm';

describe('ExpenseForm Integration', () => {
    test('submits form with valid data', async () => {
        const onSubmit = jest.fn();
        render(<ExpenseForm onSubmit={onSubmit} />);
        
        fireEvent.change(screen.getByLabelText('Montant'), {
            target: { value: '25.99' }
        });
        fireEvent.change(screen.getByLabelText('Description'), {
            target: { value: 'Test expense' }
        });
        fireEvent.click(screen.getByText('Ajouter'));
        
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                amount: 25.99,
                description: 'Test expense',
                date: expect.any(String),
                category_id: expect.any(String)
            });
        });
    });
});
```

## Accessibility (A11y)

### Bonnes Pratiques Implémentées
```tsx
// Gestion du focus et des labels
<button
    aria-label="Supprimer la dépense"
    aria-describedby="delete-help"
    onClick={handleDelete}
>
    🗑️
</button>
<div id="delete-help" className="sr-only">
    Cette action est irréversible
</div>

// Navigation au clavier
<div
    tabIndex={0}
    role="button"
    onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
        }
    }}
>
    Élément cliquable
</div>

// Annoncement des changements
<div aria-live="polite" aria-atomic="true">
    {status && <span>{status}</span>}
</div>
```

---

*Cette documentation des composants est maintenue à jour avec l'évolution du code. Référez-vous au code source pour les détails d'implémentation les plus récents.*