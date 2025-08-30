# Lubu - Application de Gestion de Budget 💰

Une application web moderne et intuitive pour gérer vos finances personnelles, développée avec Next.js et TypeScript.

## ✨ Fonctionnalités

- 📊 **Suivi des dépenses et revenus** - Enregistrez et catégorisez vos transactions
- 📈 **Visualisations interactives** - Graphiques détaillés avec Recharts
- 💳 **Gestion de budget** - Définissez et suivez vos objectifs budgétaires
- 🔐 **Authentification sécurisée** - JWT avec refresh tokens automatiques
- 📱 **Interface responsive** - Optimisée pour mobile et desktop
- 🎨 **Animations fluides** - Transitions avec Framer Motion
- 👆 **Navigation tactile** - Support des gestes de balayage

## 🚀 Démarrage Rapide

### Prérequis
- Node.js >= 18.0.0
- MongoDB en cours d'exécution
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone https://github.com/manu-cj/lubu.git
cd lubu
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration environnement**
Créer `.env.local` :
```env
MONGODB_URI=mongodb://localhost:27017/lubu
AUTH_SECRET=your-jwt-secret-key
REFRESH_SECRET=your-refresh-secret-key
```

4. **Lancer l'application**
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🏗️ Technologies

### Frontend
- **Next.js 15** - Framework React full-stack
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utility-first
- **Framer Motion** - Animations
- **Recharts** - Graphiques et visualisations

### Backend
- **Next.js API Routes** - Endpoints REST
- **MongoDB + Mongoose** - Base de données NoSQL
- **JWT** - Authentification sécurisée
- **bcrypt** - Hachage des mots de passe

### Outils
- **Axios** - Client HTTP avec intercepteurs
- **React Swipeable** - Gestion des gestes
- **ESLint + Prettier** - Qualité du code

## 📖 Documentation

- 📋 **[Documentation Technique Complète](./TECHNICAL_DOCUMENTATION.md)** - Architecture, modèles de données, sécurité
- 🔌 **[Documentation API](./API_DOCUMENTATION.md)** - Endpoints, authentification, exemples
- 👨‍💻 **[Guide Développeur](./DEVELOPER_GUIDE.md)** - Setup, conventions, contribution

## 🎯 Fonctionnalités Détaillées

### Gestion des Transactions
- Ajout/modification/suppression de dépenses et revenus
- Catégorisation automatique
- Recherche et filtrage avancés
- Pagination optimisée

### Visualisations
- Graphiques mensuels et annuels
- Répartition par catégories
- Évolution des dépenses dans le temps
- Comparaisons budgétaires

### Sécurité
- Authentification JWT avec refresh automatique
- Cookies httpOnly sécurisés
- Validation côté client et serveur
- Protection CSRF et XSS

### Interface Utilisateur
- Design responsive mobile-first
- Navigation par onglets et swipe
- Animations de transition
- Feedback visuel temps réel

## 🔧 Scripts Disponibles

```bash
npm run dev          # Développement avec hot-reload
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification du code
npm run lint:fix     # Correction automatique
```

## 📊 Aperçu de l'Application

### Page d'Accueil
- Vue d'ensemble du budget
- Graphiques récapitulatifs
- Actions rapides

### Gestion des Transactions
- Liste paginée des dépenses/revenus
- Formulaires d'ajout intuitifs
- Filtres par date et catégorie

### Graphiques et Analytics
- Visualisations interactives
- Données en temps réel
- Exports possibles

## 🌟 Points Techniques Remarquables

### Architecture
- Structure modulaire avec séparation des responsabilités
- Typage TypeScript strict
- API RESTful avec Next.js

### Performance
- Cache de connexion MongoDB
- Lazy loading des composants
- Optimisation des rendus React

### Expérience Utilisateur
- Navigation fluide avec animations
- Gestes tactiles naturels
- Feedback visuel immédiat

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez le [Guide Développeur](./DEVELOPER_GUIDE.md) pour :
- Configuration de l'environnement
- Conventions de code
- Processus de Pull Request
- Tests et debugging

## 📝 Roadmap

### Version 1.1
- [ ] Notifications push
- [ ] Thèmes personnalisables
- [ ] Export PDF/Excel

### Version 1.2
- [ ] Synchronisation multi-appareils
- [ ] API publique
- [ ] Intégrations bancaires

### Version 2.0
- [ ] Machine Learning pour prédictions
- [ ] Application mobile native
- [ ] Fonctionnalités collaboratives

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🚀 Déploiement

### Production
L'application est déployée sur Vercel : [https://lubu-liard.vercel.app](https://lubu-liard.vercel.app)

### Déploiement Personnel
```bash
# Avec Vercel
npm i -g vercel
vercel

# Ou autres plateformes
npm run build
npm run start
```

## 📞 Support

- 🐛 **Issues** : [GitHub Issues](https://github.com/manu-cj/lubu/issues)
- 📧 **Contact** : Via GitHub ou email
- 📚 **Documentation** : Consultez les guides détaillés

---

**Développé avec ❤️ par [manu-cj](https://github.com/manu-cj)**

*Gérez vos finances simplement et efficacement avec Lubu !*
