# Documentation API - Lubu Budget Management

## Vue d'ensemble

Cette documentation décrit l'API REST de l'application Lubu Budget Management. L'API utilise le système d'authentification JWT et suit les conventions RESTful.

## Base URL

```
Production: https://lubu-liard.vercel.app/api
Développement: http://localhost:3000/api
```

## Authentification

### Système de Tokens

L'API utilise un système d'authentification à double token :

- **Access Token** : Stocké dans un cookie httpOnly, expire en 1 heure
- **Refresh Token** : Stocké dans un cookie httpOnly, expire en 14 jours

### Headers Requis

```http
Content-Type: application/json
Cookie: token=<access_token>; refreshToken=<refresh_token>
```

### Gestion Automatique

Le client Axios configuré gère automatiquement :
- La vérification d'expiration des tokens
- Le rafraîchissement automatique
- La nouvelle tentative des requêtes échouées

## Endpoints d'Authentification

### POST /auth
Connexion d'un utilisateur existant.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse Succès (200) :**
```json
{
  "message": "Authentification réussie"
}
```

**Cookies Définis :**
- `token` : Access token (1h)
- `refreshToken` : Refresh token (14j)

**Erreurs :**
- `401` : Email ou mot de passe incorrect
- `500` : Erreur serveur

---

### GET /protected
Vérification de l'authentification et récupération des informations utilisateur.

**Headers :** Cookies requis

**Réponse Succès (200) :**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "message": "Bienvenue, johndoe!"
}
```

**Erreurs :**
- `401` : Token invalide ou expiré

---

### GET /refresh-token
Rafraîchissement du token d'accès.

**Headers :** Cookie refreshToken requis

**Réponse Succès (200) :**
```json
{
  "message": "Token rafraîchi avec succès"
}
```

**Cookie Mis à Jour :**
- `token` : Nouveau access token

**Erreurs :**
- `401` : Refresh token invalide ou expiré
- `500` : Erreur serveur

---

### POST /logout
Déconnexion de l'utilisateur.

**Réponse Succès (200) :**
```json
{
  "message": "Déconnexion réussie"
}
```

**Cookies Supprimés :**
- `token`
- `refreshToken`

---

### POST /forgot-password
Demande de réinitialisation de mot de passe.

**Body :**
```json
{
  "email": "user@example.com"
}
```

**Réponse Succès (200) :**
```json
{
  "message": "Email de réinitialisation envoyé"
}
```

---

### POST /reset-password
Réinitialisation du mot de passe avec token.

**Body :**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "nouveau_mot_de_passe"
}
```

**Réponse Succès (200) :**
```json
{
  "message": "Mot de passe réinitialisé avec succès"
}
```

---

### PUT /change-password
Changement de mot de passe (utilisateur connecté).

**Headers :** Authentification requise

**Body :**
```json
{
  "currentPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe"
}
```

**Réponse Succès (200) :**
```json
{
  "message": "Mot de passe modifié avec succès"
}
```

**Erreurs :**
- `400` : Mot de passe actuel incorrect
- `401` : Non authentifié

## Endpoints de Gestion des Dépenses

### GET /expenses
Récupération de toutes les dépenses de l'utilisateur.

**Headers :** Authentification requise

**Paramètres Query (optionnels) :**
```
?category_id=<category_id>
&start_date=2024-01-01
&end_date=2024-12-31
&limit=50
&offset=0
```

**Réponse Succès (200) :**
```json
{
  "expenses": [
    {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
      "amount": 85.50,
      "description": "Courses alimentaires",
      "date": "2024-01-15",
      "user_id": "66f1a2b3c4d5e6f7a8b9c0d2",
      "category_id": "66f1a2b3c4d5e6f7a8b9c0d3"
    }
  ],
  "total": 1250.75,
  "count": 45
}
```

---

### POST /expenses
Création d'une nouvelle dépense.

**Headers :** Authentification requise

**Body :**
```json
{
  "amount": 25.99,
  "description": "Café avec collègues",
  "date": "2024-01-20",
  "category_id": "66f1a2b3c4d5e6f7a8b9c0d4"
}
```

**Réponse Succès (201) :**
```json
{
  "message": "Dépense créée avec succès",
  "expense": {
    "_id": "66f1a2b3c4d5e6f7a8b9c0d5",
    "amount": 25.99,
    "description": "Café avec collègues",
    "date": "2024-01-20",
    "user_id": "66f1a2b3c4d5e6f7a8b9c0d2",
    "category_id": "66f1a2b3c4d5e6f7a8b9c0d4"
  }
}
```

**Erreurs :**
- `400` : Données invalides
- `401` : Non authentifié

---

### GET /expenses-by-page
Récupération paginée des dépenses.

**Headers :** Authentification requise

**Paramètres Query :**
```
?page=1&limit=10&sort=date&order=desc
```

**Réponse Succès (200) :**
```json
{
  "expenses": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 12,
    "total_items": 120,
    "per_page": 10,
    "has_next": true,
    "has_previous": false
  }
}
```

## Endpoints de Gestion des Revenus

### GET /revenues
Récupération de tous les revenus de l'utilisateur.

**Headers :** Authentification requise

**Réponse Succès (200) :**
```json
{
  "revenues": [
    {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d6",
      "amount": 3500.00,
      "description": "Salaire mensuel",
      "date": "2024-01-01",
      "user_id": "66f1a2b3c4d5e6f7a8b9c0d2",
      "category_id": "66f1a2b3c4d5e6f7a8b9c0d7"
    }
  ],
  "total": 4200.00,
  "count": 3
}
```

---

### POST /revenues
Création d'un nouveau revenu.

**Headers :** Authentification requise

**Body :**
```json
{
  "amount": 150.00,
  "description": "Freelance project",
  "date": "2024-01-18",
  "category_id": "66f1a2b3c4d5e6f7a8b9c0d8"
}
```

**Réponse Succès (201) :**
```json
{
  "message": "Revenu créé avec succès",
  "revenue": {
    "_id": "66f1a2b3c4d5e6f7a8b9c0d9",
    "amount": 150.00,
    "description": "Freelance project",
    "date": "2024-01-18",
    "user_id": "66f1a2b3c4d5e6f7a8b9c0d2",
    "category_id": "66f1a2b3c4d5e6f7a8b9c0d8"
  }
}
```

---

### GET /revenues-by-page
Récupération paginée des revenus.

**Structure identique à `/expenses-by-page`**

## Endpoints de Gestion du Budget

### GET /budget
Récupération du budget de l'utilisateur.

**Headers :** Authentification requise

**Réponse Succès (200) :**
```json
{
  "budget": {
    "_id": "66f1a2b3c4d5e6f7a8b9c0da",
    "user_id": "66f1a2b3c4d5e6f7a8b9c0d2",
    "monthly_budget": 2500.00,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  "summary": {
    "total_expenses": 1850.75,
    "remaining_budget": 649.25,
    "percentage_used": 74.03
  }
}
```

---

### POST /budget
Création ou mise à jour du budget.

**Headers :** Authentification requise

**Body :**
```json
{
  "monthly_budget": 3000.00
}
```

**Réponse Succès (200) :**
```json
{
  "message": "Budget mis à jour avec succès",
  "budget": {
    "_id": "66f1a2b3c4d5e6f7a8b9c0da",
    "user_id": "66f1a2b3c4d5e6f7a8b9c0d2",
    "monthly_budget": 3000.00,
    "updated_at": "2024-01-20T14:22:33.000Z"
  }
}
```

## Endpoints des Catégories

### GET /expense-categories
Récupération des catégories de dépenses.

**Réponse Succès (200) :**
```json
{
  "categories": [
    {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d3",
      "name": "Alimentation",
      "color": "#4ade80",
      "icon": "🍽️"
    },
    {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d4",
      "name": "Transport",
      "color": "#3b82f6",
      "icon": "🚗"
    }
  ]
}
```

---

### GET /revenue-categories
Récupération des catégories de revenus.

**Structure identique à `/expense-categories`**

## Endpoints de Gestion Utilisateur

### GET /users
Récupération des informations utilisateur.

**Headers :** Authentification requise

**Réponse Succès (200) :**
```json
{
  "user": {
    "id": "66f1a2b3c4d5e6f7a8b9c0d2",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### POST /users
Création d'un nouvel utilisateur.

**Body :**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "username": "janesmith",
  "email": "jane@example.com",
  "password": "motdepasse123"
}
```

**Réponse Succès (201) :**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "66f1a2b3c4d5e6f7a8b9c0db",
    "username": "janesmith",
    "email": "jane@example.com"
  }
}
```

**Erreurs :**
- `400` : Données invalides ou utilisateur existant
- `500` : Erreur serveur

## Codes de Statut HTTP

| Code | Description |
|------|-------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `400` | Requête invalide |
| `401` | Non authentifié |
| `403` | Accès interdit |
| `404` | Ressource non trouvée |
| `422` | Entité non traitable |
| `500` | Erreur serveur |

## Gestion des Erreurs

### Format Standard d'Erreur

```json
{
  "error": "Message d'erreur descriptif",
  "code": "ERROR_CODE",
  "details": {
    "field": "Description de l'erreur spécifique"
  }
}
```

### Erreurs Communes

#### Token Expiré (401)
```json
{
  "error": "Token expiré",
  "code": "TOKEN_EXPIRED"
}
```

#### Données Invalides (400)
```json
{
  "error": "Données de requête invalides",
  "code": "INVALID_DATA",
  "details": {
    "amount": "Le montant doit être supérieur à 0",
    "date": "Format de date invalide"
  }
}
```

## Limitations et Quotas

- **Taux de requêtes** : 100 requêtes/minute par utilisateur
- **Taille maximale** : 1MB par requête
- **Timeout** : 30 secondes par requête
- **Pagination** : Maximum 100 éléments par page

## Exemples d'Intégration

### JavaScript/Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lubu-liard.vercel.app/api',
  withCredentials: true
});

// Création d'une dépense
const createExpense = async (expenseData) => {
  try {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  } catch (error) {
    console.error('Erreur création dépense:', error.response.data);
    throw error;
  }
};
```

### cURL

```bash
# Connexion
curl -X POST https://lubu-liard.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt

# Création d'une dépense (avec cookies)
curl -X POST https://lubu-liard.vercel.app/api/expenses \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "amount": 25.99,
    "description": "Café",
    "date": "2024-01-20",
    "category_id": "66f1a2b3c4d5e6f7a8b9c0d4"
  }'
```

## Versionning

L'API suit le versionning sémantique :
- **Version actuelle** : v1.0.0
- **Compatibilité** : Maintenue pour les versions mineures
- **Changements majeurs** : Notification 30 jours à l'avance

## Support et Contact

- **Issues GitHub** : [Lien vers repository]
- **Documentation** : Mise à jour continue
- **Support** : Par email ou issues GitHub

---

*Cette documentation API est maintenue à jour avec chaque release. Consulter le changelog pour les modifications récentes.*